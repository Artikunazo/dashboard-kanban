import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StatusCircleComponent} from './status-circle.component';
// import {TaskStatus} from 'src/app/models/tasks_models';
import {MatIconModule} from '@angular/material/icon';
import {CustomIconDirective} from '../custom-icon.directive';
// import {input} from '@angular/core';

describe('StatusCircleComponent', () => {
	let component: StatusCircleComponent;
	let fixture: ComponentFixture<StatusCircleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, StatusCircleComponent, CustomIconDirective],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(StatusCircleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// it('should set columnTypes and columnStatus input properties', () => {
	// 	const columnStatus = TaskStatus.ToDo;
	// 	component.columnStatus = input(columnStatus);
	// 	fixture.detectChanges();
	// 	expect(component.columnStatus).toEqual(columnStatus);
	// });

	// it('should render the columnStatus in the template', () => {
	// 	const columnStatus = TaskStatus.Doing;
	// 	component.columnStatus = input(columnStatus);
	// 	fixture.detectChanges();
	// 	const compiled = fixture.nativeElement;
	// 	expect(compiled.querySelector('mat-icon').textContent).toContain(
	// 		columnStatus,
	// 	);
	// });
});
