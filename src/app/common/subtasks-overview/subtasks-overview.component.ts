import {Component, input} from '@angular/core';
import {ISubtasks} from 'src/app/models/tasks_models';

@Component({
	selector: 'subtasks-overview',
	standalone: true,
	imports: [],
	templateUrl: './subtasks-overview.component.html',
	styleUrl: './subtasks-overview.component.scss',
})
export class SubtasksOverviewComponent {
	public subtask = input<ISubtasks>();
}
