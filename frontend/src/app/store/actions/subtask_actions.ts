import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {Subtask} from 'src/app/models/subtask_models';

export enum SubtaskActionType {
	LOAD_SUBTASKS = '[Subtask] Load Subtasks',
	LOAD_SUBTASKS_SUCCESS = '[Subtask] Load Subtasks Success',
	LOAD_SUBTASKS_FAIL = '[Subtask] Load Subtasks Fail',

	ADD_SUBTASK = '[Subtask] Add Subtask',
	ADD_SUBTASK_SUCCESS = '[Subtask] Add Subtask Success',
	ADD_SUBTASK_FAIL = '[Subtask] Add Subtask Fail',

	UPDATE_SUBTASK = '[Subtask] Update Subtask',
	UPDATE_SUBTASK_SUCCESS = '[Subtask] Update Subtask Success',
	UPDATE_SUBTASK_FAIL = '[Subtask] Update Subtask Fail',

	DELETE_SUBTASK = '[Subtask] Delete Subtask',
	DELETE_SUBTASK_SUCCESS = '[Subtask] Delete Subtask Success',
	DELETE_SUBTASK_FAIL = '[Subtask] Delete Subtask Fail',

	CLEAR_SUBTASKS = '[Subtask] Clear Subtasks',
}

export class LoadSubtasks implements Action {
	readonly type = SubtaskActionType.LOAD_SUBTASKS;

	constructor(public payload: string | number) {} // payload = idTask
}

export class LoadSubtasksSuccess implements Action {
	readonly type = SubtaskActionType.LOAD_SUBTASKS_SUCCESS;

	constructor(public payload: Subtask[]) {}
}

export class LoadSubtasksFail implements Action {
	readonly type = SubtaskActionType.LOAD_SUBTASKS_FAIL;

	constructor(public payload: any) {}
}

export class AddSubtask implements Action {
	readonly type = SubtaskActionType.ADD_SUBTASK;

	constructor(public payload: Subtask) {}
}

export class AddSubtaskSuccess implements Action {
	readonly type = SubtaskActionType.ADD_SUBTASK_SUCCESS;

	constructor(public payload: Subtask) {}
}

export class AddSubtaskFail implements Action {
	readonly type = SubtaskActionType.ADD_SUBTASK_FAIL;

	constructor(public payload: any) {}
}

export class DeleteSubtask implements Action {
	readonly type = SubtaskActionType.DELETE_SUBTASK;

	constructor(public payload: number) {} // payload = idSubtask
}

export class DeleteSubtaskSuccess implements Action {
	readonly type = SubtaskActionType.DELETE_SUBTASK_SUCCESS;

	constructor(public payload: any) {}
}

export class DeleteSubtaskFail implements Action {
	readonly type = SubtaskActionType.DELETE_SUBTASK_FAIL;

	constructor(public payload: any) {}
}

export class UpdateSubtask implements Action {
	readonly type = SubtaskActionType.UPDATE_SUBTASK;

	constructor(public payload: Subtask) {}
}

export class UpdateSubtaskSuccess implements Action {
	readonly type = SubtaskActionType.UPDATE_SUBTASK_SUCCESS;

	constructor(public payload: Update<Subtask>) {}
}

export class UpdateSubtaskFail implements Action {
	readonly type = SubtaskActionType.UPDATE_SUBTASK_FAIL;

	constructor(public payload: any) {}
}

export class ClearSubtasks implements Action {
	readonly type = SubtaskActionType.CLEAR_SUBTASKS;
}

export type SubtaskActions =
	| LoadSubtasks
	| LoadSubtasksFail
	| LoadSubtasksSuccess
	| DeleteSubtask
	| DeleteSubtaskFail
	| DeleteSubtaskSuccess
	| UpdateSubtask
	| UpdateSubtaskSuccess
	| UpdateSubtaskFail
	| AddSubtask
	| AddSubtaskSuccess
	| AddSubtaskFail
	| ClearSubtasks;
