import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { SupabaseService } from './core/services/supabase';
import { BoardFacade } from './features/board/facades/board.facade';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let mockSupabase: any;

  beforeEach(async () => {
    mockSupabase = {
      initializeAnonymousSession: vi.fn(),
      getUserBoard: vi.fn(),
      createDemoBoard: vi.fn()
    };

    const mockFacade = {
      isLoading: signal(false),
      columns: signal([]),
      tasksByColumn: signal({}),
      isModalOpen: signal(false),
      modalMode: signal('create'),
      selectedTask: signal(null),
      activeColumnId: signal(null),
      teamMembers: signal([]),
      isTaskSubmitting: signal(false),
      isTaskDeleting: signal(false),
      boardTitle: signal(''),
      isEditingTitle: signal(false),
      userBoards: signal([]),
      rateLimitError: signal(null),
      loadBoardData: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: BoardFacade, useValue: mockFacade },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize session and recover board from localStorage', async () => {
    mockSupabase.initializeAnonymousSession.mockResolvedValue({ id: 'user-1' });
    localStorage.setItem('active_board_id', 'board-123');

    await component.ngOnInit();

    expect(component.activeBoardId()).toBe('board-123');
    expect(mockSupabase.getUserBoard).not.toHaveBeenCalled();
  });

  it('should initialize session and get board from DB if not in localStorage', async () => {
    mockSupabase.initializeAnonymousSession.mockResolvedValue({ id: 'user-1' });
    mockSupabase.getUserBoard.mockResolvedValue('board-db');

    await component.ngOnInit();

    expect(mockSupabase.getUserBoard).toHaveBeenCalledWith('user-1');
    expect(component.activeBoardId()).toBe('board-db');
    expect(localStorage.getItem('active_board_id')).toBe('board-db');
  });

  it('should initialize session and create demo board if no board exists', async () => {
    mockSupabase.initializeAnonymousSession.mockResolvedValue({ id: 'user-1' });
    mockSupabase.getUserBoard.mockResolvedValue(null);
    mockSupabase.createDemoBoard.mockResolvedValue('board-demo');

    await component.ngOnInit();

    expect(mockSupabase.createDemoBoard).toHaveBeenCalledWith('user-1');
    expect(component.activeBoardId()).toBe('board-demo');
  });

  it('should update activeBoardId onBoardChanged', () => {
    component.onBoardChanged('new-board');
    expect(component.activeBoardId()).toBe('new-board');
    expect(localStorage.getItem('active_board_id')).toBe('new-board');
  });

  describe('DOM Coverage', () => {
    it('should show loading state when activeBoardId is null', () => {
      component.activeBoardId.set(null);
      fixture.detectChanges();
      const loadingEl = fixture.nativeElement.querySelector('.animate-spin');
      expect(loadingEl).toBeTruthy();
    });

    it('should show app-board when activeBoardId is set', async () => {
      component.activeBoardId.set('board-1');
      fixture.detectChanges();
      await fixture.whenStable();

      const boardEl = fixture.nativeElement.querySelector('app-board');
      expect(boardEl).toBeTruthy();
    });
  });
});
