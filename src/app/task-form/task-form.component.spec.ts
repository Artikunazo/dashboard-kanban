import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TaskFormComponent} from './task-form.component';
import {
	ReactiveFormsModule,
	Validators,
	FormBuilder,
	FormArray,
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';
import {Store, StoreModule} from '@ngrx/store';
import * as uuid from 'uuid';
import {MatDialogRef} from '@angular/material/dialog';
import * as fromStore from '../store';
import * as fromTaskReducer from '../store/reducers/tasks_reducer';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {reducers} from '../store/reducers';
import {importProvidersFrom} from '@angular/core';

describe('TaskFormComponent', () => {
	let component: TaskFormComponent;
	let fixture: ComponentFixture<TaskFormComponent>;
	let store: Store;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ReactiveFormsModule,
				MatFormFieldModule,
				MatInputModule,
				MatSelectModule,
				StoreModule.forRoot(reducers),
				TaskFormComponent,
				CustomButtonComponent,
				BrowserAnimationsModule,
			],
			providers: [
				{provide: FormBuilder, useValue: new FormBuilder()},
				{provide: MatDialogRef, useValue: {}},
				{provide: Store, useValue: {}},
				{provide: uuid, useValue: {}},
				importProvidersFrom(Store),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TaskFormComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(Store);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set taskForm input properties', () => {
		const title = 'Test Title';
		const description = 'Test Description';
		const subtasks = [
			{title: 'Test Subtask 1', status: 'ToDo'},
			{title: 'Test Subtask 2', status: 'Doing'},
		];
		const status = 'Done';
		component.taskForm.setValue({title, description, subtasks, status});
		expect(component.taskForm.value).toEqual({
			title,
			description,
			subtasks,
			status,
		});
	});

	it('should add subtask when addSubtask is called', () => {
		const subtasksLength = component.subtasks.length;
		component.addSubtask();
		expect(component.subtasks.length).toEqual(subtasksLength + 1);
	});

	it('should dispatch AddTask action when createTask is called', () => {
		const title = 'Test Title';
		const description = 'Test Description';
		const subtasks = [
			{title: 'Test Subtask 1', status: 'ToDo'},
			{title: 'Test Subtask 2', status: 'Doing'},
		];
		const status = 'Done';
		const id = 'test-id';
		const dispatchSpy = jest.spyOn(store, 'dispatch');
		component.taskForm.setValue({title, description, subtasks, status});
		component.createTask();
		expect(dispatchSpy).toHaveBeenCalledWith(
			new fromStore.AddTask({title, description, subtasks, status, id}),
		);
	});
});
