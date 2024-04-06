import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KanbanColumnComponent} from './kanban-column.component';
import {KanbanCardComponent} from '../kanban-card/kanban-card.component';
import {StatusCircleComponent} from '../status-circle/status-circle.component';
import {ITask} from '../../models/tasks_models';
import {CdkDrag, CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';
import {importProvidersFrom, input, signal} from '@angular/core';
import {Store, StoreModule} from '@ngrx/store';
import {reducers} from '../../store/reducers';

describe('KanbanColumnComponent', () => {
	const subtasks = [
		{
			title: 'subtast 1',
			status: 'ToDo',
		},
	];
	const tasks: ITask[] = [
		{
			id: '1',
			title: 'Task 1',
			description: 'Description 1',
			status: 'ToDo',
			subtasks,
		},
		{
			id: '2',
			title: 'Task 2',
			description: 'Description 2',
			status: 'ToDo',
			subtasks,
		},
	];

	let component: KanbanColumnComponent;
	let fixture: ComponentFixture<KanbanColumnComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				KanbanColumnComponent,
				KanbanCardComponent,
				StatusCircleComponent,
				CdkDrag,
				CdkDropList,
				StoreModule.forRoot(reducers),
			],
			providers: [importProvidersFrom(Store)],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(KanbanColumnComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should set columnType and tasks input properties', () => {
		const columnType = 'test-column';

		component.columnType = signal(columnType) as any;
		component.tasks = signal(tasks) as any;
		fixture.detectChanges();
		expect(component.columnType).toEqual(columnType);
		expect(component.tasks).toEqual(tasks);
	});

	it('should render the columnType and tasks in the template', () => {
		const columnType = 'test-column';
		component.columnType = signal(columnType) as any;
		component.tasks = signal(tasks) as any;
		fixture.detectChanges();
		const compiled = fixture.nativeElement;
		expect(
			compiled.querySelector('[data-testid="column-type"]').textContent,
		).toContain(columnType);
		expect(compiled.querySelectorAll('kanban-card').length).toEqual(
			tasks.length,
		);
	});
});
