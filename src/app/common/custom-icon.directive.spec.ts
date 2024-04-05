// Necessary imports for the test
import {Component, input} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {CustomIconDirective} from './custom-icon.directive';

@Component({
	template: `<div [customIcon]="icon"></div>`,
})
class TestComponent {
	icon = 'test-icon';
}

describe('CustomIconDirective', () => {
	let fixture: any, component: CustomIconDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent, CustomIconDirective],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an instance of the directive', () => {
		const directiveEl = fixture.debugElement.nativeElement.querySelector('div');
		expect(directiveEl).not.toBeNull();
	});

	it('should add the correct class to the element', () => {
		const directiveEl = fixture.debugElement.nativeElement.querySelector('div');
		expect(directiveEl.classList).toContain('test-icon');
	});

	it('should update the class when the input changes', () => {
		const directiveEl = fixture.debugElement.nativeElement.querySelector('div');
		component.customIcon = input('updated-icon');
		fixture.detectChanges();
		expect(directiveEl.classList).toContain('updated-icon');
		expect(directiveEl.classList).not.toContain('test-icon');
	});

	it('should handle empty input', () => {
		component.customIcon = input('');
		fixture.detectChanges();
		const directiveEl = fixture.debugElement.nativeElement.querySelector('div');
		expect(directiveEl.classList).toContain('updated-icon');
	});
});
