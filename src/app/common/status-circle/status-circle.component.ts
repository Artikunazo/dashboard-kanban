import {Component, input} from '@angular/core';
import {TaskStatus} from 'src/app/models/tasks_models';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'status-circle',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './status-circle.component.html',
	styleUrl: './status-circle.component.scss',
})
export class StatusCircleComponent {
	public columnTypes = TaskStatus;
	public columnStatus = input();
}
