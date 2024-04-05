import * as fromThemeActions from '../actions/theme_actions';

export interface ThemeState {
	theme: string;
	error: string;
}

export const initialState: ThemeState = {
	theme: '',
	error: '',
};

export function reducer(
	state = initialState,
	action: fromThemeActions.themeActions,
): ThemeState {
	const themeActionTypes = fromThemeActions.ThemeActionTypes;

	switch (action.type) {
		case themeActionTypes.LOAD_THEME_SUCCESS: {
			return {...state, theme: action.payload};
		}

		case themeActionTypes.LOAD_THEME_FAIL: {
			return {...state, error: action.payload};
		}

		case themeActionTypes.SAVE_THEME_SUCCESS: {
			return {...state, theme: action.payload};
		}

		case themeActionTypes.SAVE_THEME_FAIL: {
			return {...state, error: action.payload};
		}

		default: {
			return state;
		}
	}
}

export const getTheme = (state: ThemeState) => state.theme;
export const getThemeError = (state: ThemeState) => state.error;
