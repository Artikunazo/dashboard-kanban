import {ITask, TaskStatus} from '../../models/tasks_models';
import * as fromTasksActions from '../actions/tasks_actions';
import {EntityState, createEntityAdapter} from '@ngrx/entity';

export interface TasksState extends EntityState<ITask> {
	data: ITask[];
	error: string;
}

export const taskAdapter = createEntityAdapter<ITask>({
	selectId: (task) => task.id ?? '',
});

export const initialState: TasksState = taskAdapter.getInitialState({
	data: [],
	error: '',
});

export function reducer(
	state = initialState,
	action: fromTasksActions.TasksActions,
): TasksState {
	const tasksActionTypes = fromTasksActions.TasksActionType;

	switch (action.type) {
		case tasksActionTypes.LOAD_TASKS_SUCCESS: {
			return taskAdapter.setAll(<[]>action.payload, state);
		}

		case tasksActionTypes.LOAD_TASKS_FAIL: {
			return {...state, error: action.payload};
		}

		case tasksActionTypes.ADD_TASK_SUCCESS: {
			return taskAdapter.addOne(action.payload, state);
		}

		case tasksActionTypes.ADD_TASK_FAIL: {
			return {...state, error: action.payload};
		}

		case tasksActionTypes.UPDATE_TASK_SUCCESS: {
			return taskAdapter.updateOne(action.payload, state);
		}

		case tasksActionTypes.UPDATE_TASK_FAIL: {
			return {...state, error: action.payload};
		}

		case tasksActionTypes.DELETE_TASK_SUCCESS: {
			return taskAdapter.removeOne(action.payload, state);
		}

		case tasksActionTypes.DELETE_TASK_FAIL: {
			return {...state, error: action.payload};
		}

		case tasksActionTypes.SAVE_TASKS_SUCCESS: {
			return {...state};
		}

		default: {
			return state;
		}
	}
}

export const getTasksData = (state: TasksState) => state.data;
