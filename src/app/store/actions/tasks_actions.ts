import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {ITask} from '../../models/tasks_models';

export enum TasksActionType {
	LOAD_TASKS = '[Task] Load Tasks',
	LOAD_TASKS_SUCCESS = '[Task] Load Tasks Success',
	LOAD_TASKS_FAIL = '[Task] Load Tasks Fail',

	ADD_TASK = '[Task] Add task',
	ADD_TASK_SUCCESS = '[Task] Add task success',
	ADD_TASK_FAIL = '[Task] Add Task Fail',

	UPDATE_TASK = '[Task] Update task',
	UPDATE_TASK_SUCCESS = '[Task] Update Task Success',
	UPDATE_TASK_FAIL = '[Task] Update Task Fail',

	DELETE_TASK = '[Task] Delete Task',
	DELETE_TASK_SUCCESS = '[Task] Delete Task Success',
	DELETE_TASK_FAIL = '[Task] Delete Task Fail',

	SAVE_TASKS = '[Task] Save Task',
	SAVE_TASKS_SUCCESS = '[Task] Save Task Success',
	SAVE_TASKS_FAIL = '[Task] Save Task Fail',
}

// LOAD
export class LoadTasks implements Action {
	readonly type = TasksActionType.LOAD_TASKS;
}

export class LoadTasksSuccess implements Action {
	readonly type = TasksActionType.LOAD_TASKS_SUCCESS;

	constructor(public payload: ITask[]) {}
}

export class LoadTasksFail implements Action {
	readonly type = TasksActionType.LOAD_TASKS_FAIL;

	constructor(public payload: string) {}
}

// ADD
export class AddTask implements Action {
	readonly type = TasksActionType.ADD_TASK;

	constructor(public payload: ITask) {}
}

export class AddTaskSuccess implements Action {
	readonly type = TasksActionType.ADD_TASK_SUCCESS;

	constructor(public payload: ITask) {}
}

export class AddTaskFail implements Action {
	readonly type = TasksActionType.ADD_TASK_FAIL;

	constructor(public payload: string) {}
}

// UPDATE
export class UpdateTask implements Action {
	readonly type = TasksActionType.UPDATE_TASK;

	constructor(public payload: ITask) {}
}

export class UpdateTasksSuccess implements Action {
	readonly type = TasksActionType.UPDATE_TASK_SUCCESS;

	constructor(public payload: Update<ITask>) {}
}

export class UpdateTasksFail implements Action {
	readonly type = TasksActionType.UPDATE_TASK_FAIL;

	constructor(public payload: string) {}
}

// DELETE
export class DeleteTask implements Action {
	readonly type = TasksActionType.DELETE_TASK;

	constructor(public payload: string) {}
}

export class DeleteTaskSuccess implements Action {
	readonly type = TasksActionType.DELETE_TASK_SUCCESS;

	constructor(public payload: string) {}
}

export class DeleteTaskFail implements Action {
	readonly type = TasksActionType.DELETE_TASK_FAIL;

	constructor(public payload: string) {}
}

// SAVE
export class SaveTasks implements Action {
	readonly type = TasksActionType.SAVE_TASKS;
}

export class SaveTasksSuccess implements Action {
	readonly type = TasksActionType.SAVE_TASKS_SUCCESS;

	constructor(public payload: ITask) {}
}

export type TasksActions =
	| LoadTasks
	| LoadTasksSuccess
	| LoadTasksFail
	| AddTask
	| AddTaskSuccess
	| AddTaskFail
	| UpdateTask
	| UpdateTasksSuccess
	| UpdateTasksFail
	| DeleteTask
	| DeleteTaskSuccess
	| DeleteTaskFail
	| SaveTasks
	| SaveTasksSuccess;
