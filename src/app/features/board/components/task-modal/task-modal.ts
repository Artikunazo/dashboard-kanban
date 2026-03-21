import {Component, effect, inject, input, output, signal, computed} from '@angular/core';
import {
	NonNullableFormBuilder,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {Column, Task, TeamMember} from '../../models/board.models';
import {InputValidationService} from '../../../../core/services/input-validation.service';
import {IconClose} from '../../../../shared/components/icons/icon-close';
import {IconTrash} from '../../../../shared/components/icons/icon-trash';
import {IconSpinner} from '../../../../shared/components/icons/icon-spinner';
import {IconDots} from '../../../../shared/components/icons/icon-dots';
import {AssigneePickerComponent} from '../../../../shared/components/assignee-picker/assignee-picker';

export type ModalMode = 'create' | 'view';

@Component({
	selector: 'app-task-modal',
	standalone: true,
	imports: [ReactiveFormsModule, IconClose, IconTrash, IconSpinner, IconDots, AssigneePickerComponent],
	templateUrl: './task-modal.html',
})
export class TaskModal {
	isOpen = input.required<boolean>();
	mode = input.required<ModalMode>();
	task = input<Task | null>(null);
	columnId = input<string | null>(null);
	teamMembers = input<TeamMember[]>([]);
	columns = input<Column[]>([]);
	isSubmitting = input<boolean>(false);
	isDeleting = input<boolean>(false);

	selectedAssigneeId = signal<string | null>(null);
	isMenuOpen = signal<boolean>(false);
	
	isEditingTitle = signal<boolean>(false);
	isEditingDescription = signal<boolean>(false);

	columnTitle = computed(() => {
		const colId = this.task()?.column_id || this.columnId();
		if (!colId) return 'Unknown';
		const col = this.columns().find(c => c.id === colId);
		return col ? col.title : colId;
	});

	closeModal = output<void>();
	saveTask = output<Partial<Task>>();
	deleteTaskRequested = output<void>();
	patchTask = output<{taskId: string, columnId: string, updates: Partial<Task>}>();

	titleErrors = {invalid: false, touched: false, errors: null as null | any};
	descriptionErrors = {invalid: false, touched: false, errors: null as null | any};
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
				this.mode() === 'view' &&
				this.task()
			) {
				this.taskForm.patchValue({
					title: this.task()!.title,
					description: this.task()!.description || '',
				});
				this.selectedAssigneeId.set(this.task()!.assignee_id ?? null);
			}
			
			// Reset inline edit states when modal opens/changes
			this.isEditingTitle.set(false);
			this.isEditingDescription.set(false);
			// Close menu when modal state changes
			this.isMenuOpen.set(false);
		});
	}

	onClose() {
		this.isMenuOpen.set(false);
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
		this.isMenuOpen.set(false);
		if (window.confirm('Are you sure you want to delete this task?')) {
			this.deleteTaskRequested.emit();
			this.onClose();
		}
	}

	updateAssignee(assigneeId: string | null) {
		this.selectedAssigneeId.set(assigneeId);
		if (this.mode() === 'view' && this.task()) {
			this.patchTask.emit({
				taskId: this.task()!.id,
				columnId: this.task()!.column_id,
				updates: { assignee_id: assigneeId }
			});
		}
	}

	enableTitleEdit() {
		this.isEditingDescription.set(false);
		this.isEditingTitle.set(true);
	}

	enableDescriptionEdit() {
		this.isEditingTitle.set(false);
		this.isEditingDescription.set(true);
	}

	cancelTitleEdit() {
		this.isEditingTitle.set(false);
	}

	cancelDescriptionEdit() {
		this.isEditingDescription.set(false);
	}

	saveInlineTitle(newTitle: string) {
		const title = newTitle.trim();
		this.isEditingTitle.set(false);
		if (!this.task() || !title || title === this.task()!.title) return;
		
		this.patchTask.emit({
			taskId: this.task()!.id,
			columnId: this.task()!.column_id,
			updates: { title }
		});
	}

	saveInlineDescription(newDesc: string) {
		const description = newDesc.trim();
		this.isEditingDescription.set(false);
		if (!this.task() || description === (this.task()!.description || '')) return;
		
		this.patchTask.emit({
			taskId: this.task()!.id,
			columnId: this.task()!.column_id,
			updates: { description }
		});
	}
}
