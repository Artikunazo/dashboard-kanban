import {
	ActionReducerMap,
	createFeatureSelector,
	createSelector,
} from '@ngrx/store';
import * as fromTasksReducer from './tasks_reducer';
import * as fromThemeReducer from './theme_reducer';

export interface AppState {
	tasks: fromTasksReducer.TasksState;
	theme: fromThemeReducer.ThemeState;
}

export const reducers: ActionReducerMap<AppState, any> = {
	tasks: fromTasksReducer.reducer,
	theme: fromThemeReducer.reducer,
};

/* TASKS */
export const getTasksState =
	createFeatureSelector<fromTasksReducer.TasksState>('tasks');

export const getTasksData = createSelector(
	getTasksState,
	fromTasksReducer.getTasksData,
);

export const getTasksSelectors = fromTasksReducer.taskAdapter.getSelectors();

export const getTasks = createSelector(
	getTasksState,
	getTasksSelectors.selectAll,
);

/* THEME */
export const getThemeState =
	createFeatureSelector<fromThemeReducer.ThemeState>('theme');

export const getTheme = createSelector(
	getThemeState,
	fromThemeReducer.getTheme,
);
