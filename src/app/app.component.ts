import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {KanbanBoardComponent} from './kanban-board/kanban-board.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		ToolbarComponent,
		MatListModule,
		MatSidenavModule,
		MatIconModule,
		MatSlideToggleModule,
		KanbanBoardComponent,
		ReactiveFormsModule,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'dashboard-kanban';

	themeToggled = new FormControl(false);

	constructor() {
		this.themeToggled.valueChanges.subscribe((checked) => {
			// Enable light theme
			if (!checked) {
				const body = document.querySelector('body');
				body?.classList.remove('dark-theme');
			}

			if (checked) {
				const body = document.querySelector('body');
				body?.classList.add('dark-theme');
			}
		});
	}
}
