import {Component, input} from '@angular/core';

@Component({
	selector: 'dashboard-column',
	standalone: true,
	imports: [],
	templateUrl: './dashboard-column.component.html',
	styleUrl: './dashboard-column.component.scss',
})
export class DashboardColumnComponent {
	public columnType = input();
	public tasks = input();
}
