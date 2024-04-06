import {Component, inject} from '@angular/core';
import {
	ReactiveFormsModule,
	Validators,
	FormBuilder,
	FormArray,
	FormGroup,
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';
import * as fromStore from '../store';
import {Store} from '@ngrx/store';
import * as uuid from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
	selector: 'task-form',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		CustomButtonComponent,
	],
	templateUrl: './task-form.component.html',
	styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
	private readonly formBuilder = inject(FormBuilder);
	private readonly store = inject(Store) as Store<fromStore.AppState>;
	private matDialogRef = inject(
		MatDialogRef,
	) as MatDialogRef<TaskFormComponent>;

	public taskForm!: FormGroup;

	public statusOptions = ['ToDo', 'Doing', 'Done'];

	constructor() {
		this.taskForm = this.formBuilder.group({
			title: this.formBuilder.control('', [Validators.required]),
			description: this.formBuilder.control('', [Validators.required]),
			subtasks: this.formBuilder.array([
				this.formBuilder.group({
					title: this.formBuilder.control('', [Validators.required]),
					status: this.formBuilder.control('ToDo'),
				}),
			]),
			status: this.formBuilder.control('', [Validators.required]),
		});
	}

	get subtasks() {
		return this.taskForm.get('subtasks') as FormArray;
	}

	closeDialog(): void {
		this.matDialogRef.close();
	}

	addSubtask() {
		return this.subtasks.push(
			this.formBuilder.group({
				title: this.formBuilder.control('', [Validators.required]),
				status: this.formBuilder.control('ToDo'),
			}),
		);
	}

	createTask() {
		if (this.taskForm.invalid) return;

		this.store.dispatch(
			new fromStore.AddTask({
				title: this.taskForm.value.title!,
				description: this.taskForm.value.description!,
				subtasks: <[]>this.taskForm.value.subtasks!,
				status: this.taskForm.value.status!,
				id: uuid.v4(),
			}),
		);

		this.closeDialog();
	}
}
