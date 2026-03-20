import { Injectable, inject, signal } from '@angular/core';
import { BoardRepository } from '../domain/repositories/board.repository';
import { TaskRepository } from '../domain/repositories/task.repository';
import { Column, Task } from '../models/board.models';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ModalMode } from '../components/task-modal/task-modal';
import { LexoRank } from '@dalet-oss/lexorank';
import { RateLimiterService } from '../../../core/services/rate-limiter.service';
import { InputValidationService } from '../../../core/services/input-validation.service';

@Injectable({
  providedIn: 'root'
})
export class BoardFacade {
  private boardRepo = inject(BoardRepository);
  private taskRepo = inject(TaskRepository);
  private rateLimiter = inject(RateLimiterService);

  // State Signals
  isLoading = signal<boolean>(true);
  columns = signal<Column[]>([]);
  tasksByColumn = signal<Record<string, Task[]>>({});

  isModalOpen = signal<boolean>(false);
  modalMode = signal<ModalMode>('create');
  selectedTask = signal<Task | null>(null);
  activeColumnId = signal<string | null>(null);

  boardTitle = signal<string>('Cargando tablero...');
  isEditingTitle = signal<boolean>(false);
  userBoards = signal<{id: string; title: string}[]>([]);

  /** Non-null when an action has been rate-limited; shown as banner in the template. */
  rateLimitError = signal<string | null>(null);

  // Current Board ID tracking
  private currentBoardId: string | null = null;

  async loadBoardData(boardId: string) {
    this.currentBoardId = boardId;
    this.isLoading.set(true);

    const boardsList = await this.boardRepo.getAllUserBoards();
    this.userBoards.set(boardsList);

    const boardDetails = await this.boardRepo.getBoardDetails(boardId);
    if (boardDetails) {
      this.boardTitle.set(boardDetails.title);
    }

    const data = await this.boardRepo.getFullBoard(boardId);
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

    if (draggedTask.position !== newPositionStr || draggedTask.column_id !== targetColumnId) {
      draggedTask.position = newPositionStr;
      draggedTask.column_id = targetColumnId;
      console.log(`Moviendo tarea a LexoRank: ${newPositionStr}`);
      this.taskRepo.updateTasksBulk([draggedTask]);
    }
  }

  openCreateModal(columnId: string) {
    this.activeColumnId.set(columnId);
    this.modalMode.set('create');
    this.selectedTask.set(null);
    this.isModalOpen.set(true);
  }

  openViewModal(task: Task) {
    this.selectedTask.set(task);
    this.modalMode.set('view');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.activeColumnId.set(null);
    this.selectedTask.set(null);
  }

  dismissRateLimitError() {
    this.rateLimitError.set(null);
  }

  async saveTask(taskData: Partial<Task>) {
    if (this.modalMode() === 'edit' && this.selectedTask()) {
      const taskId = this.selectedTask()!.id;
      const columnId = this.selectedTask()!.column_id;

      const success = await this.taskRepo.updateTask(taskId, {
        title: taskData.title,
        description: taskData.description,
      });

      if (success) {
        this.tasksByColumn.update((prev) => {
          const updated = {...prev};
          const taskIndex = updated[columnId].findIndex((t) => t.id === taskId);
          if (taskIndex > -1) {
            updated[columnId][taskIndex] = {
              ...updated[columnId][taskIndex],
              title: taskData.title!,
              description: taskData.description,
            };
          }
          return updated;
        });
      }
    } else {
      // --- Rate limit check ---
      if (!this.rateLimiter.canPerform('create-task')) {
        this.rateLimitError.set(this.rateLimiter.getErrorMessage('create-task'));
        return;
      }

      const columnId = taskData.column_id!;
      const currentTasks = this.tasksByColumn()[columnId] || [];

      if (currentTasks.length === 0) {
        taskData.position = LexoRank.middle().toString();
      } else {
        try {
          const lastTask = currentTasks[currentTasks.length - 1];
          taskData.position = LexoRank.parse(lastTask.position).genNext().toString();
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
      }
    }
  }

  async deleteTask() {
    if (!this.selectedTask()) return;

    const taskId = this.selectedTask()!.id;
    const columnId = this.selectedTask()!.column_id;

    const success = await this.taskRepo.deleteTask(taskId);

    if (success) {
      this.tasksByColumn.update((prev) => {
        const updated = {...prev};
        updated[columnId] = updated[columnId].filter((t) => t.id !== taskId);
        return updated;
      });
      console.log('Task deleted successfully');
      this.closeModal();
    }
  }

  enableTitleEdit() {
    this.isEditingTitle.set(true);
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
    }
    this.isEditingTitle.set(false);
  }

  async deleteBoard(): Promise<boolean> {
    if (!this.currentBoardId) return false;
    return await this.boardRepo.deleteBoard(this.currentBoardId);
  }

  async createBoardWithDefaults(title: string): Promise<string | null> {
    // --- Rate limit check ---
    if (!this.rateLimiter.canPerform('create-board')) {
      this.rateLimitError.set(this.rateLimiter.getErrorMessage('create-board'));
      return null;
    }

    const sanitizedTitle = InputValidationService.sanitize(title, 100) || 'New Project';

    this.isLoading.set(true);
    const newBoardId = await this.boardRepo.createBoardWithDefaults(sanitizedTitle);
    if (!newBoardId) {
      this.isLoading.set(false);
    }
    return newBoardId;
  }
}
