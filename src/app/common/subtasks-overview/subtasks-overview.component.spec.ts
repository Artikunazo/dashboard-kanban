import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtasksOverviewComponent } from './subtasks-overview.component';

describe('SubtasksOverviewComponent', () => {
  let component: SubtasksOverviewComponent;
  let fixture: ComponentFixture<SubtasksOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubtasksOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubtasksOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
