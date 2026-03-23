import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SupabaseBoardRepository } from './supabase-board.repository';
import { SupabaseService } from '../../../../core/services/supabase';
import { LexoRank } from '@dalet-oss/lexorank';

describe('SupabaseBoardRepository', () => {
  let repository: SupabaseBoardRepository;
  let mockSupabaseClient: any;
  let mockSupabaseService: any;

  beforeEach(() => {
    mockSupabaseClient = {
      from: vi.fn().mockImplementation((table: string) => {
        return {
          select: vi.fn().mockImplementation(() => {
            return {
              eq: vi.fn().mockImplementation(() => {
                return {
                  order: vi.fn().mockReturnValue(Promise.resolve({ data: [{ id: 'col-1', title: 'To Do', board_id: '1' }], error: null })),
                  single: vi.fn().mockReturnValue(Promise.resolve({ data: { id: '1', title: 'Board 1' }, error: null })),
                  order_limit: vi.fn().mockReturnValue({
                    limit: vi.fn().mockReturnValue({
                      maybeSingle: vi.fn().mockReturnValue(Promise.resolve({ data: { id: '1' }, error: null }))
                    })
                  })
                };
              }),
              in: vi.fn().mockImplementation(() => {
                return {
                  order: vi.fn().mockReturnValue(Promise.resolve({ data: [{ id: 'task-1', column_id: 'col-1' }], error: null }))
                }
              }),
              order: vi.fn().mockReturnValue(Promise.resolve({ data: [{ id: '1', title: 'Board 1' }], error: null }))
            };
          }),
          update: vi.fn().mockImplementation(() => {
            return {
              eq: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
            };
          }),
          delete: vi.fn().mockImplementation(() => {
            return {
              eq: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
            };
          }),
          insert: vi.fn().mockImplementation(() => {
            return {
              select: vi.fn().mockImplementation(() => {
                return {
                  single: vi.fn().mockReturnValue(Promise.resolve({ data: { id: 'new-board' }, error: null }))
                };
              }),
              then: vi.fn() // For the columns insert which doesn't chain
            };
          })
        };
      }),
      auth: {
        getSession: vi.fn().mockReturnValue(Promise.resolve({ data: { session: { user: { id: 'user-1' } } }, error: null }))
      }
    };

    mockSupabaseService = { client: mockSupabaseClient };

    TestBed.configureTestingModule({
      providers: [
        SupabaseBoardRepository,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });

    repository = TestBed.inject(SupabaseBoardRepository);
  });

  describe('getFullBoard', () => {
    it('should return board data', async () => {
      const result = await repository.getFullBoard('1');
      expect(result).toBeDefined();
      expect(result?.columns.length).toBe(1);
      expect(result?.tasks.length).toBe(1);
    });

    it('should return null on error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue(Promise.resolve({ data: null, error: new Error('Error') }))
          })
        })
      });
      vi.spyOn(console, 'error');
      const result = await repository.getFullBoard('1');
      expect(result).toBeNull();
    });
  });

  describe('getBoardDetails', () => {
    it('should return detail', async () => {
      const result = await repository.getBoardDetails('1');
      expect(result.title).toBe('Board 1');
    });

    it('should return null on error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockReturnValue(Promise.resolve({ data: null, error: new Error('Error') }))
          })
        })
      });
      vi.spyOn(console, 'error');
      const result = await repository.getBoardDetails('1');
      expect(result).toBeNull();
    });
  });

  describe('updateBoardTitle', () => {
    it('should return true', async () => {
      const result = await repository.updateBoardTitle('1', 'New Title');
      expect(result).toBe(true);
    });

    it('should return false on error', async () => {
      mockSupabaseClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue(Promise.resolve({ error: new Error('Error') }))
        })
      });
      vi.spyOn(console, 'error');
      const result = await repository.updateBoardTitle('1', 'New Title');
      expect(result).toBe(false);
    });
  });

  describe('deleteBoard', () => {
    it('should return true', async () => {
      const result = await repository.deleteBoard('1');
      expect(result).toBe(true);
    });
  });

  describe('createBoardWithDefaults', () => {
    it('should return new board id', async () => {
      // Because insert chaining without select just returns a promise with error
      mockSupabaseClient.from.mockImplementation((table: string) => {
        if (table === 'boards') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockReturnValue(Promise.resolve({ data: { id: 'new-board' }, error: null }))
              })
            })
          };
        } else if (table === 'columns') {
          return {
            insert: vi.fn().mockReturnValue(Promise.resolve({ error: null }))
          };
        }
        return {};
      });

      const result = await repository.createBoardWithDefaults('Title');
      expect(result).toBe('new-board');
    });

    it('should return null if no session', async () => {
      mockSupabaseClient.auth.getSession.mockReturnValue(Promise.resolve({ data: { session: null } }));
      vi.spyOn(console, 'error');
      const result = await repository.createBoardWithDefaults('Title');
      expect(result).toBeNull();
    });
  });

  describe('getAllUserBoards', () => {
    it('should return list of boards', async () => {
      const result = await repository.getAllUserBoards();
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('col-1');
    });

    it('should return empty if no session', async () => {
      mockSupabaseClient.auth.getSession.mockReturnValue(Promise.resolve({ data: { session: null } }));
      const result = await repository.getAllUserBoards();
      expect(result.length).toBe(0);
    });
  });
});
