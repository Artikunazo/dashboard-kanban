import {Component, effect, inject, input, output, signal} from '@angular/core';
import {
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {Task, TeamMember} from '../../models/board.models';
import {InputValidationService} from '../../../../core/services/input-validation.service';
import {IconClose} from '../../../../shared/components/icons/icon-close';
import {IconTrash} from '../../../../shared/components/icons/icon-trash';
import {IconEdit} from '../../../../shared/components/icons/icon-edit';
import {AssigneePickerComponent} from '../../../../shared/components/assignee-picker/assignee-picker';

export type ModalMode = 'create' | 'view' | 'edit';

@Component({
	selector: 'app-task-modal',
	standalone: true,
	imports: [ReactiveFormsModule, IconClose, IconTrash, IconEdit, AssigneePickerComponent],
	templateUrl: './task-modal.html',
})
export class TaskModal {
	isOpen = input.required<boolean>();
	mode = input.required<ModalMode>();
	task = input<Task | null>(null);
	columnId = input<string | null>(null);
	teamMembers = input<TeamMember[]>([]);

	selectedAssigneeId = signal<string | null>(null);

	closeModal = output<void>();
	saveTask = output<Partial<Task>>();
	requestEdit = output<void>();
	deleteTaskRequested = output<void>();

	// Formulario Reactivo con validadores de seguridad
	private fb = inject(NonNullableFormBuilder);
	taskForm = this.fb.group({
		title: [
			'',
			[
				Validators.required,
				Validators.minLength(2),
				InputValidationService.maxLengthTrimmed(100),
				InputValidationService.noHtmlValidator,
			],
		],
		description: [
			'',
			[
				InputValidationService.maxLengthTrimmed(1000),
				InputValidationService.noHtmlValidator,
			],
		],
	});

	constructor() {
		effect(() => {
			if (!this.isOpen()) {
				this.taskForm.reset();
				this.selectedAssigneeId.set(null);
			} else if (
				(this.mode() === 'view' || this.mode() === 'edit') &&
				this.task()
			) {
				this.taskForm.patchValue({
					title: this.task()!.title,
					description: this.task()!.description || '',
				});
				this.selectedAssigneeId.set(this.task()!.assignee_id ?? null);
			}
		});
	}

	onClose() {
		this.closeModal.emit();
	}

	onSubmit() {
		if (this.taskForm.invalid) {
			this.taskForm.markAllAsTouched();
			return;
		}

		const raw = this.taskForm.getRawValue();

		this.saveTask.emit({
			title: InputValidationService.sanitize(raw.title, 100),
			description: InputValidationService.sanitize(raw.description, 1000),
			column_id: this.columnId()!,
			assignee_id: this.selectedAssigneeId(),
		});

		this.onClose();
	}

	onDelete() {
		if (window.confirm('Are you sure you want to delete this task?')) {
			this.deleteTaskRequested.emit();
			this.onClose();
		}
	}

	get titleErrors() {
		return this.taskForm.controls.title;
	}
	get descriptionErrors() {
		return this.taskForm.controls.description;
	}
}
