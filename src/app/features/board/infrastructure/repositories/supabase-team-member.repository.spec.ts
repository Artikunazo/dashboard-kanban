import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SupabaseTeamMemberRepository } from './supabase-team-member.repository';
import { SupabaseService } from '../../../../core/services/supabase';
import { TeamMember } from '../../models/board.models';

describe('SupabaseTeamMemberRepository', () => {
  let repository: SupabaseTeamMemberRepository;
  let mockSupabaseClient: any;
  let mockSupabaseService: any;

  beforeEach(() => {
    // Creating the chainable mock for Supabase
    let orderMock = vi.fn().mockReturnValue(Promise.resolve({ data: [{ id: '1', name: 'John Doe', avatar_url: '', role: 'dev' }], error: null }));
    let selectMock = vi.fn().mockReturnValue({ order: orderMock });
    mockSupabaseClient = {
      from: vi.fn().mockReturnValue({ select: selectMock })
    };

    mockSupabaseService = { client: mockSupabaseClient };

    TestBed.configureTestingModule({
      providers: [
        SupabaseTeamMemberRepository,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });

    repository = TestBed.inject(SupabaseTeamMemberRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch team members and return them', async () => {
      const result = await repository.getAll();
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('team_members');
      expect(mockSupabaseClient.from().select).toHaveBeenCalledWith('id, name, avatar_url, role');
      expect(mockSupabaseClient.from().select().order).toHaveBeenCalledWith('name', { ascending: true });
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('John Doe');
    });

    it('should return empty array on error', async () => {
      // Override the mock to throw an error
      mockSupabaseClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue(Promise.resolve({ data: null, error: new Error('DB Error') }))
        })
      });
      vi.spyOn(console, 'error'); // suppress error logging in test runner

      const result = await repository.getAll();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
