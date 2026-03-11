export interface Column {
    id: string;
    board_id: string;
    title: string;
    position: number;
}

export interface Task {
    id: string;
    column_id: string;
    title: string;
    description: string;
    position: number;
    assigned_to: string;
    avatar_url?: string;
}

export interface BoardData {
    columns: Column[];
    tasks: Task[];
}