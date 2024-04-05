import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SubtasksOverviewComponent} from './subtasks-overview.component';
import {ISubtask} from '../../models/tasks_models';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SubtaskDoneDirective} from '../subtask-done.directive';
import {input} from '@angular/core';

describe('SubtasksOverviewComponent', () => {
	let component: SubtasksOverviewComponent;
	let fixture: ComponentFixture<SubtasksOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatCheckboxModule,
				SubtasksOverviewComponent,
				SubtaskDoneDirective,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubtasksOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set subtask and index input properties', () => {
		const subtask: ISubtask = {title: 'Test Subtask', status: 'ToDo', index: 0};
		const index = 1;
		component.subtask = input(subtask);
		component.index = input(index);
		fixture.detectChanges();
		expect(component.subtask).toEqual(subtask);
		expect(component.index).toEqual(index);
	});

	it('should emit subtaskUpdated output event when changed method is called', () => {
		const subtask: ISubtask = {title: 'Test Subtask', status: 'ToDo', index: 0};
		const index = 1;
		component.subtask = input(subtask);
		component.index = input(index);
		const subtaskUpdatedSpy = jest.spyOn(component.subtaskUpdated, 'emit');
		component.changed(true);
		expect(subtaskUpdatedSpy).toHaveBeenCalledWith({
			title: subtask.title,
			status: 'Done',
			index: index,
		});
	});
});
