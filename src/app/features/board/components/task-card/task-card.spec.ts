import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
  });

  it('should render task without assignee', () => {
    fixture.componentRef.setInput('task', { id: '1', title: 'Task 1', description: 'Desc' });
    fixture.detectChanges();
    
    const title = fixture.debugElement.query(By.css('h3'));
    const desc = fixture.debugElement.query(By.css('p'));
    
    expect(title.nativeElement.textContent).toContain('Task 1');
    expect(desc.nativeElement.textContent).toContain('Desc');
    
    // Should have no img or initials
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();
    // Using broader selector for any rounded full element with the initials class
    const initialElements = fixture.debugElement.queryAll(By.css('.rounded-full'));
    expect(initialElements.length).toBe(0);
  });

  it('should render task with assignee avatar', () => {
    fixture.componentRef.setInput('task', { 
      id: '1', title: 'Task 1', 
      assignee: { id: 'u1', name: 'John', avatar_url: 'http://example.com/avatar.png' }
    });
    fixture.detectChanges();
    
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toBe('http://example.com/avatar.png');
  });

  it('should render task with assignee initials', () => {
    fixture.componentRef.setInput('task', { 
      id: '1', title: 'Task 1', 
      assignee: { id: 'u1', name: 'Artik', avatar_url: null }
    });
    fixture.detectChanges();
    
    const initials = fixture.debugElement.query(By.css('.bg-indigo-600.rounded-full'));
    expect(initials).toBeTruthy();
    expect(initials.nativeElement.textContent.trim()).toBe('A');
  });

  it('should emit taskClicked on click without drag', () => {
    fixture.componentRef.setInput('task', { id: '1', title: 'T' });
    fixture.detectChanges();
    
    const spy = vi.spyOn(component.taskClicked, 'emit');
    
    // Simulate mousedown
    component.onMouseDown({ clientX: 100, clientY: 100 } as MouseEvent);
    
    // Simulate mouseup/click (no drag)
    component.onClick({ clientX: 102, clientY: 102 } as MouseEvent);
    
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit taskClicked on click with drag', () => {
    fixture.componentRef.setInput('task', { id: '1', title: 'T' });
    fixture.detectChanges();
    
    const spy = vi.spyOn(component.taskClicked, 'emit');
    
    // Simulate mousedown
    component.onMouseDown({ clientX: 100, clientY: 100 } as MouseEvent);
    
    // Simulate mouseup/click (with drag)
    component.onClick({ clientX: 150, clientY: 120 } as MouseEvent);
    
    expect(spy).not.toHaveBeenCalled();
  });
});
