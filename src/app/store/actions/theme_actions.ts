import {Action} from '@ngrx/store';

export enum ThemeActionTypes {
	LOAD_THEME = '[Theme] Load Theme',
	LOAD_THEME_SUCCESS = '[Theme] Load Theme Success',
	LOAD_THEME_FAIL = '[Theme] Load theme Fail',

	SAVE_THEME = '[Theme] Save Theme',
	SAVE_THEME_SUCCESS = '[Theme] Save Theme Success',
	SAVE_THEME_FAIL = '[Theme] Save theme Fail',
}

// LOAD
export class LoadTheme implements Action {
	readonly type = ThemeActionTypes.LOAD_THEME;
}

export class LoadThemeSuccess implements Action {
	readonly type = ThemeActionTypes.LOAD_THEME_SUCCESS;

	constructor(public payload: string) {}
}

export class LoadThemeFail implements Action {
	readonly type = ThemeActionTypes.LOAD_THEME_FAIL;

	constructor(public payload: string) {}
}

// SAVE
export class SaveTheme implements Action {
	readonly type = ThemeActionTypes.SAVE_THEME;

	constructor(public payload: string) {}
}

export class SaveThemeSuccess implements Action {
	readonly type = ThemeActionTypes.SAVE_THEME_SUCCESS;

	constructor(public payload: string) {}
}

export class SaveThemeFail implements Action {
	readonly type = ThemeActionTypes.SAVE_THEME_FAIL;

	constructor(public payload: string) {}
}

export type themeActions =
	| LoadTheme
	| LoadThemeSuccess
	| LoadThemeFail
	| SaveTheme
	| SaveThemeSuccess
	| SaveThemeFail;
