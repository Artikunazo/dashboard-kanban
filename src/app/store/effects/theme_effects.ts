import {Injectable, inject} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of, map, catchError, mergeMap} from 'rxjs';
import {DataService} from '../../api/data.service';
import * as fromThemeActions from '../actions/theme_actions';

@Injectable({
	providedIn: 'root',
})
export class ThemeEffects {
	constructor(
		private actions$: Actions,
		private readonly dataService: DataService,
	) {}

	protected readonly themeActionsTypes = fromThemeActions.ThemeActionTypes;

	loadTheme$: Observable<Action> = createEffect(() => {
		return this.actions$.pipe(
			ofType(this.themeActionsTypes.LOAD_THEME),
			mergeMap(() =>
				this.dataService.getTheme().pipe(
					map((response: string | null) => {
						return new fromThemeActions.LoadThemeSuccess(response ?? 'ligth');
					}),
					catchError((error: any) => {
						return of(new fromThemeActions.LoadThemeFail(error));
					}),
				),
			),
		);
	});

	saveTheme$: Observable<Action> = createEffect(() => {
		return this.actions$.pipe(
			ofType(this.themeActionsTypes.SAVE_THEME),
			mergeMap((data: fromThemeActions.SaveThemeSuccess) => {
				this.dataService.saveTheme(data.payload);
				return of(new fromThemeActions.SaveThemeSuccess(data.payload));
			}),
		);
	});
}
