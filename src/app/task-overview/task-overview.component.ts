import {Component, OnInit, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SubtasksOverviewComponent} from '../common/subtasks-overview/subtasks-overview.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

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
export class TaskOverviewComponent implements OnInit {
	protected readonly matDialogData = inject(MAT_DIALOG_DATA);
	protected readonly dialogRef = inject(
		MatDialogRef,
	) as MatDialogRef<TaskOverviewComponent>;

	public task = this.matDialogData;
	public statusSelected = new FormControl(this.task.status);
	public statusOptions = ['ToDo', 'Doing', 'Done'];

	ngOnInit(): void {
		this.statusSelected.valueChanges.subscribe({
			next: (newValue) => {
				console.log(newValue);
			},
		});
	}
}
