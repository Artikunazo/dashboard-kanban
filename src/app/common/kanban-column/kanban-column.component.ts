import {Component, input} from '@angular/core';
import {KanbanCardComponent} from '../kanban-card/kanban-card.component';
import {StatusCircleComponent} from '../status-circle/status-circle.component';
import {ITask} from '../../models/tasks_models';
import {CdkDrag, CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';
import {Store} from '@ngrx/store';

@Component({
	selector: 'kanban-column',
	standalone: true,
	imports: [
		KanbanCardComponent,
		StatusCircleComponent,
		CdkDrag,
		CdkDropList,
		DragDropModule,
	],
	templateUrl: './kanban-column.component.html',
	styleUrl: './kanban-column.component.scss',
})
export class KanbanColumnComponent {
	public columnType = input<string>('ToDo');
	public tasks = input<ITask[]>([]);

	constructor(protected readonly store: Store) {}
}
