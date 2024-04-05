import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
	selector: '[customIcon]',
	standalone: true,
})
export class CustomIconDirective implements OnInit {
	@Input() public customIcon: string = 'medium';

	constructor(private el: ElementRef) {}

	ngOnInit(): void {
		this.el.nativeElement.classList.add(this.customIcon);
	}
}
