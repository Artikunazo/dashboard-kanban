import {Component, inject, output} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {FieldsetModule} from 'primeng/fieldset';
import {InputTextModule} from 'primeng/inputtext';

@Component({
	selector: 'subtask-form',
	standalone: true,
	imports: [ReactiveFormsModule, FieldsetModule, InputTextModule],
	templateUrl: './subtask-form.component.html',
	styleUrl: './subtask-form.component.scss',
})
export class SubtaskFormComponent {
	private readonly formBuilder = inject(FormBuilder);

	public subtaskSaved = output<string>();
	public subtaskForm!: FormGroup;

	constructor() {
		this.subtaskForm = this.formBuilder.group({
			title: this.formBuilder.control('', [Validators.required]),
		});
	}

	addSubtask(event: KeyboardEvent) {
		if (this.subtaskForm.invalid) return;

		if (event.code === 'Enter') {
			const subtaskFormValue = this.subtaskForm.getRawValue();

			const titleTrimmed = subtaskFormValue.title.trim();
			if(!titleTrimmed) return;

			return this.subtaskSaved.emit(titleTrimmed);
		}
	}
}
