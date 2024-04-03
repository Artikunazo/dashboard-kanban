import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, Validators, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';

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
	protected formBuilder = inject(FormBuilder);

	public taskForm = this.formBuilder.group({
		title: this.formBuilder.control('', [Validators.required]),
		description: this.formBuilder.control('', [Validators.required]),
		subtasks: this.formBuilder.control([], [Validators.required]),
		status: this.formBuilder.control('', [Validators.required]),
	});
	public statusOptions = ['ToDo', 'Doing', 'Done'];

	createTask() {}
}
