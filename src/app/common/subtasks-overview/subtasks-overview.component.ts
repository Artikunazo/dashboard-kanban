import {Component, input, output} from '@angular/core';
import {ISubtask} from 'src/app/models/tasks_models';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SubtaskDoneDirective} from '../subtask-done.directive';

@Component({
	selector: 'subtasks-overview',
	standalone: true,
	imports: [MatCheckboxModule, SubtaskDoneDirective],
	templateUrl: './subtasks-overview.component.html',
	styleUrl: './subtasks-overview.component.scss',
})
export class SubtasksOverviewComponent {
	public subtask = input<ISubtask>();
	public index = input<number>();
	public subtaskUpdated = output<{}>();

	public newSubtask!: ISubtask;

	changed(checked: boolean) {
		this.newSubtask = {
			title: this.subtask()?.title,
			status: checked ? 'Done' : 'ToDo',
			index: this.index(),
		};
		this.subtaskUpdated.emit(this.newSubtask);
	}
}
