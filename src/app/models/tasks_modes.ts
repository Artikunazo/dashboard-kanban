export interface ITask {
	title: string;
	description: string;
	subtasks: string[];
	status: TaskStatus;
}

export enum TaskStatus {
	ToDo = 'ToDo',
	Doing = 'Doing',
	Done = 'Done',
}
