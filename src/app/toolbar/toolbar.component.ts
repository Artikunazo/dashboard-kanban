import {Component, inject, output} from '@angular/core';
import {MaterialModule} from '../material/material.module';
import {CustomButtonComponent} from '../common/custom-button/custom-button.component';
import {MatDialog} from '@angular/material/dialog';
import {TaskFormComponent} from '../task-form/task-form.component';

@Component({
	selector: 'toolbar',
	standalone: true,
	imports: [MaterialModule, CustomButtonComponent],
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
	public openNav = output();

	protected readonly dialog = inject(MatDialog);

	public title = 'Kanban';
	public subtitle = 'Platform Launch';

	openTaskFormModal() {
		const dialogRef = this.dialog.open(TaskFormComponent, {
			width: '65%',
			maxHeight: '90vh',
		});

		dialogRef.afterClosed().subscribe((result) => {});
	}
}
