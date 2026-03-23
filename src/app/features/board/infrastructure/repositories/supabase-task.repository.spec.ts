import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SupabaseTaskRepository } from './supabase-task.repository';
import { SupabaseService } from '../../../../core/services/supabase';
import { Task } from '../../models/board.models';

describe('SupabaseTaskRepository', () => {
  let repository: SupabaseTaskRepository;
  let mockSupabaseClient: any;
  let mockSupabaseService: any;

  beforeEach(() => {
    mockSupabaseClient = {
      from: vi.fn().mockImplementation((table: string) => {
        return {
          update: vi.fn().mockImplementation(() => {
            return {
              eq: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
            };
          }),
          upsert: vi.fn().mockReturnValue(Promise.resolve({ error: null })),
          insert: vi.fn().mockImplementation(() => {
            return {
              select: vi.fn().mockImplementation(() => {
                return {
                  single: vi.fn().mockReturnValue(Promise.resolve({ data: { id: 'new-task', title: 'New Task' }, error: null }))
                };
              })
            };
          }),
          delete: vi.fn().mockImplementation(() => {
            return {
              eq: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
            };
          })
        };
      })
    };

    mockSupabaseService = { client: mockSupabaseClient };

    TestBed.configureTestingModule({
      providers: [
        SupabaseTaskRepository,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });

    repository = TestBed.inject(SupabaseTaskRepository);
  });

  describe('updateTaskPosition', () => {
    it('should update task position', async () => {
      const task: Task = { id: '1', column_id: 'col-1', position: 'A', title: 'Test Task' } as Task;
      const result = await repository.updateTaskPosition(task);
      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('tasks');
    });

    it('should return false on error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(Promise.resolve({ error: new Error('DB Error') }))
        })
      });
      vi.spyOn(console, 'error');
      
      const task: Task = { id: '1', column_id: 'col-1', position: 'A', title: 'Test Task' } as Task;
      const result = await repository.updateTaskPosition(task);
      expect(result).toBe(false);
    });
  });

  describe('updateTasksBulk', () => {
    it('should update multiple tasks', async () => {
      const tasks: Task[] = [
        { id: '1', title: 'Task 1', assignee: { name: 'John' } } as any,
        { id: '2', title: 'Task 2' } as any
      ];
      
      const result = await repository.updateTasksBulk(tasks);
      expect(result).toBe(true);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('tasks');
    });

    it('should return true immediately if task array is empty', async () => {
      const result = await repository.updateTasksBulk([]);
      expect(result).toBe(true);
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('should create valid task', async () => {
      const result = await repository.createTask({ title: 'New Task' });
      expect(result?.title).toBe('New Task');
    });

    it('should return null on error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(Promise.resolve({ data: null, error: new Error('DB Error') }))
          })
        })
      });
      vi.spyOn(console, 'error');
      
      const result = await repository.createTask({ title: 'New Task' });
      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const result = await repository.updateTask('1', { title: 'Updated' });
      expect(result).toBe(true);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const result = await repository.deleteTask('1');
      expect(result).toBe(true);
    });
  });
});
