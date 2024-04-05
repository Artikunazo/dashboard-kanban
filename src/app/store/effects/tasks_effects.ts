import {Injectable, inject} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of, map, catchError, mergeMap} from 'rxjs';
import {DataService} from '../../api/data.service';
import * as fromTasksAction from '../actions/tasks_actions';
import * as fromTasksActions from '../actions/tasks_actions';

@Injectable({
	providedIn: 'root',
})
export class TasksEffects {
	constructor(
		private actions$: Actions,
		private readonly dataService: DataService,
	) {}

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

	saveTaskUpdated$: Observable<Action> = createEffect(() => {
		return this.actions$.pipe(
			ofType(this.tasksActionsTypes.UPDATE_TASK),
			mergeMap((data: fromTasksActions.UpdateTask) => {
				this.dataService.updateAndSave(data.payload);
				return of(
					new fromTasksAction.UpdateTasksSuccess({
						id: data.payload.id,
						changes: {...data.payload},
					}),
				);
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
