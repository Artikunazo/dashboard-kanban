import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KanbanCardComponent} from './kanban-card.component';
import {
	MatDialogModule,
	MatDialogRef,
	MatDialog,
} from '@angular/material/dialog';
import {Store, StoreModule} from '@ngrx/store';
import {ITask} from '../../models/tasks_models';
import {TaskOverviewComponent} from '../../task-overview/task-overview.component';
import * as fromStore from '../../store';
import * as fromTaskReducer from '../../../app/store/reducers/tasks_reducer';

describe('KanbanCardComponent', () => {
	let component: KanbanCardComponent;
	let fixture: ComponentFixture<KanbanCardComponent>;
	let store: Store;
	let matDialog: MatDialog;
	let matDialogRef: MatDialogRef<TaskOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MatDialogModule,
				StoreModule.forRoot({}),
				StoreModule.forFeature('tasks', fromTaskReducer.reducer),
				KanbanCardComponent,
				TaskOverviewComponent,
			],
			providers: [{provide: MatDialogRef, useValue: {}}],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(KanbanCardComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(Store);
		matDialog = TestBed.inject(MatDialog);
		matDialogRef = TestBed.inject(MatDialogRef);
		jest.spyOn(matDialog, 'open');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should dispatch LoadTasks action when TaskOverviewComponent is closed', () => {
		const subtasks = [
			{
				title: 'subtast 1',
				status: 'ToDo',
			},
		];
		const taskData: ITask = {
			id: '1',
			title: 'Test Task',
			description: 'test',
			subtasks,
			status: 'ToDo',
		};
		component.openTaskOverviewModal(taskData);
		matDialogRef.close();
		expect(store.dispatch).toHaveBeenCalledWith(new fromStore.LoadTasks());
	});

	it('should not dispatch LoadTasks action when TaskOverviewComponent is closed with no task data', () => {
		component.openTaskOverviewModal(undefined);
		matDialogRef.close();
		expect(store.dispatch).not.toHaveBeenCalled();
	});
});
