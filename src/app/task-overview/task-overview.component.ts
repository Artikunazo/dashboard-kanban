import {Component, Inject, OnInit, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubtasksOverviewComponent} from '../common/subtasks-overview/subtasks-overview.component';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';
import {ITask} from '../models/tasks_models';

@Component({
	selector: 'task-overview',
	standalone: true,
	imports: [
		SubtasksOverviewComponent,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
	],
	templateUrl: './task-overview.component.html',
	styleUrl: './task-overview.component.scss',
})
export class TaskOverviewComponent implements OnInit {
	public task!: ITask;
	public statusSelected = new FormControl();
	public statusOptions = ['ToDo', 'Doing', 'Done'];

	constructor(
		@Inject(MAT_DIALOG_DATA)
		private readonly matDialogData: ITask,
		private readonly store: Store,
	) {
		this.task = this.matDialogData;
		this.statusSelected.setValue(this.task.status);
	}

	ngOnInit(): void {
		this.statusSelected.valueChanges.subscribe({
			next: (newValue) => {
				this.store.dispatch(
					new fromStore.UpdateTask({
						...this.task,
						status: newValue ?? 'ToDo',
					}),
				);
			},
		});
	}

	subtaskUpdated(event: any) {
		console.log(this.task);
		// const {title, status, index} = event;
		// const newSubtasks = [...this.task.subtasks];
		// newSubtasks[index] = {title, status};
		// this.task = {...this.task, subtasks: newSubtasks};
		// console.log('after', this.task());
		// this.store.dispatch(new fromStore.UpdateTask(this.task()));
		// const {title, status, index} = event;
		// this.matDialogData.subTasks[index] = {...title, ...status};
		// const newSubtask = {
		// 	...this.task.subtasks[index],
		// 	...{status: status},
		// };
		// this.task.subtasks[index] = [...newSubtask.title, ...newSubtask.status];
		// console.log(this.task);
		// this.task.subtasks[index] = {
		// 	...title,
		// 	...status,
		// };
		// this.task.subtasks[event.index] = {...event};
		// this.task.subtasks[event.index] = {
		// 	...this.task.subtasks[event.index],
		// 	status: event.checked,
		// };
		// console.log('task after', this.task);
		// this.store.dispatch(
		//   new fromStore.UpdateTask({...this.task}),
		// );
	}
}
