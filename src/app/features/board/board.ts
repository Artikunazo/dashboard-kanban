import {Component, inject, input, output, effect} from '@angular/core';
import {CdkDragDrop, DragDropModule} from '@angular/cdk/drag-drop';
import {BoardFacade} from './facades/board.facade';
import {Task} from './models/board.models';
import {TaskModal} from './components/task-modal/task-modal';

@Component({
	selector: 'app-board',
	standalone: true,
	imports: [DragDropModule, TaskModal],
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
	isModalOpen = this.facade.isModalOpen;
	modalMode = this.facade.modalMode;
	selectedTask = this.facade.selectedTask;
	activeColumnId = this.facade.activeColumnId;
	boardTitle = this.facade.boardTitle;
	isEditingTitle = this.facade.isEditingTitle;
	userBoards = this.facade.userBoards;

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
		const newTitle = prompt('Enter the name for the new board:', 'New Project');
		if (!newTitle) return;

		const newBoardId = await this.facade.createBoardWithDefaults(newTitle);
		if (newBoardId) {
			this.boardChanged.emit(newBoardId);
		} else {
			alert('Failed to create the board. Please try again.');
		}
	}

	onBoardSelected(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const selectedId = selectElement.value;

		if (selectedId && selectedId !== this.boardId()) {
			this.boardChanged.emit(selectedId);
		}
	}

	async onDeleteTask() {
		await this.facade.deleteTask();
	}
}
