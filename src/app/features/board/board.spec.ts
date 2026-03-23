import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board';
import { BoardFacade } from './facades/board.facade';
import { signal } from '@angular/core';
import { Task } from './models/board.models';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockFacade: any;

  beforeEach(async () => {
    mockFacade = {
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
      
      loadBoardData: vi.fn(),
      handleTaskDrop: vi.fn(),
      openCreateModal: vi.fn(),
      openViewModal: vi.fn(),
      closeModal: vi.fn(),
      saveTask: vi.fn(),
      enableTitleEdit: vi.fn(),
      saveBoardTitle: vi.fn(),
      deleteBoard: vi.fn(),
      createBoardWithDefaults: vi.fn(),
      deleteTask: vi.fn(),
      dismissRateLimitError: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [
        { provide: BoardFacade, useValue: mockFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    
    // boardId is a required input
    fixture.componentRef.setInput('boardId', 'initial-board-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load board data on init via effect', () => {
    // The effect runs after detectChanges() and when boardId changes
    expect(mockFacade.loadBoardData).toHaveBeenCalledWith('initial-board-id');
  });

  it('should delegate drop to facade', () => {
    const event = {} as CdkDragDrop<Task[]>;
    component.drop(event, 'col-1');
    expect(mockFacade.handleTaskDrop).toHaveBeenCalledWith(event, 'col-1');
  });

  it('should delegate modal opens', () => {
    component.openCreateModal('col-1');
    expect(mockFacade.openCreateModal).toHaveBeenCalledWith('col-1');

    const task = {id: '1'} as Task;
    component.openViewModal(task);
    expect(mockFacade.openViewModal).toHaveBeenCalledWith(task);

    component.closeModal();
    expect(mockFacade.closeModal).toHaveBeenCalled();
  });

  it('should delegate save logic', async () => {
    await component.onSaveTask({ title: 'New' });
    expect(mockFacade.saveTask).toHaveBeenCalledWith({ title: 'New' });

    await component.saveBoardTitle('New Title');
    expect(mockFacade.saveBoardTitle).toHaveBeenCalledWith('New Title');

    await component.onDeleteTask();
    expect(mockFacade.deleteTask).toHaveBeenCalled();
  });

  it('should toggle title edit', () => {
    component.enableTitleEdit();
    expect(mockFacade.enableTitleEdit).toHaveBeenCalled();

    component.onTitleEditCancelled();
    expect(mockFacade.isEditingTitle()).toBe(false);
  });

  it('should handle logic for create board', async () => {
    vi.spyOn(window, 'prompt').mockReturnValue('My new board');
    vi.spyOn(component.boardChanged, 'emit');
    mockFacade.createBoardWithDefaults.mockResolvedValue('new-id');

    await component.onCreateNewBoard();

    expect(mockFacade.createBoardWithDefaults).toHaveBeenCalledWith('My new board');
    expect(component.boardChanged.emit).toHaveBeenCalledWith('new-id');
  });

  it('should delete board with confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockFacade.deleteBoard.mockResolvedValue(true);
    // Mock location reload is hard without a full window double, 
    // but the method resolves without error.
    await component.onDeleteBoard();
    expect(mockFacade.deleteBoard).toHaveBeenCalled();
  });

  it('should emit boardChanged on selection if different', () => {
    vi.spyOn(component.boardChanged, 'emit');
    component.onBoardSelected('new-board-id');
    expect(component.boardChanged.emit).toHaveBeenCalledWith('new-board-id');
  });

  it('should not emit boardChanged if same board id', () => {
    vi.spyOn(component.boardChanged, 'emit');
    component.onBoardSelected('initial-board-id');
    expect(component.boardChanged.emit).not.toHaveBeenCalled();
  });

  describe('DOM coverage', () => {
    it('should show loading state', () => {
      mockFacade.isLoading.set(true);
      fixture.detectChanges();
      const loadingEl = fixture.nativeElement.querySelector('p');
      expect(loadingEl.textContent).toContain('Loading board...');
    });

    it('should show board content and trigger header events', () => {
      mockFacade.isLoading.set(false);
      mockFacade.columns.set([{id: 'col-1', title: 'To Do', position: 'a', board_id: 'b'}]);
      fixture.detectChanges();

      const header = fixture.debugElement.query((element) => element.name === 'app-board-header');
      expect(header).toBeTruthy();
      
      header.triggerEventHandler('titleEditEnabled', null);
      expect(mockFacade.enableTitleEdit).toHaveBeenCalled();

      header.triggerEventHandler('titleSaved', 'New Title');
      expect(mockFacade.saveBoardTitle).toHaveBeenCalledWith('New Title');

      header.triggerEventHandler('titleEditCancelled', null);
      expect(mockFacade.isEditingTitle()).toBe(false);

      vi.spyOn(component, 'onBoardSelected');
      header.triggerEventHandler('boardSelected', 'board-2');
      expect(component.onBoardSelected).toHaveBeenCalledWith('board-2');

      vi.spyOn(component, 'onDeleteBoard');
      header.triggerEventHandler('deleteBoard', null);
      expect(component.onDeleteBoard).toHaveBeenCalled();

      vi.spyOn(component, 'onCreateNewBoard');
      header.triggerEventHandler('createBoard', null);
      expect(component.onCreateNewBoard).toHaveBeenCalled();

      header.triggerEventHandler('rateLimitDismissed', null);
      expect(mockFacade.dismissRateLimitError).toHaveBeenCalled();
    });

    it('should trigger column events', () => {
      mockFacade.isLoading.set(false);
      mockFacade.columns.set([{id: 'col-1', title: 'To Do', position: 'a', board_id: 'b'}]);
      fixture.detectChanges();

      const column = fixture.debugElement.query((element) => element.name === 'app-column');
      expect(column).toBeTruthy();

      vi.spyOn(component, 'openCreateModal');
      column.triggerEventHandler('addTask', null);
      expect(component.openCreateModal).toHaveBeenCalledWith('col-1');

      const task = {id: '1'} as Task;
      vi.spyOn(component, 'openViewModal');
      column.triggerEventHandler('taskClicked', task);
      expect(component.openViewModal).toHaveBeenCalledWith(task);

      const dragEvent = {} as any;
      vi.spyOn(component, 'drop');
      column.triggerEventHandler('taskDropped', dragEvent);
      expect(component.drop).toHaveBeenCalledWith(dragEvent, 'col-1');
    });

    it('should trigger task modal events', () => {
      mockFacade.isLoading.set(false);
      fixture.detectChanges();

      const modal = fixture.debugElement.query((element) => element.name === 'app-task-modal');
      expect(modal).toBeTruthy();

      vi.spyOn(component, 'closeModal');
      modal.triggerEventHandler('closeModal', null);
      expect(component.closeModal).toHaveBeenCalled();

      modal.triggerEventHandler('saveTask', { title: 'New' });
      expect(mockFacade.saveTask).toHaveBeenCalledWith({ title: 'New' });

      mockFacade.patchTask = vi.fn();
      modal.triggerEventHandler('patchTask', { taskId: '1', columnId: 'col-1', updates: { title: 'New' }});
      expect(mockFacade.patchTask).toHaveBeenCalledWith('1', 'col-1', { title: 'New' });

      modal.triggerEventHandler('deleteTaskRequested', null);
      expect(mockFacade.deleteTask).toHaveBeenCalled();
    });
  });
});
