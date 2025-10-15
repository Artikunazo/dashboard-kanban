-- PostgreSQL Script migrated from MySQL
-- Migration Date: 2025-10-15
-- Original MySQL Workbench Script

-- -----------------------------------------------------
-- Table boards
-- -----------------------------------------------------
DROP TABLE IF EXISTS "boards" CASCADE;

CREATE TABLE "boards" (
  "id_board" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  PRIMARY KEY ("id_board")
);

-- -----------------------------------------------------
-- Table status
-- -----------------------------------------------------
DROP TABLE IF EXISTS "status" CASCADE;

CREATE TABLE "status" (
  "id_status" SERIAL NOT NULL,
  "status" TEXT NOT NULL,
  PRIMARY KEY ("id_status")
);

-- -----------------------------------------------------
-- Table tasks
-- -----------------------------------------------------
DROP TABLE IF EXISTS "tasks" CASCADE;

CREATE TABLE "tasks" (
  "id_task" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "id_board" INT NOT NULL,
  "id_status" INT NOT NULL,
  PRIMARY KEY ("id_task"),
  CONSTRAINT "fk_tasks_boards"
    FOREIGN KEY ("id_board")
    REFERENCES "boards" ("id_board")
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT "fk_tasks_status"
    FOREIGN KEY ("id_status")
    REFERENCES "status" ("id_status")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table subtasks
-- -----------------------------------------------------
DROP TABLE IF EXISTS "subtasks" CASCADE;

CREATE TABLE "subtasks" (
  "id_subtask" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "is_done" BOOLEAN NOT NULL DEFAULT FALSE,
  "id_task" INT NOT NULL,
  PRIMARY KEY ("id_subtask"),
  CONSTRAINT "fk_subtasks_tasks"
    FOREIGN KEY ("id_task")
    REFERENCES "tasks" ("id_task")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Insert initial status data
INSERT INTO "status" ("status") VALUES ('ToDo');
INSERT INTO "status" ("status") VALUES ('Doing');
INSERT INTO "status" ("status") VALUES ('Done');
