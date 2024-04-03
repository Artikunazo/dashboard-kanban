import {
	ActionReducerMap,
	createFeatureSelector,
	createSelector,
} from '@ngrx/store';
import * as fromTasksReducer from './tasks_reducer';

export interface AppState {
	tasks: fromTasksReducer.TasksState;
}

export const reducers: ActionReducerMap<AppState, any> = {
	tasks: fromTasksReducer.reducer,
};

/* TASKS */
export const getTasksState =
	createFeatureSelector<fromTasksReducer.TasksState>('tasks');

export const getTasksData = createSelector(
	getTasksState,
	fromTasksReducer.getTasksData,
);
