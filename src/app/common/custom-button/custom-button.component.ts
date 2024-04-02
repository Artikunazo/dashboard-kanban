import {Component, input} from '@angular/core';
import {MaterialModule} from '../../material/material.module';

@Component({
	selector: 'custom-button',
	standalone: true,
	imports: [MaterialModule],
	templateUrl: './custom-button.component.html',
	styleUrl: './custom-button.component.scss',
})
export class CustomButtonComponent {
	text = input('No text defined');
	colorButton = input('primary');
}
