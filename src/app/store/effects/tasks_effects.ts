import {Injectable, inject} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of, switchMap, map, catchError, mergeMap} from 'rxjs';
import {DataService} from 'src/app/api/data.service';
import * as fromTasksAction from '../actions/tasks_actions';

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
						return new fromTasksAction.LoadTasksSuccess(
							JSON.parse(response || {}),
						);
					}),
					catchError((error: any) =>
						of(new fromTasksAction.LoadTasksFail(error)),
					),
				),
			),
		);
	});

	// saveTasks$: Observable<Action> = createEffect(() => {
	// 	return this.actions$.pipe(
	// 		ofType(this.tasksActionsTypes.LOAD_TASKS),
	// 		mergeMap(() =>
	// 			this.dataService.save().pipe(
	// 				map((response: any) => {
	// 					return new fromTasksAction.LoadTasksSuccess(JSON.parse(response));
	// 				}),
	// 				catchError((error: any) =>
	// 					of(new fromTasksAction.LoadTasksFail(error)),
	// 				),
	// 			),
	// 		),
	// 	);
	// });
}
