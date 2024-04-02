import {Injectable, inject} from '@angular/core';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of, switchMap, map, catchError} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TasksEffects {
	constructor(private actions$: Actions) {}
}
