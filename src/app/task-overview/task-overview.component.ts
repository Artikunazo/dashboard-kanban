import {
	Component,
	OnChanges,
	OnInit,
	SimpleChanges,
	inject,
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubtasksOverviewComponent} from '../common/subtasks-overview/subtasks-overview.component';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';

@Component({
	selector: 'task-overview',
	standalone: true,
	imports: [
		SubtasksOverviewComponent,
		MatSelectModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
	],
	templateUrl: './task-overview.component.html',
	styleUrl: './task-overview.component.scss',
})
export class TaskOverviewComponent implements OnInit, OnChanges {
	protected readonly matDialogData = inject(MAT_DIALOG_DATA);
	protected readonly dialogRef = inject(
		MatDialogRef,
	) as MatDialogRef<TaskOverviewComponent>;
	protected readonly store = inject(Store);

	public task = this.matDialogData;
	public statusSelected = new FormControl(this.task.status);
	public statusOptions = ['ToDo', 'Doing', 'Done'];

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
	}

	ngOnInit(): void {
		this.statusSelected.valueChanges.subscribe({
			next: (newValue) => {
				this.store.dispatch(
					new fromStore.UpdateTask({...this.task, status: newValue}),
				);
			},
		});
	}

	subtaskUpdated(event: any) {
		const {title, status, index} = event;
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
