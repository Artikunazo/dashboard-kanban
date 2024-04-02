import {Update} from '@ngrx/entity';
import {Action} from '@ngrx/store';
import {TasksModels} from 'src/app/models/tasks_models';

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
}
