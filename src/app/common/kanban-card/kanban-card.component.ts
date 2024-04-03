import {Component, inject, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ITask} from 'src/app/models/tasks_models';
import {MatDialog} from '@angular/material/dialog';
import {TaskOverviewComponent} from 'src/app/task-overview/task-overview.component';

@Component({
	selector: 'kanban-card',
	standalone: true,
	imports: [MatCardModule],
	templateUrl: './kanban-card.component.html',
	styleUrl: './kanban-card.component.scss',
})
export class KanbanCardComponent {
	protected readonly matDialog = inject(MatDialog);

	public task = input<ITask>();

	openTaskOverviewModal(taskData: ITask | undefined) {
		if (!taskData) return;

		this.matDialog.open(TaskOverviewComponent, {
			width: '65%',
			height: '90vh',
			data: {...taskData},
		});
	}
}
