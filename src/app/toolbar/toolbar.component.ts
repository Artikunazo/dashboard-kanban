import {Component} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';

@Component({
	selector: 'toolbar',
	standalone: true,
	imports: [MaterialModule, CustomButtonComponent],
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
	public title = 'Kanban';
	public subtitle = 'Platform Launch';
}
