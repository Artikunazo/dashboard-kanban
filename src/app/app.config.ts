import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideEffects} from '@ngrx/effects';
import {provideState, provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';

import * as fromTasksReducer from './store/reducers/tasks_reducer';
import {routes} from './app.routes';
import {effects} from './store';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideAnimationsAsync(),
		provideEffects(effects),
		provideStore(),
		provideState({name: 'tasks', reducer: fromTasksReducer.reducer}),
		provideStoreDevtools(),
	],
};
