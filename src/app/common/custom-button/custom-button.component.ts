import {Component, input, output} from '@angular/core';
import {MaterialModule} from '../../material/material.module';
import {CustomIconDirective} from '../custom-icon.directive';

@Component({
	selector: 'custom-button',
	standalone: true,
	imports: [MaterialModule, CustomIconDirective],
	templateUrl: './custom-button.component.html',
	styleUrl: './custom-button.component.scss',
})
export class CustomButtonComponent {
	public text = input();
	public colorButton = input('');
	public iconName = input();

	public clickEvent = output();
}
