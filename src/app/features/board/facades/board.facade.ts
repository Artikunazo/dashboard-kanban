import {Injectable, inject, signal} from '@angular/core';
import {BoardRepository} from '../domain/repositories/board.repository';
import {TaskRepository} from '../domain/repositories/task.repository';
import {TeamMemberRepository} from '../domain/repositories/team-member.repository';
import {SupabaseTeamMemberRepository} from '../infrastructure/repositories/supabase-team-member.repository';
import {Column, Task, TeamMember} from '../models/board.models';
import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import {ModalMode} from '../components/task-modal/task-modal';
import {LexoRank} from '@dalet-oss/lexorank';
import {RateLimiterService} from '../../../core/services/rate-limiter.service';
import {InputValidationService} from '../../../core/services/input-validation.service';
import {ToastService} from '../../../core/services/toast.service';
import {AnalyticsService} from '../../../core/services/analytics.service';

/**
 * Application-layer facade that owns all board state as Angular signals.
 * Components read signals and call methods here — never repositories directly.
 */
@Injectable({
	providedIn: 'root',
})
export class BoardFacade {
	private boardRepo = inject(BoardRepository);
	private taskRepo = inject(TaskRepository);
	private teamMemberRepo = inject(SupabaseTeamMemberRepository);
	private rateLimiter = inject(RateLimiterService);
	private toastService = inject(ToastService);
	private analytics = inject(AnalyticsService);

	// State Signals
	isLoading = signal<boolean>(true);
	columns = signal<Column[]>([]);
	tasksByColumn = signal<Record<string, Task[]>>({});

	isModalOpen = signal<boolean>(false);
	modalMode = signal<ModalMode>('create');
	selectedTask = signal<Task | null>(null);
	activeColumnId = signal<string | null>(null);

	isTaskSubmitting = signal<boolean>(false);
	isTaskDeleting = signal<boolean>(false);

	boardTitle = signal<string>('Cargando tablero...');
	isEditingTitle = signal<boolean>(false);
	userBoards = signal<{id: string; title: string}[]>([]);
	teamMembers = signal<TeamMember[]>([]);

	/** Non-null when an action has been rate-limited; shown as banner in the template. */
	rateLimitError = signal<string | null>(null);

	// Current Board ID tracking
	private currentBoardId: string | null = null;

	async loadBoardData(boardId: string) {
		this.currentBoardId = boardId;
		this.isLoading.set(true);

		const [boardsList, boardDetails, data, members] = await Promise.all([
			this.boardRepo.getAllUserBoards(),
			this.boardRepo.getBoardDetails(boardId),
			this.boardRepo.getFullBoard(boardId),
			this.teamMemberRepo.getAll(),
		]);

		this.userBoards.set(boardsList);
		this.teamMembers.set(members);

		if (boardDetails) {
			this.boardTitle.set(boardDetails.title);
		}

		if (data) {
			this.columns.set(data.columns);

			const grouped: Record<string, Task[]> = {};
			data.columns.forEach((col) => (grouped[col.id] = []));
			data.tasks.forEach((task) => {
				if (grouped[task.column_id]) {
					grouped[task.column_id].push(task);
				}
			});
			this.tasksByColumn.set(grouped);
		}
		this.isLoading.set(false);
	}

	handleTaskDrop(event: CdkDragDrop<Task[]>, targetColumnId: string) {
		const sourceColumnId = event.previousContainer.id;

		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
		}

		// Refresh signal to notify Angular of the changed array contents
		this.tasksByColumn.set({...this.tasksByColumn()});

		const data = event.container.data;
		const currentIndex = event.currentIndex;
		const draggedTask = data[currentIndex];

		const getRank = (idx: number) => {
			try {
				return LexoRank.parse(data[idx].position);
			} catch (e) {
				return LexoRank.middle();
			}
		};

		let newRank: LexoRank;

		if (data.length === 1) {
			newRank = LexoRank.middle();
		} else if (currentIndex === 0) {
			newRank = getRank(1).genPrev();
		} else if (currentIndex === data.length - 1) {
			newRank = getRank(currentIndex - 1).genNext();
		} else {
			newRank = getRank(currentIndex - 1).between(getRank(currentIndex + 1));
		}

		const newPositionStr = newRank.toString();

