export interface ITask {
	title: string;
	description: string;
}

export interface ITasks {
	title: string;
	subtasks: ITasks[];
}
