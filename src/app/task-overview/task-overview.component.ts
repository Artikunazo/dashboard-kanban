import {Component, OnInit, inject, input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubtasksOverviewComponent} from '../common/subtasks-overview/subtasks-overview.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
	selector: 'task-overview',
	standalone: true,
	imports: [SubtasksOverviewComponent, MatSelectModule, MatFormFieldModule],
	templateUrl: './task-overview.component.html',
	styleUrl: './task-overview.component.scss',
})
export class TaskOverviewComponent {
	protected readonly matDialogData = inject(MAT_DIALOG_DATA);
	protected readonly dialogRef = inject(
		MatDialogRef,
	) as MatDialogRef<TaskOverviewComponent>;

	public task = this.matDialogData;
	public statusSelected = this.task.status;
	public statusOptions = ['ToDo', 'Doing', 'Done'];
}
