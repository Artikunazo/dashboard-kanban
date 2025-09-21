import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {Task} from 'src/app/models/tasks_models';

export enum TasksActionType {
	LOAD_TASK = '[Task] Load Task',
	LOAD_TASK_SUCCESS = '[Task] Load Task Success',
	LOAD_TASK_FAIL = '[Task] Load Task Fail',

	LOAD_TASKS_BY_BOARD = '[Task] Load Tasks by Board',
	LOAD_TASKS_BY_BOARD_SUCCESS = '[Task] Load Tasks by Board Success',
	LOAD_TASKS_BY_BOARD_FAIL = '[Task] Load Tasks by Board Fail',

	ADD_TASK = '[Task] Add task',
	ADD_TASK_SUCCESS = '[Task] Add task success',
	ADD_TASK_FAIL = '[Task] Add Task Fail',

	UPDATE_TASK = '[Task] Update task',
	UPDATE_TASK_SUCCESS = '[Task] Update Task Success',
	UPDATE_TASK_FAIL = '[Task] Update Task Fail',

	DELETE_TASK = '[Task] Delete Task',
	DELETE_TASK_SUCCESS = '[Task] Delete Task Success',
	DELETE_TASK_FAIL = '[Task] Delete Task Fail',

	SAVE_TASK = '[Task] Save Task',
	SAVE_TASK_SUCCESS = '[Task] Save Task Success',
	SAVE_TASK_FAIL = '[Task] Save Task Fail',

	CLEAN_TASK_SELECTED = '[Task] Clean task selected',

	UPDATE_TASK_STATUS = '[Task] Update Task Status ',
	UPDATE_TASK_STATUS_SUCCESS = '[Task] Update Task Status  Success',
	UPDATE_TASK_STATUS_FAIL = '[Task] Update Task Status  Fail',
}

// LOAD
export class LoadTask implements Action {
	readonly type = TasksActionType.LOAD_TASK;

	constructor(public payload: Task) {}
}

export class LoadTaskSuccess implements Action {
	readonly type = TasksActionType.LOAD_TASK_SUCCESS;

	constructor(public payload: Task) {}
}

export class LoadTaskFail implements Action {
	readonly type = TasksActionType.LOAD_TASK_FAIL;

	constructor(public payload: any) {}
}

export class LoadTasksByBoard implements Action {
	readonly type = TasksActionType.LOAD_TASKS_BY_BOARD;

	constructor(public payload: number) {}
}

export class LoadTasksByBoardSuccess implements Action {
	readonly type = TasksActionType.LOAD_TASKS_BY_BOARD_SUCCESS;

	constructor(public payload: Task[]) {}
}

export class LoadTasksByBoardFail implements Action {
	readonly type = TasksActionType.LOAD_TASKS_BY_BOARD_FAIL;

	constructor(public payload: any) {}
}

// ADD
export class AddTask implements Action {
	readonly type = TasksActionType.ADD_TASK;

	constructor(public payload: Task) {}
}

export class AddTaskSuccess implements Action {
	readonly type = TasksActionType.ADD_TASK_SUCCESS;

	constructor(public payload: Task) {}
}

export class AddTaskFail implements Action {
	readonly type = TasksActionType.ADD_TASK_FAIL;

	constructor(public payload: any) {}
}

// UPDATE
export class UpdateTask implements Action {
	readonly type = TasksActionType.UPDATE_TASK;

	constructor(public payload: Task) {}
}

export class UpdateTasksSuccess implements Action {
	readonly type = TasksActionType.UPDATE_TASK_SUCCESS;

	constructor(public payload: Update<Task>) {}
}

export class UpdateTasksFail implements Action {
	readonly type = TasksActionType.UPDATE_TASK_FAIL;

	constructor(public payload: string) {}
}

// DELETE
export class DeleteTask implements Action {
	readonly type = TasksActionType.DELETE_TASK;

	constructor(public payload: string | number) {}
}

export class DeleteTaskSuccess implements Action {
	readonly type = TasksActionType.DELETE_TASK_SUCCESS;

	constructor(public payload: any) {}
}

export class DeleteTaskFail implements Action {
	readonly type = TasksActionType.DELETE_TASK_FAIL;

	constructor(public payload: any) {}
}

// SAVE
export class SaveTask implements Action {
	readonly type = TasksActionType.SAVE_TASK;

	constructor(public payload: Task) {}
}

export class SaveTaskSuccess implements Action {
	readonly type = TasksActionType.SAVE_TASK_SUCCESS;

	constructor(public payload: Task) {}
}

export class SaveTaskFail implements Action {
	readonly type = TasksActionType.SAVE_TASK_FAIL;

	constructor(public payload: any) {}
}

export class CleanTaskSelected implements Action {
	readonly type = TasksActionType.CLEAN_TASK_SELECTED;
}

export class UpdateStatusTask implements Action {
	readonly type = TasksActionType.UPDATE_TASK_STATUS;

	constructor(public payload: {task: Task; status: string}) {}
}

export class UpdateStatusTaskSuccess implements Action {
	readonly type = TasksActionType.UPDATE_TASK_STATUS_SUCCESS;

	constructor(public payload: Update<Task>) {}
}

export class UpdateStatusTaskFail implements Action {
	readonly type = TasksActionType.UPDATE_TASK_STATUS_FAIL;

	constructor(public payload: any) {}
}

export type TasksActions =
	| LoadTask
	| LoadTaskSuccess
	| LoadTaskFail
	| LoadTasksByBoard
	| LoadTasksByBoardSuccess
	| LoadTasksByBoardFail
	| AddTask
	| AddTaskSuccess
	| AddTaskFail
	| UpdateTask
	| UpdateTasksSuccess
	| UpdateTasksFail
	| DeleteTask
	| DeleteTaskSuccess
	| DeleteTaskFail
	| SaveTask
	| SaveTaskSuccess
	| SaveTaskFail
	| CleanTaskSelected
	| UpdateStatusTask
	| UpdateStatusTaskSuccess
	| UpdateStatusTaskFail;
