import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskModal } from './task-modal';
import { FormBuilder } from '@angular/forms';
import { Task } from '../../models/board.models';
import { By } from '@angular/platform-browser';

describe('TaskModal', () => {
  let component: TaskModal;
  let fixture: ComponentFixture<TaskModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskModal]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskModal);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('mode', 'create');
    fixture.componentRef.setInput('columnId', 'col-1');
    fixture.componentRef.setInput('columns', [{id: 'col-1', title: 'To Do'}]);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute columnTitle', () => {
    expect(component.columnTitle()).toBe('To Do');
    
    // test fallback
    fixture.componentRef.setInput('columnId', 'col-unknown');
    expect(component.columnTitle()).toBe('col-unknown');
  });

  it('should close on delete when user confirms', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(component.deleteTaskRequested, 'emit');
    vi.spyOn(component.closeModal, 'emit');
    
    component.onDelete();
    
    expect(component.deleteTaskRequested.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should not close on delete when user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    vi.spyOn(component.deleteTaskRequested, 'emit');
    vi.spyOn(component.closeModal, 'emit');
    
    component.onDelete();
    
    expect(component.deleteTaskRequested.emit).not.toHaveBeenCalled();
    expect(component.closeModal.emit).not.toHaveBeenCalled();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should handle submit correctly if valid', () => {
    vi.spyOn(component.saveTask, 'emit');
    vi.spyOn(component.closeModal, 'emit');
    
    component.taskForm.patchValue({
        title: 'Valid Task',
        description: 'Desc'
    });
    
    component.onSubmit();
    
    expect(component.saveTask.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should not emit saveTask if form is invalid', () => {
    vi.spyOn(component.saveTask, 'emit');
    component.taskForm.patchValue({
        title: '' // invalid
    });
    component.onSubmit();
    expect(component.saveTask.emit).not.toHaveBeenCalled();
  });

  it('should update taskAssignee and emit patchTask if in view mode', () => {
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('task', {id: '1', column_id: 'col-1', title: 'Task'} as Task);
    fixture.detectChanges();

    vi.spyOn(component.patchTask, 'emit');
    component.updateAssignee('user-1');
    expect(component.selectedAssigneeId()).toBe('user-1');
    expect(component.patchTask.emit).toHaveBeenCalledWith({
      taskId: '1', columnId: 'col-1', updates: { assignee_id: 'user-1' }
    });
  });

  it('should update selectedAssigneeId without emitting if in create mode', () => {
    vi.spyOn(component.patchTask, 'emit');
    component.updateAssignee('user-1');
    expect(component.selectedAssigneeId()).toBe('user-1');
    expect(component.patchTask.emit).not.toHaveBeenCalled();
  });

  it('should toggle edit states', () => {
    component.enableTitleEdit();
    expect(component.isEditingTitle()).toBe(true);
    expect(component.isEditingDescription()).toBe(false);

    component.enableDescriptionEdit();
    expect(component.isEditingDescription()).toBe(true);
    expect(component.isEditingTitle()).toBe(false);

    component.cancelTitleEdit();
    expect(component.isEditingTitle()).toBe(false);

    component.cancelDescriptionEdit();
    expect(component.isEditingDescription()).toBe(false);
  });

  it('should save inline title', () => {
    fixture.componentRef.setInput('task', {id: '1', column_id: 'col-1', title: 'Old Title'} as Task);
    fixture.detectChanges();
    vi.spyOn(component.patchTask, 'emit');
    
    component.saveInlineTitle('New Title');
    expect(component.isEditingTitle()).toBe(false);
    expect(component.patchTask.emit).toHaveBeenCalledWith({
      taskId: '1', columnId: 'col-1', updates: { title: 'New Title' }
    });
  });

  it('should not save inline title if unchanged', () => {
    fixture.componentRef.setInput('task', {id: '1', column_id: 'col-1', title: 'Old Title'} as Task);
    fixture.detectChanges();
    vi.spyOn(component.patchTask, 'emit');
    
    component.saveInlineTitle('Old Title');
    expect(component.patchTask.emit).not.toHaveBeenCalled();
  });

  it('should save inline description', () => {
    fixture.componentRef.setInput('task', {id: '1', column_id: 'col-1', title: 'Task', description: 'Old'} as Task);
    fixture.detectChanges();
    vi.spyOn(component.patchTask, 'emit');
    
    component.saveInlineDescription('New Desc');
    expect(component.isEditingDescription()).toBe(false);
    expect(component.patchTask.emit).toHaveBeenCalledWith({
      taskId: '1', columnId: 'col-1', updates: { description: 'New Desc' }
    });
  });

  it('should handle effect reset when closed', () => {
    // Already open, let's close it
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges(); // triggers effect
    expect(component.selectedAssigneeId()).toBeNull();
  });

  it('should handle effect initialization when opened in view mode', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges(); 
    
    fixture.componentRef.setInput('mode', 'view');
    fixture.componentRef.setInput('task', {id: '1', title: 'Task View', description: 'Desc View', assignee_id: 'user-2'} as Task);
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    expect(component.taskForm.value.title).toBe('Task View');
    expect(component.selectedAssigneeId()).toBe('user-2');
  });

  describe('DOM interactions for coverage', () => {
    it('should stop propagation when clicking inner modal content', () => {
      const inner = fixture.nativeElement.querySelector('.bg-slate-900\\/95');
      const event = new Event('click');
      vi.spyOn(event, 'stopPropagation');
      inner.dispatchEvent(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should open meatball menu and show delete button', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task'} as Task);
      fixture.detectChanges();
      
      const dotsBtn = fixture.nativeElement.querySelector('button[title="More options"]');
      dotsBtn.click();
      fixture.detectChanges();
      
      expect(component.isMenuOpen()).toBe(true);
      
      // click delete
      vi.spyOn(component, 'onDelete');
      const deleteBtn = fixture.nativeElement.querySelector('button.text-red-400');
      if (deleteBtn) deleteBtn.click();
      expect(component.onDelete).toHaveBeenCalled();

      // click invisible overlay to close menu
      const menuOverlay = fixture.nativeElement.querySelector('.fixed.inset-0.z-40');
      if (menuOverlay) menuOverlay.click();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('should toggle edit title on click', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task'} as Task);
      fixture.detectChanges();

      const titleEl = fixture.nativeElement.querySelector('h2.cursor-pointer');
      titleEl.click();
      fixture.detectChanges();

      expect(component.isEditingTitle()).toBe(true);
      
      // save
      const saveBtn = fixture.nativeElement.querySelector('button.bg-indigo-600');
      vi.spyOn(component, 'saveInlineTitle');
      if (saveBtn) saveBtn.dispatchEvent(new Event('mousedown'));
      expect(component.saveInlineTitle).toHaveBeenCalled();

      // cancel
      const cancelBtn = fixture.nativeElement.querySelector('button.bg-slate-700');
      vi.spyOn(component, 'cancelTitleEdit');
      if (cancelBtn) cancelBtn.dispatchEvent(new Event('mousedown'));
      expect(component.cancelTitleEdit).toHaveBeenCalled();
    });

    it('should toggle edit description on click', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task'} as Task);
      fixture.detectChanges();

      const descEl = fixture.nativeElement.querySelector('p.cursor-pointer');
      descEl.click();
      fixture.detectChanges();

      expect(component.isEditingDescription()).toBe(true);
      
      const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLElement[];
      const saveBtn = buttons.find(b => b.textContent?.includes('Save'));
      vi.spyOn(component, 'saveInlineDescription');
      if (saveBtn) saveBtn.dispatchEvent(new Event('mousedown'));
      expect(component.saveInlineDescription).toHaveBeenCalled();

      const cancelBtn = buttons.find(b => b.textContent?.includes('Cancel'));
      vi.spyOn(component, 'cancelDescriptionEdit');
      if (cancelBtn) cancelBtn.dispatchEvent(new Event('mousedown'));
      expect(component.cancelDescriptionEdit).toHaveBeenCalled();
    });

    it('should hit Title Input keyboard events', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task'} as Task);
      fixture.detectChanges();
      component.enableTitleEdit();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      vi.spyOn(component, 'cancelTitleEdit');
      input.triggerEventHandler('keyup.escape', null);
      expect(component.cancelTitleEdit).toHaveBeenCalled();
      
      vi.spyOn(component, 'saveInlineTitle');
      input.triggerEventHandler('keyup.enter', null);
      expect(component.saveInlineTitle).toHaveBeenCalled();
    });

    it('should hit Description Textarea keyboard events', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task', description: ''} as Task);
      fixture.detectChanges();
      component.enableDescriptionEdit();
      fixture.detectChanges();

      const ta = fixture.debugElement.query(By.css('textarea'));
      vi.spyOn(component, 'cancelDescriptionEdit');
      ta.triggerEventHandler('keyup.escape', null);
      expect(component.cancelDescriptionEdit).toHaveBeenCalled();
    });

    it('should submit form on submit event', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      const form = fixture.debugElement.query(By.css('form'));
      vi.spyOn(component, 'onSubmit');
      form.triggerEventHandler('ngSubmit', null);
      expect(component.onSubmit).toHaveBeenCalled();
    });



    it('should hit selectedIdChange in create mode', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      
      const pickerEl = fixture.debugElement.query(By.css('app-assignee-picker'));
      pickerEl.triggerEventHandler('selectedIdChange', 'user2');
      expect(component.selectedAssigneeId()).toBe('user2');
    });

    it('should hit Cancel button in form', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.detectChanges();
      vi.spyOn(component, 'onClose');
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const cancelBtn = buttons.find(b => b.nativeElement.textContent.includes('Cancel'));
      cancelBtn?.nativeElement.click();
      expect(component.onClose).toHaveBeenCalled();
    });

    it('should show isSubmitting spinner', () => {
      fixture.componentRef.setInput('mode', 'create');
      fixture.componentRef.setInput('isSubmitting', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Saving...');
    });

    it('should hit selectedIdChange in view mode', () => {
      fixture.componentRef.setInput('mode', 'view');
      fixture.componentRef.setInput('task', {id: '1', title: 'Task'} as Task);
      fixture.detectChanges();
      
      const pickerEl = fixture.debugElement.query(By.css('app-assignee-picker'));
      vi.spyOn(component, 'updateAssignee');
      pickerEl.triggerEventHandler('selectedIdChange', 'user3');
      expect(component.updateAssignee).toHaveBeenCalledWith('user3');
    });


  });
});
