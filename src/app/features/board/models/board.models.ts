export interface Column {
	id: string;
	board_id: string;
	title: string;
	position: string;
}

export interface Task {
	id: string;
	column_id: string;
	position: string;
	title: string;
	description?: string;
	assignee_id?: string;
	assignee?: {
		name: string;
		avatar_url?: string;
	};
}

export interface BoardData {
	columns: Column[];
	tasks: Task[];
}
