export interface ITask {
	title: string;
	description: string;
	subtasks: ISubtasks[];
	status: string;
	id?: string;
}

export interface ISubtasks {
	title: string;
}

export enum TaskStatus {
	ToDo = 'ToDo',
	Doing = 'Doing',
	Done = 'Done',
}
