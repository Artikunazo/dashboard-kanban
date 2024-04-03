import {Component, input} from '@angular/core';
import {KanbanCardComponent} from '../kanban-card/kanban-card.component';
import {StatusCircleComponent} from '../status-circle/status-circle.component';
import {ITask} from 'src/app/models/tasks_models';

@Component({
	selector: 'kanban-column',
	standalone: true,
	imports: [KanbanCardComponent, StatusCircleComponent],
	templateUrl: './kanban-column.component.html',
	styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
	public columnType = input<string>();
	public tasks = input<ITask[]>();
}
