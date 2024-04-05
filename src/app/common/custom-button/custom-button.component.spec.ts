// Necessary imports for the test
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {CustomButtonComponent} from './custom-button.component'; // Adjust the import path as necessary
import {MaterialModule} from '../../material/material.module';
import {CustomIconDirective} from '../custom-icon.directive';
import {input, signal} from '@angular/core';

describe('CustomButtonComponent', () => {
	let component: CustomButtonComponent;
	let fixture: ComponentFixture<CustomButtonComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialModule, CustomButtonComponent, CustomIconDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(CustomButtonComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should display the correct text', () => {
		component.text = signal('Click!') as any;
		fixture.detectChanges();
		const buttonElement: HTMLElement = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		expect(buttonElement.textContent).toContain('Click Me!');
	});

	it('should apply the correct color', () => {
		component.colorButton = signal('primary') as any;
		fixture.detectChanges();
		const buttonElement: HTMLElement = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		expect(buttonElement.classList.contains('primary')).toBe(true);
	});

	it('should show the correct icon', () => {
		component.iconName = signal('add') as any;
		fixture.detectChanges();
		const iconElement: HTMLElement = fixture.debugElement.query(
			By.directive(CustomIconDirective),
		).nativeElement;
		console.log(iconElement);
		expect(iconElement.getAttribute('ng-reflect-icon')).toEqual('add');
	});

	it('should emit an event on click', () => {
		jest.spyOn(component.clickEvent, 'emit');
		const buttonElement = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		buttonElement.click();
		expect(component.clickEvent.emit).toHaveBeenCalled();
	});

	// Negative Case - Invalid color does not add unknown class
	it('should not apply an unknown color class', () => {
		const initialClasses = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		initialClasses.classList.add('mat-unknownColor', 'mat-mdc-button-base');

		component.colorButton = signal('unknownColor') as any;
		fixture.detectChanges();
		const buttonElement: HTMLElement = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		expect(buttonElement.className).toBe(initialClasses.className);
	});

	// Edge Case - Empty text
	it('should handle empty text', () => {
		component.text = signal('') as any;
		fixture.detectChanges();
		const buttonElement: HTMLElement = fixture.debugElement.query(
			By.css('button'),
		).nativeElement;
		expect(buttonElement.textContent).toBe(`  `);
	});

	// Edge Case - No icon provided
	it('should be able to handle when no icon is provided', () => {
		component.iconName = signal('') as any;
		fixture.detectChanges();
		const iconElement = fixture.debugElement.query(
			By.directive(CustomIconDirective),
		);
		expect(iconElement).toBeNull();
	});
});
