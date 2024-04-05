import {
	Directive,
	ElementRef,
	OnChanges,
	SimpleChanges,
	input,
} from '@angular/core';

@Directive({
	selector: '[subtaskDone]',
	standalone: true,
})
export class SubtaskDoneDirective implements OnChanges {
	public subtaskDone = input<string>('');

	constructor(private el: ElementRef) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes) {
			if (changes['subtaskDone'].currentValue === 'Done') {
				this.el.nativeElement.classList.add('markedDone');
			} else {
				this.el.nativeElement.classList.remove('markedDone');
			}
		}
	}
}
