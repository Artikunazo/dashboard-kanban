import {Component, OnInit, inject} from '@angular/core';
import {KanbanColumnComponent} from '../common/kanban-column/kanban-column.component';

import {Store} from '@ngrx/store';
import * as fromStore from '../store';
import {ITask} from '../models/tasks_models';
import {DragDropModule, CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
	selector: 'kanban-board',
	standalone: true,
	imports: [KanbanColumnComponent, DragDropModule],
	templateUrl: './kanban-board.component.html',
	styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent implements OnInit {
	public tasksList: ITask[] = [];
	public taskListIndexed!: {[key: string]: ITask[]};

	constructor(private readonly store: Store) {}

	ngOnInit(): void {
		this.store.dispatch(new fromStore.LoadTasks());
		this.store.select(fromStore.getTasks).subscribe({
			next: (response) => {
				this.tasksList = response;
				this.indexTasks();
			},
		});
	}

	indexTasks() {
		this.taskListIndexed = this.tasksList.reduce(
			(previous: any, current: any) => ({
				...previous,
				[current['status']]: [...(previous[current['status']] || []), current],
			}),
			{},
		);
	}

	drop(event: CdkDragDrop<ITask[]>) {
		const newStatus = event.container.element.nativeElement.id;
		const task = event.item.dropContainer.data;
		this.store.dispatch(
			new fromStore.UpdateTask({...task[0], status: newStatus}),
		);
	}
}
