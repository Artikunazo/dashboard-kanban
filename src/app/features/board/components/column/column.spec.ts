import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnComponent } from './column';
import { TaskCardComponent } from '../task-card/task-card';

describe('ColumnComponent', () => {
  let component: ColumnComponent;
  let fixture: ComponentFixture<ColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnComponent, TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnComponent);
    component = fixture.componentInstance;
    
    // Set required inputs
    fixture.componentRef.setInput('column', { id: 'col-1', title: 'To Do', board_id: 'board-1', position: 'a' });
    fixture.componentRef.setInput('tasks', [
      { id: '1', title: 'Task 1', column_id: 'col-1', position: 'a' }
    ]);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
