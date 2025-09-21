import {Component, effect, inject, input, model, OnInit, output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SubtaskDoneDirective} from '../../common/subtask-done.directive';
import {Subtask} from '../../models/subtask_models';
import {CheckboxModule} from 'primeng/checkbox';
import * as fromStore from '../../store';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'subtasks-overview',
	standalone: true,
	imports: [SubtaskDoneDirective, FormsModule, CheckboxModule],
	templateUrl: './subtasks-overview.component.html',
	styleUrl: './subtasks-overview.component.scss',
})
export class SubtasksOverviewComponent {
	private readonly store = inject(Store);

	public subtask = input.required<Subtask>();

	constructor() {
		effect(() => {
			// console.log('Subtask changed:', this.subtask());
			this.store.dispatch(new fromStore.UpdateSubtask({...this.subtask()}));
		});
	}

	changed(checked: boolean) {
		// const subtaskUpdated = {...this.subtask(), status: checked};
		// this.subtask.set(subtaskUpdated);
	}
}
