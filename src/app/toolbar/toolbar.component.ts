import {Component, inject, output} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';

@Component({
	selector: 'toolbar',
	standalone: true,
	imports: [MaterialModule, CustomButtonComponent],
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
	public openNav = output();

	public title = 'Kanban';
	public subtitle = 'Platform Launch';

	constructor(
		private readonly dialog: MatDialog,
		private readonly store: Store,
	) {}

	openTaskFormModal() {
		const dialogRef = this.dialog.open(TaskFormComponent, {
			width: '65%',
			maxHeight: '90vh',
		});

		dialogRef.afterClosed().subscribe(() => {
			this.store.dispatch(new fromStore.LoadTasks());
		});
	}
}
