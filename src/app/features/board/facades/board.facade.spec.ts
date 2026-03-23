import {TestBed} from '@angular/core/testing';
import {BoardFacade} from './board.facade';
import {BoardRepository} from '../domain/repositories/board.repository';
import {TaskRepository} from '../domain/repositories/task.repository';
import {SupabaseTeamMemberRepository} from '../infrastructure/repositories/supabase-team-member.repository';
import {RateLimiterService} from '../../../core/services/rate-limiter.service';
import {ToastService} from '../../../core/services/toast.service';
import {vi} from 'vitest';
import {Task} from '../models/board.models';
import {LexoRank} from '@dalet-oss/lexorank';

describe('BoardFacade', () => {
	let facade: BoardFacade;
	let mockBoardRepo: any;
	let mockTaskRepo: any;
	let mockTeamMemberRepo: any;
	let mockRateLimiter: any;
	let mockToastService: any;

	beforeEach(() => {
		mockBoardRepo = {
			getAllUserBoards: vi.fn(),
			getBoardDetails: vi.fn(),
			getFullBoard: vi.fn(),
			updateBoardTitle: vi.fn(),
			deleteBoard: vi.fn(),
			createBoardWithDefaults: vi.fn(),
		};

		mockTaskRepo = {
			updateTasksBulk: vi.fn(),
			updateTask: vi.fn(),
			createTask: vi.fn(),
			deleteTask: vi.fn(),
		};

		mockTeamMemberRepo = {
			getAll: vi.fn(),
		};

		mockRateLimiter = {
			canPerform: vi.fn().mockReturnValue(true),
			getErrorMessage: vi.fn().mockReturnValue('Rate limited'),
		};

		mockToastService = {
			showSuccess: vi.fn(),
		};

		TestBed.configureTestingModule({
			providers: [
				BoardFacade,
				{provide: BoardRepository, useValue: mockBoardRepo},
				{provide: TaskRepository, useValue: mockTaskRepo},
				{provide: SupabaseTeamMemberRepository, useValue: mockTeamMemberRepo},
				{provide: RateLimiterService, useValue: mockRateLimiter},
				{provide: ToastService, useValue: mockToastService},
			],
		});

		facade = TestBed.inject(BoardFacade);
	});

	it('should be created', () => {
		expect(facade).toBeTruthy();
	});

	describe('loadBoardData', () => {
		it('should load data and populate signals', async () => {
			mockBoardRepo.getAllUserBoards.mockResolvedValue([
				{id: 'board-1', title: 'Test 1'},
			]);
			mockBoardRepo.getBoardDetails.mockResolvedValue({
				id: 'board-1',
				title: 'My Board',
			});
			mockBoardRepo.getFullBoard.mockResolvedValue({
				columns: [
					{id: 'col-1', title: 'To Do', board_id: 'board-1', position: 'a'},
				],
				tasks: [
					{id: 'task-1', title: 'Task 1', column_id: 'col-1', position: 'a'},
				],
			});
			mockTeamMemberRepo.getAll.mockResolvedValue([
				{id: 'user-1', name: 'John'},
			]);

			await facade.loadBoardData('board-1');

			expect(facade.isLoading()).toBe(false);
			expect(facade.boardTitle()).toBe('My Board');
			expect(facade.userBoards().length).toBe(1);
			expect(facade.teamMembers().length).toBe(1);
			expect(facade.columns().length).toBe(1);
			expect(facade.tasksByColumn()['col-1'].length).toBe(1);
		});
	});

	describe('Modal management', () => {
		it('should open create modal', () => {
			facade.openCreateModal('col-1');
			expect(facade.activeColumnId()).toBe('col-1');
			expect(facade.modalMode()).toBe('create');
			expect(facade.selectedTask()).toBeNull();
			expect(facade.isModalOpen()).toBe(true);
		});

		it('should open view modal', () => {
			const task = {id: 'task-1'} as Task;
			facade.openViewModal(task);
			expect(facade.selectedTask()).toEqual(task);
			expect(facade.modalMode()).toBe('view');
			expect(facade.isModalOpen()).toBe(true);
		});

		it('should close modal', () => {
			facade.isModalOpen.set(true);
			facade.closeModal();
			expect(facade.isModalOpen()).toBe(false);
			expect(facade.activeColumnId()).toBeNull();
			expect(facade.selectedTask()).toBeNull();
		});
	});

	describe('Rate Limiter', () => {
		it('should dismiss rate limit error', () => {
			facade.rateLimitError.set('Error');
			facade.dismissRateLimitError();
			expect(facade.rateLimitError()).toBeNull();
		});
	});

	describe('Task Operations', () => {
		beforeEach(() => {
			facade.tasksByColumn.set({
				'col-1': [
					{
						id: '1',
						title: 'Task 1',
						column_id: 'col-1',
						position: 'a',
						assignee_id: null,
					} as Task,
				],
			});
			facade.teamMembers.set([{id: 'user-1', name: 'User'} as any]);
		});

		it('should patch task successfully', async () => {
			mockTaskRepo.updateTask.mockResolvedValue(true);

			await facade.patchTask('1', 'col-1', {
				title: 'Updated Task',
				assignee_id: 'user-1',
			});

			expect(mockTaskRepo.updateTask).toHaveBeenCalled();
			const updatedTask = facade.tasksByColumn()['col-1'][0];
			expect(updatedTask.title).toBe('Updated Task');
			expect(updatedTask.assignee?.name).toBe('User');
			expect(mockToastService.showSuccess).toHaveBeenCalledWith(
				'Task updated successfully',
			);
		});

		it('should save task successfully', async () => {
			mockTaskRepo.createTask.mockResolvedValue({
				id: '2',
				title: 'New',
				column_id: 'col-1',
			} as Task);

			await facade.saveTask({title: 'New', column_id: 'col-1'});

			expect(mockTaskRepo.createTask).toHaveBeenCalled();
			expect(facade.tasksByColumn()['col-1'].length).toBe(2);
			expect(mockToastService.showSuccess).toHaveBeenCalledWith(
				'New task created',
			);
		});

		it('should block save task if rate limited', async () => {
			mockRateLimiter.canPerform.mockReturnValue(false);

			await facade.saveTask({title: 'New', column_id: 'col-1'});

			expect(mockTaskRepo.createTask).not.toHaveBeenCalled();
			expect(facade.rateLimitError()).toBe('Rate limited');
		});

		it('should delete task successfully', async () => {
			facade.selectedTask.set({id: '1', column_id: 'col-1'} as Task);
			mockTaskRepo.deleteTask.mockResolvedValue(true);

			await facade.deleteTask();

			expect(mockTaskRepo.deleteTask).toHaveBeenCalledWith('1');
			expect(facade.tasksByColumn()['col-1'].length).toBe(0);
			expect(mockToastService.showSuccess).toHaveBeenCalledWith(
				'Task deleted permanently',
			);
		});

		it('should not delete task if no selected task', async () => {
			facade.selectedTask.set(null);
			await facade.deleteTask();
			expect(mockTaskRepo.deleteTask).not.toHaveBeenCalled();
		});
	});

	describe('Board Operations', () => {
		beforeEach(() => {
			// Fake loading a board to set currentBoardId
			facade['currentBoardId'] = 'board-1';
			facade.boardTitle.set('Old Title');
		});

		it('should enable title edit', () => {
			facade.enableTitleEdit();
			expect(facade.isEditingTitle()).toBe(true);
		});

		it('should save board title', async () => {
			mockBoardRepo.updateBoardTitle.mockResolvedValue(true);
			mockBoardRepo.getAllUserBoards.mockResolvedValue([
				{id: 'board-1', title: 'New Title'},
			]);

			await facade.saveBoardTitle('New Title');

			expect(mockBoardRepo.updateBoardTitle).toHaveBeenCalledWith(
				'board-1',
				'New Title',
			);
			expect(facade.boardTitle()).toBe('New Title');
			expect(mockToastService.showSuccess).toHaveBeenCalledWith(
				'Board title updated',
			);
		});

		it('should not save title if unchanged', async () => {
			await facade.saveBoardTitle('Old Title');
			expect(mockBoardRepo.updateBoardTitle).not.toHaveBeenCalled();
		});

		it('should delete board', async () => {
			mockBoardRepo.deleteBoard.mockResolvedValue(true);
			const res = await facade.deleteBoard();
			expect(res).toBe(true);
			expect(mockBoardRepo.deleteBoard).toHaveBeenCalledWith('board-1');
		});

		it('should create board with defaults', async () => {
			mockBoardRepo.createBoardWithDefaults.mockResolvedValue('board-2');
			const res = await facade.createBoardWithDefaults('New Project');

			expect(res).toBe('board-2');
			expect(mockToastService.showSuccess).toHaveBeenCalledWith(
				'New board created',
			);
		});

		it('should block create board if rate limited', async () => {
			mockRateLimiter.canPerform.mockReturnValue(false);
			const res = await facade.createBoardWithDefaults('New Project');

			expect(res).toBeNull();
			expect(mockBoardRepo.createBoardWithDefaults).not.toHaveBeenCalled();
		});
	});

	describe('handleTaskDrop', () => {
		it('should handle drop within same container', () => {
			const task1 = {
				id: '1',
				title: '1',
				position: LexoRank.min().toString(),
			} as any;
			const task2 = {
				id: '2',
				title: '2',
				position: LexoRank.min().genNext().toString(),
			} as any;

			const event = {
				previousContainer: {data: [task1, task2]},
				container: {data: [task1, task2]},
				previousIndex: 0,
				currentIndex: 1,
			} as any;

			facade.handleTaskDrop(event, 'col-1');
			expect(mockTaskRepo.updateTasksBulk).toHaveBeenCalled();
		});

		it('should handle drop in different container', () => {
			const task1 = {
				id: '1',
				title: '1',
				position: LexoRank.min().toString(),
			} as any;

			const event = {
				previousContainer: {data: [task1]},
				container: {data: []},
				previousIndex: 0,
				currentIndex: 0,
			} as any;

			facade.handleTaskDrop(event, 'col-2');
			expect(mockTaskRepo.updateTasksBulk).toHaveBeenCalled();
		});
	});
});
