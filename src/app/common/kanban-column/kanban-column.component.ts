import {Component, input} from '@angular/core';

@Component({
	selector: 'kanban-column',
	standalone: true,
	imports: [],
	templateUrl: './kanban-column.component.html',
	styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
	public columnType = input();
	public tasks = input();
}
