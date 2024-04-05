import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {KanbanBoardComponent} from './kanban-board/kanban-board.component';
import {ThemeSwitcherComponent} from './theme-switcher/theme-switcher.component';
import {Store} from '@ngrx/store';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		ToolbarComponent,
		MatListModule,
		MatSidenavModule,
		MatSlideToggleModule,
		KanbanBoardComponent,
		ThemeSwitcherComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'dashboard-kanban';

	constructor(protected readonly store: Store) {}
}
