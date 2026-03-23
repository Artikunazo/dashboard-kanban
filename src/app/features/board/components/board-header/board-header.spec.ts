import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardHeaderComponent } from './board-header';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('BoardHeaderComponent', () => {
  let component: BoardHeaderComponent;
  let fixture: ComponentFixture<BoardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardHeaderComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('boardTitle', 'Test Board');
    fixture.componentRef.setInput('isEditingTitle', false);
    fixture.componentRef.setInput('userBoards', [{ id: 'b1', title: 'Board 1' }]);
    fixture.componentRef.setInput('activeBoardId', 'b1');
    fixture.detectChanges();
  });

  it('should render title and emit edit event', () => {
    const titleEl = fixture.debugElement.query(By.css('h1'));
    expect(titleEl.nativeElement.textContent).toContain('Test Board');
    
    const spy = vi.spyOn(component.titleEditEnabled, 'emit');
    titleEl.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should render input and emit save on enter', () => {
    fixture.componentRef.setInput('isEditingTitle', true);
    fixture.detectChanges();
    
    const inputEl = fixture.debugElement.query(By.css('input'));
    expect(inputEl).toBeTruthy();
    
    const spy = vi.spyOn(component.titleSaved, 'emit');
    inputEl.nativeElement.value = 'New Title';
    inputEl.triggerEventHandler('keyup.enter', null);
    expect(spy).toHaveBeenCalledWith('New Title');
  });

  it('should emit cancel on escape key', () => {
    fixture.componentRef.setInput('isEditingTitle', true);
    fixture.detectChanges();
    
    const inputEl = fixture.debugElement.query(By.css('input'));
    const spy = vi.spyOn(component.titleEditCancelled, 'emit');
    inputEl.triggerEventHandler('keyup.escape', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit save on blur', () => {
    fixture.componentRef.setInput('isEditingTitle', true);
    fixture.detectChanges();
    
    const inputEl = fixture.debugElement.query(By.css('input'));
    const spy = vi.spyOn(component.titleSaved, 'emit');
    inputEl.nativeElement.value = 'Blur Title';
    inputEl.triggerEventHandler('blur', null);
    expect(spy).toHaveBeenCalledWith('Blur Title');
  });

  it('should render rate limit error and dismiss', () => {
    fixture.componentRef.setInput('rateLimitError', 'Slow down');
    fixture.detectChanges();
    
    const errorEl = fixture.debugElement.query(By.css('.bg-red-900\\/80'));
    expect(errorEl.nativeElement.textContent).toContain('Slow down');
    
    const btn = errorEl.query(By.css('button'));
    const spy = vi.spyOn(component.rateLimitDismissed, 'emit');
    btn.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle board selection change', () => {
    fixture.componentRef.setInput('userBoards', [
      { id: 'b1', title: 'Board 1' },
      { id: 'b2', title: 'Board 2' }
    ]);
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(By.css('select'));
    const spy = vi.spyOn(component.boardSelected, 'emit');
    
    selectEl.nativeElement.value = 'b2';
    selectEl.triggerEventHandler('change', { target: selectEl.nativeElement });
    expect(spy).toHaveBeenCalledWith('b2');
  });

  it('should not emit if selecting same board', () => {
    const selectEl = fixture.debugElement.query(By.css('select'));
    const spy = vi.spyOn(component.boardSelected, 'emit');
    
    selectEl.nativeElement.value = 'b1';
    selectEl.triggerEventHandler('change', { target: selectEl.nativeElement });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit delete and create events', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    let deleteBtn, createBtn;
    
    for (const btn of buttons) {
      if (btn.nativeElement.title === 'Delete Board') deleteBtn = btn;
      if (btn.nativeElement.textContent.includes('New Board')) createBtn = btn;
    }

    const deleteSpy = vi.spyOn(component.deleteBoard, 'emit');
    const createSpy = vi.spyOn(component.createBoard, 'emit');

    deleteBtn?.triggerEventHandler('click', null);
    createBtn?.triggerEventHandler('click', null);

    expect(deleteSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();
  });
});
