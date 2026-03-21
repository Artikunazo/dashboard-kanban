import {Component, inject, input, output, effect} from '@angular/core';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {BoardFacade} from './facades/board.facade';
import {Task} from './models/board.models';
import {TaskModal} from './components/task-modal/task-modal';
import {ColumnComponent} from './components/column/column';
import {BoardHeaderComponent} from './components/board-header/board-header';
import {InputValidationService} from '../../core/services/input-validation.service';

@Component({
	selector: 'app-board',
	standalone: true,
	imports: [DragDropModule, TaskModal, ColumnComponent, BoardHeaderComponent],
	templateUrl: './board.html',
})
export class BoardComponent {
	facade = inject(BoardFacade);

	boardId = input.required<string>();
	boardChanged = output<string>();

	// State Signals exposed to template
	isLoading = this.facade.isLoading;
	columns = this.facade.columns;
	tasksByColumn = this.facade.tasksByColumn;
	readonly isModalOpen = () => this.facade.isModalOpen();
	readonly modalMode = this.facade.modalMode;
	readonly selectedTask = () => this.facade.selectedTask();
	readonly activeColumnId = () => this.facade.activeColumnId();
	readonly teamMembers = () => this.facade.teamMembers();
	isTaskSubmitting = this.facade.isTaskSubmitting;
	isTaskDeleting = this.facade.isTaskDeleting;
	boardTitle = this.facade.boardTitle;
	isEditingTitle = this.facade.isEditingTitle;
	userBoards = this.facade.userBoards;
	rateLimitError = this.facade.rateLimitError;
	dismissRateLimitError = () => this.facade.dismissRateLimitError();

	constructor() {
		effect(
			() => {
				const currentBoardId = this.boardId();
				if (currentBoardId) {
					console.log(
						`El ID del tablero cambió a: ${currentBoardId}. Recargando datos...`,
					);
					this.facade.loadBoardData(currentBoardId);
				}
			},
			{allowSignalWrites: true},
		);
	}

	drop(event: CdkDragDrop<Task[]>, targetColumnId: string) {
		this.facade.handleTaskDrop(event, targetColumnId);
	}

	openCreateModal(columnId: string) {
		this.facade.openCreateModal(columnId);
	}

	openViewModal(task: Task) {
		this.facade.openViewModal(task);
	}

	closeModal() {
		this.facade.closeModal();
	}

	async onSaveTask(taskData: Partial<Task>) {
		await this.facade.saveTask(taskData);
	}

	enableTitleEdit() {
		this.facade.enableTitleEdit();
	}

	async saveBoardTitle(newTitle: string) {
		await this.facade.saveBoardTitle(newTitle);
	}

	async onDeleteBoard() {
		const confirmed = window.confirm(
			'Are you sure you want to delete this board? This action cannot be undone.',
		);

		if (confirmed) {
			const success = await this.facade.deleteBoard();
			if (success) {
				window.location.reload();
			}
		}
	}

	async onCreateNewBoard() {
		const rawTitle = prompt('Nombre del nuevo tablero:', 'New Project');
		if (!rawTitle) return;

		// Sanitize and validate before sending to facade
		const newTitle = InputValidationService.sanitize(rawTitle, 100);
		if (!newTitle) {
			alert('El nombre del tablero no puede estar vacío.');
			return;
		}

		const newBoardId = await this.facade.createBoardWithDefaults(newTitle);
		if (newBoardId) {
			this.boardChanged.emit(newBoardId);
		} else if (!this.facade.rateLimitError()) {
			// Only show generic error if not already showing a rate-limit message
			alert('No se pudo crear el tablero. Por favor inténtalo de nuevo.');
		}
	}

	onBoardSelected(boardId: string) {
		if (boardId && boardId !== this.boardId()) {
			this.boardChanged.emit(boardId);
		}
	}

	onTitleEditCancelled() {
		this.facade.isEditingTitle.set(false);
	}

	async onDeleteTask() {
		await this.facade.deleteTask();
	}
}
