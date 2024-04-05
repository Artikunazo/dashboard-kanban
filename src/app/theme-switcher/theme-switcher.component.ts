import {Component, OnInit, inject, output} from '@angular/core';
import {CustomIconDirective} from '../common/custom-icon.directive';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
	selector: 'theme-switcher',
	standalone: true,
	imports: [
		CustomIconDirective,
		ReactiveFormsModule,
		MatIconModule,
		MatSlideToggleModule,
	],
	templateUrl: './theme-switcher.component.html',
	styleUrl: './theme-switcher.component.scss',
})
export class ThemeSwitcherComponent implements OnInit {
	public switcherToggled = output();

	themeToggled = new FormControl(false);

	constructor(private readonly store: Store) {
		this.themeToggled.valueChanges.subscribe((checked) => {
			const darkThemeName = 'dark-theme';
			const body = document.querySelector('body');
			// Enable light theme
			if (!checked) {
				body?.classList.remove(darkThemeName);
				this.store.dispatch(new fromStore.SaveTheme('ligth'));
			} else {
				body?.classList.add(darkThemeName);
				this.store.dispatch(new fromStore.SaveTheme('dark'));
			}
		});
	}

	ngOnInit(): void {
		this.store.dispatch(new fromStore.LoadTheme());
		this.store.select(fromStore.getTheme).subscribe({
			next: (ThemeState) => {
				this.themeToggled.setValue(ThemeState === 'dark');
			},
		});
	}
}
