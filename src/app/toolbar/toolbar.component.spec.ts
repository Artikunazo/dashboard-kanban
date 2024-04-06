import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ToolbarComponent} from './toolbar.component';
import {MaterialModule} from '../material/material.module';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';
import {Store, StoreModule} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromTaskReducer from '../store/reducers/tasks_reducer';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';

describe('ToolbarComponent', () => {
	let component: ToolbarComponent;
	let fixture: ComponentFixture<ToolbarComponent>;
	let store: Store;
	let matDialog: MatDialog;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				MaterialModule,
				StoreModule.forRoot({}),
				StoreModule.forFeature('tasks', fromTaskReducer.reducer),
				ToolbarComponent,
				CustomButtonComponent,
				BrowserAnimationsModule,
			],
			providers: [
				{
					provide: MatDialog,
					useValue: jest.fn().mockImplementation(() => ({
						open: jest.fn(),
					})),
				},
				{
					provide: Store,
					useValue: jest.fn().mockImplementation(() => ({
						dispatch: jest.fn(),
					})),
				},
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ToolbarComponent);
		component = fixture.componentInstance;
		store = TestBed.inject(Store);
		matDialog = TestBed.inject(MatDialog);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should open TaskFormComponent when openTaskFormModal is called', () => {
		const dialogOpenSpy = spyOn(matDialog, 'open').and.returnValue({
			open: () => jest.fn(),
		});
		component.openTaskFormModal();
		expect(dialogOpenSpy).toHaveBeenCalledWith(TaskFormComponent, {
			width: '65%',
			maxHeight: '90vh',
		});
	});

	// it('should dispatch LoadTasks action when TaskFormComponent is closed', () => {
	// 	const dialogCloseSpy = jest.spyOn(
	// 		matDialog.open..mostRecent().returnValue,
	// 		'afterClosed',
	// 	);
	// 	dialogCloseSpy.and.returnValue(Promise.resolve());
	// 	component.openTaskFormModal();
	// 	expect(store.dispatch).toHaveBeenCalledWith(new fromStore.LoadTasks());
	// });
});