		if (
			draggedTask.position !== newPositionStr ||
			draggedTask.column_id !== targetColumnId
		) {
			draggedTask.position = newPositionStr;
			draggedTask.column_id = targetColumnId;
			console.log(`Moviendo tarea a LexoRank: ${newPositionStr}`);
			this.taskRepo.updateTasksBulk([draggedTask]);
			this.analytics.taskDropped(draggedTask.id, sourceColumnId, targetColumnId);
		}
	}

	openCreateModal(columnId: string) {
		this.activeColumnId.set(columnId);
		this.modalMode.set('create');
		this.selectedTask.set(null);
		this.isModalOpen.set(true);
		this.analytics.taskCreateOpened(columnId);
	}

	openViewModal(task: Task) {
		this.selectedTask.set(task);
		this.modalMode.set('view');
		this.isModalOpen.set(true);
		this.analytics.taskViewed(task.id, task.title);
	}

	closeModal() {
		const mode = this.modalMode();
		this.isModalOpen.set(false);
		this.activeColumnId.set(null);
		this.selectedTask.set(null);
		this.analytics.taskModalClosed(mode);
	}

	dismissRateLimitError() {
		this.rateLimitError.set(null);
	}

	async patchTask(taskId: string, columnId: string, updates: Partial<Task>) {
		this.isTaskSubmitting.set(true);
		try {
			const sanitizedUpdates = {...updates};
			if (typeof sanitizedUpdates.title === 'string') {
				sanitizedUpdates.title = InputValidationService.sanitize(
					sanitizedUpdates.title,
					100,
				);
			}
			if (typeof sanitizedUpdates.description === 'string') {
				sanitizedUpdates.description = InputValidationService.sanitize(
					sanitizedUpdates.description,
					1000,
				);
			}

			const success = await this.taskRepo.updateTask(taskId, sanitizedUpdates);

			if (success) {
				this.tasksByColumn.update((prev) => {
					const updated = {...prev};
					if (!updated[columnId]) return updated;

					const taskIndex = updated[columnId].findIndex((t) => t.id === taskId);
					if (taskIndex > -1) {
						const currentTask = updated[columnId][taskIndex];
						const member =
							updates.assignee_id !== undefined
								? (this.teamMembers().find(
										(m) => m.id === updates.assignee_id,
									) ?? undefined)
								: currentTask.assignee;

						updated[columnId][taskIndex] = {
							...currentTask,
							...sanitizedUpdates,
							assignee: member,
						};

						// Optimistically update the selected task if it's the one we're viewing
						if (this.selectedTask()?.id === taskId) {
							this.selectedTask.set(updated[columnId][taskIndex]);
						}
					}
					return updated;
				});
				this.toastService.showSuccess('Task updated successfully');
				// Track specific field updates
				if ('title' in updates) this.analytics.taskTitleEdited(taskId);
				if ('description' in updates) this.analytics.taskDescriptionEdited(taskId);
				if ('assignee_id' in updates) this.analytics.taskAssigneeChanged(taskId, updates.assignee_id ?? null);
			}
		} finally {
			this.isTaskSubmitting.set(false);
		}
	}

	async saveTask(taskData: Partial<Task>) {
		this.isTaskSubmitting.set(true);
		try {
			// --- Rate limit check ---
			if (!this.rateLimiter.canPerform('create-task')) {
				this.rateLimitError.set(
					this.rateLimiter.getErrorMessage('create-task'),
				);
				return;
			}

			const columnId = taskData.column_id!;
			const currentTasks = this.tasksByColumn()[columnId] || [];

			if (currentTasks.length === 0) {
				taskData.position = LexoRank.middle().toString();
			} else {
				try {
					const lastTask = currentTasks[currentTasks.length - 1];
					taskData.position = LexoRank.parse(lastTask.position)
						.genNext()
						.toString();
				} catch (e) {
					taskData.position = LexoRank.middle().toString();
				}
			}

			const newTask = await this.taskRepo.createTask(taskData);

			if (newTask) {
				this.tasksByColumn.update((prev) => {
					const updated = {...prev};
					updated[columnId] = [...(updated[columnId] || []), newTask];
					return updated;
				});
				this.toastService.showSuccess('New task created');
				this.analytics.taskCreated(newTask.id, columnId);
			}
		} finally {
			this.isTaskSubmitting.set(false);
		}
	}

	async deleteTask() {
		if (!this.selectedTask()) return;

		this.isTaskDeleting.set(true);
		try {
			const taskId = this.selectedTask()!.id;
			const columnId = this.selectedTask()!.column_id;

			const success = await this.taskRepo.deleteTask(taskId);

			if (success) {
				this.tasksByColumn.update((prev) => {
					const updated = {...prev};
					updated[columnId] = updated[columnId].filter((t) => t.id !== taskId);
					return updated;
				});
				this.analytics.taskDeleted(taskId);
				this.toastService.showSuccess('Task deleted permanently');
				console.log('Task deleted successfully');
				this.closeModal();
			}
		} finally {
			this.isTaskDeleting.set(false);
		}
	}

	enableTitleEdit() {
		this.isEditingTitle.set(true);
		this.analytics.boardTitleEditStarted();
	}

	async saveBoardTitle(newTitle: string) {
		const sanitized = InputValidationService.sanitize(newTitle, 100);

		if (!this.currentBoardId || !sanitized || sanitized === this.boardTitle()) {
			this.isEditingTitle.set(false);
			return;
		}

		const success = await this.boardRepo.updateBoardTitle(
			this.currentBoardId,
			sanitized,
		);

		if (success) {
			this.boardTitle.set(sanitized);
			const updatedBoards = await this.boardRepo.getAllUserBoards();
			this.userBoards.set(updatedBoards);
			this.toastService.showSuccess('Board title updated');
			this.analytics.boardTitleSaved(sanitized);
		}
		this.isEditingTitle.set(false);
	}

	async deleteBoard(): Promise<boolean> {
		if (!this.currentBoardId) return false;
		const boardId = this.currentBoardId;
		const success = await this.boardRepo.deleteBoard(boardId);
		if (success) this.analytics.boardDeleted(boardId);
		return success;
	}

	async createBoardWithDefaults(title: string): Promise<string | null> {
		// --- Rate limit check ---
		if (!this.rateLimiter.canPerform('create-board')) {
			this.rateLimitError.set(this.rateLimiter.getErrorMessage('create-board'));
			return null;
		}

		const sanitizedTitle =
			InputValidationService.sanitize(title, 100) || 'New Project';

		this.isLoading.set(true);
		const newBoardId =
			await this.boardRepo.createBoardWithDefaults(sanitizedTitle);
		if (!newBoardId) {
			this.isLoading.set(false);
		} else {
			this.toastService.showSuccess('New board created');
			this.analytics.boardCreated(newBoardId, sanitizedTitle);
		}
		return newBoardId;
	}
}
