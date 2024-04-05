export interface ITask {
	title: string;
	description: string;
	subtasks: ISubtask[];
	status: string;
	id: string;
}

export interface ISubtask {
	title: string | undefined;
	status: string;
	index?: number;
}

export enum TaskStatus {
	ToDo = 'ToDo',
	Doing = 'Doing',
	Done = 'Done',
}
