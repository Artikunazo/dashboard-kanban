import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'dashboard-kanban';
}
