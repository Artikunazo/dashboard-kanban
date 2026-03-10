CREATE EXTENSION IF NOT EXISTS "pgcrypto";

--======================================================
-- Table: Team members
--======================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
);

--======================================================
-- Table: Boards
--======================================================
CREATE TABLE boards(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
 );

--======================================================
-- Table: Columns / Status
--======================================================
CREATE TABLE columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    position NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

--======================================================
-- Table: Tasks
--======================================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    position TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

--======================================================
-- Table: Subtasks
--======================================================
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

--======================================================
-- RLS
--======================================================
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can view team members" 
    ON team_members FOR SELECT USING (true);

CREATE POLICY "Visitors can manage their own boards" 
    ON boards FOR ALL USING (auth.uid() = visitor_id);

CREATE POLICY "Visitors can manage columns of their boards" 
    ON columns FOR ALL USING (
        EXISTS (
            SELECT 1 FROM boards 
            WHERE boards.id = columns.board_id AND boards.visitor_id = auth.uid()
        )
    );

CREATE POLICY "Visitors can manage tasks of their boards" 
    ON tasks FOR ALL USING (
        EXISTS (
            SELECT 1 FROM columns 
            JOIN boards ON boards.id = columns.board_id 
            WHERE columns.id = tasks.column_id AND boards.visitor_id = auth.uid()
        )
    );

CREATE POLICY "Visitors can manage subtasks of their boards" 
    ON subtasks FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN columns ON columns.id = tasks.column_id
            JOIN boards ON boards.id = columns.board_id
            WHERE tasks.id = subtasks.task_id AND boards.visitor_id = auth.uid()
        )
    );

CREATE OR REPLACE FUNCTION update_board_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE boards SET updated_at = NOW() 
  WHERE id = (SELECT board_id FROM columns WHERE id = NEW.column_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_board_time
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_board_timestamp();


-- CRON
SELECT cron.schedule(
  'limpieza-inactividad-tableros',
  '0 * * * *', -- Revisar cada hora
  $$ 
    -- Borrar tableros cuya ÚLTIMA ACTUALIZACIÓN fue hace más de 2 horas
    DELETE FROM boards 
    WHERE updated_at < NOW() - INTERVAL '2 hours'; 
  $$
);




--##########################################################
-- DATA SEED
--##########################################################
TRUNCATE TABLE team_members CASCADE;

INSERT INTO team_members (name, avatar_url, role) VALUES 
('Mike Rosoft', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=b6e3f4', 'Frontend Developer'),
('Alan Brito', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alan&backgroundColor=c0aede', 'Backend Developer'),
('Elsa Pato', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elsa&backgroundColor=ffdfbf', 'QA Engineer'),
('Susana Horia', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susana&backgroundColor=f4d8e8', 'Project Manager');

CREATE OR REPLACE FUNCTION create_demo_board(new_visitor_id UUID)
RETURNS UUID AS $$
DECLARE
  new_board_id UUID;
  col_todo UUID;
  col_inprogress UUID;
  col_done UUID;
  task_1 UUID;
  task_2 UUID;
  mike_id UUID;
  elsa_id UUID;
BEGIN
  SELECT id INTO mike_id FROM team_members WHERE name = 'Mike Rosoft' LIMIT 1;
  SELECT id INTO elsa_id FROM team_members WHERE name = 'Elsa Pato' LIMIT 1;

  INSERT INTO boards (visitor_id, title, description)
  VALUES (new_visitor_id, '🚀 Demo Project', 'Auto-generated board to explore all features.')
  RETURNING id INTO new_board_id;

  INSERT INTO columns (board_id, title, color, position) 
  VALUES (new_board_id, 'To Do', '#ef4444', 1) RETURNING id INTO col_todo;
  
  INSERT INTO columns (board_id, title, color, position) 
  VALUES (new_board_id, 'In Progress', '#f59e0b', 2) RETURNING id INTO col_inprogress;
  
  INSERT INTO columns (board_id, title, color, position) 
  VALUES (new_board_id, 'Done', '#10b981', 3) RETURNING id INTO col_done;
  
  -- 'To Do'
  INSERT INTO tasks (column_id, assignee_id, title, description, position)
  VALUES (col_todo, mike_id, 'Integrate Supabase', 'Connect the database and test realtime subscriptions.', 'a')
  RETURNING id INTO task_1;

  INSERT INTO tasks (column_id, assignee_id, title, description, position)
  VALUES (col_todo, NULL, 'Design with Tailwind CSS', 'Migrate styles and make columns fully responsive.', 'b');

  -- 'In Progress'
  INSERT INTO tasks (column_id, assignee_id, title, description, position)
  VALUES (col_inprogress, elsa_id, 'Tweak LexoRank algorithm', 'Calculate the intermediate string on drag and drop events.', 'a')
  RETURNING id INTO task_2;

  -- 'Done'
  INSERT INTO tasks (column_id, assignee_id, title, description, position)
  VALUES (col_done, mike_id, 'Database Refactoring', 'Apply relational model and configure RLS policies.', 'a');

  INSERT INTO subtasks (task_id, title, is_completed) VALUES (task_1, 'Create project', true);
  INSERT INTO subtasks (task_id, title, is_completed) VALUES (task_1, 'Execute SQL script', true);
  INSERT INTO subtasks (task_id, title, is_completed) VALUES (task_1, 'Configure anonymous auth', false);
  
  INSERT INTO subtasks (task_id, title, is_completed) VALUES (task_2, 'Test move up', false);
  INSERT INTO subtasks (task_id, title, is_completed) VALUES (task_2, 'Test move down', false);

  RETURN new_board_id;
END;
$$ LANGUAGE plpgsql;
