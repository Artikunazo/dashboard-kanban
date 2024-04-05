import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskOverviewComponent} from './task-overview.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SubtasksOverviewComponent} from '../common/subtasks-overview/subtasks-overview.component';
import {Store, StoreModule} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromTaskReducer from '../store/reducers/tasks_reducer';
import {ITask} from '../models/tasks_models';

describe('TaskOverviewComponent', () => {
	let component: TaskOverviewComponent;
	let fixture: ComponentFixture<TaskOverviewComponent>;
	let store: Store;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatSelectModule,
				MatFormFieldModule,
				FormsModule,
				ReactiveFormsModule,
				StoreModule.forRoot({}),
				StoreModule.forFeature('tasks', fromTaskReducer.reducer),
				TaskOverviewComponent,
				SubtasksOverviewComponent,
			],
			providers: [
				{provide: MAT_DIALOG_DATA, useValue: {}},
				{provide: MatDialogRef, useValue: {}},
				{provide: Store, useValue: {}},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TaskOverviewComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(Store);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set task and statusSelected input properties', () => {
		const task = {
			id: 1,
			name: 'Test Task',
			description: 'Test Description',
			status: 'ToDo',
		};
		const statusSelected = new FormControl(task.status);
		component.task = task;
		component.statusSelected = statusSelected;
		fixture.detectChanges();
		expect(component.task).toEqual(task);
		expect(component.statusSelected).toEqual(statusSelected);
	});

	it('should dispatch UpdateTask action when statusSelected valueChanges is called', () => {
		const subtasks = [
			{
				title: 'subtast 1',
				status: 'ToDo',
			},
		];
		const task: ITask = {
			id: '1',
			title: 'Test Task',
			description: 'Test Description',
			status: 'ToDo',
			subtasks,
		};
		const statusSelected = new FormControl(task.status);
		component.task = task;
		component.statusSelected = statusSelected;
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		statusSelected.setValue('Doing');
		expect(dispatchSpy).toHaveBeenCalledWith(
			new fromStore.UpdateTask({...task, status: 'Doing'}),
		);
	});

	it('should update task subtasks when subtaskUpdated is called', () => {
		const task = {
			id: 1,
			name: 'Test Task',
			description: 'Test Description',
			status: 'ToDo',
			subtasks: [{title: 'Test Subtask', status: 'ToDo'}],
		};
		component.task = task;
		const event = {title: 'Updated Test Subtask', status: 'Done', index: 0};
		component.subtaskUpdated(event);
		expect(component.task.subtasks[0]).toEqual(event);
	});
});
