import {Component, input} from '@angular/core';
import {TaskStatus} from '../../models/tasks_models';
import {MatIconModule} from '@angular/material/icon';
import {CustomIconDirective} from '../custom-icon.directive';

@Component({
	selector: 'status-circle',
	standalone: true,
	imports: [MatIconModule, CustomIconDirective],
	templateUrl: './status-circle.component.html',
	styleUrl: './status-circle.component.scss',
})
export class StatusCircleComponent {
	public columnTypes = TaskStatus;
	public columnStatus = input<TaskStatus | string>(TaskStatus.ToDo);
}
