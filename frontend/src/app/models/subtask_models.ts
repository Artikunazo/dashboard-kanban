export interface Subtask {
	id?: number | null;
	title: string;
	isDone: boolean;
	taskId: string | number | null;
}

export interface ApiSubtask {
	subtaskId: number | null;
	titleSubtask: string;
	done: number;
	taskId: string | number | null;
}
