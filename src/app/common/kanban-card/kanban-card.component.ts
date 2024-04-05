import {Component, inject, input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ITask} from '../../models/tasks_models';
import {MatDialog} from '@angular/material/dialog';
import {TaskOverviewComponent} from '../../../app/task-overview/task-overview.component';
import {Store} from '@ngrx/store';
import * as fromStore from '../../../app/store';

@Component({
	selector: 'kanban-card',
	standalone: true,
	imports: [MatCardModule],
	templateUrl: './kanban-card.component.html',
	styleUrl: './kanban-card.component.scss',
})
export class KanbanCardComponent {
	constructor(
		private readonly matDialog: MatDialog,
		private readonly store: Store,
	) {}

	public task = input<ITask>();

	openTaskOverviewModal(taskData: ITask | undefined) {
		if (!taskData) return;

		const dialogRef = this.matDialog.open(TaskOverviewComponent, {
			width: '65%',
			height: 'fit-content',
			maxHeight: '90vh',
			data: {...taskData},
		});

		dialogRef.afterClosed().subscribe(() => {
			this.store.dispatch(new fromStore.LoadTasks());
		});
	}
}
