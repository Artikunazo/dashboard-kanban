import {Injectable, inject} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of, map, catchError, mergeMap, EMPTY} from 'rxjs';
import {DataService} from 'src/app/api/data.service';
import * as fromTasksAction from '../actions/tasks_actions';
import {ITask} from 'src/app/models/tasks_models';
import * as fromTasksActions from '../actions/tasks_actions';

@Injectable({
	providedIn: 'root',
})
export class TasksEffects {
	protected readonly dataService = inject(DataService);

	constructor(private actions$: Actions) {}

	protected readonly tasksActionsTypes = fromTasksAction.TasksActionType;

	loadTasks$: Observable<Action> = createEffect(() => {
		return this.actions$.pipe(
			ofType(this.tasksActionsTypes.LOAD_TASKS),
			mergeMap(() =>
				this.dataService.loadData().pipe(
					map((response: any) => {
						const data = JSON.parse(response);
						return new fromTasksAction.LoadTasksSuccess(data);
					}),
					catchError((error: any) => {
						return of(new fromTasksAction.LoadTasksFail(error));
					}),
				),
			),
		);
	});

	saveNewTask$: Observable<Action> = createEffect(() => {
		return this.actions$.pipe(
			ofType(this.tasksActionsTypes.ADD_TASK),
			mergeMap((data: fromTasksActions.AddTaskSuccess) => {
				this.dataService.saveData(data.payload);
				return of(new fromTasksAction.SaveTasksSuccess(data.payload));
			}),
		);
	});

	// saveTasks$: Observable<Action> = createEffect(() => {
	// 	return this.actions$.pipe(
	// 		ofType(this.tasksActionsTypes.SAVE_TASKS),
	// 		mergeMap((data: fromTasksActions.AddTaskSuccess) => {
	// 			this.dataService.saveData(data);
	// 			return of(new fromTasksAction.SaveTasksSuccess(data.payload));
	// 		}),
	// 	);
	// });
}
