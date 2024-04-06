import {SubtaskDoneDirective} from './subtask-done.directive';
import {ElementRef, input} from '@angular/core';

describe('SubtaskDoneDirective', () => {
	let directive: SubtaskDoneDirective;
	let elementRefMock: Partial<ElementRef>;

	beforeEach(() => {
		elementRefMock = {
			nativeElement: document.createElement('div'),
		};
		directive = new SubtaskDoneDirective(elementRefMock as ElementRef);
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	it('should add "markedDone" class when subtaskDone is "Done"', () => {
		directive.subtaskDone = 'Done';
		directive.ngOnChanges({
			subtaskDone: {
				currentValue: 'Done',
				previousValue: '',
				isFirstChange: () => false,
				firstChange: false,
			},
		});

		expect(elementRefMock.nativeElement.classList.contains('markedDone')).toBe(
			true,
		);
	});

	it('should remove "markedDone" class when subtaskDone is not "Done"', () => {
		directive.subtaskDone = 'Done';
		directive.ngOnChanges({
			subtaskDone: {
				currentValue: 'Done',
				previousValue: '',
				isFirstChange: () => false,
				firstChange: false,
			},
		});

		directive.ngOnChanges({
			subtaskDone: {
				currentValue: 'Not Done',
				previousValue: 'Done',
				isFirstChange: () => false,
				firstChange: false,
			},
		});

		expect(elementRefMock.nativeElement.classList.contains('markedDone')).toBe(
			false,
		);
	});

	it('should not add "markedDone" class when subtaskDone is undefined', () => {
		directive.ngOnChanges({
			subtaskDone: {
				currentValue: undefined,
				previousValue: 'Done',
				isFirstChange: () => false,
				firstChange: false,
			},
		});

		expect(elementRefMock.nativeElement.classList.contains('markedDone')).toBe(
			false,
		);
	});

	it('should handle ngOnChanges without subtaskDone property', () => {
		directive.ngOnChanges({
			subtaskDone: {
				previousValue: '',
				currentValue: '',
				firstChange: false,
				isFirstChange: () => false,
			},
		});
		expect(elementRefMock.nativeElement.classList.contains('markedDone')).toBe(
			false,
		);
	});
});
