import {Component} from '@angular/core';
import {KanbanColumnComponent} from '../common/kanban-column/kanban-column.component';

@Component({
	selector: 'kanban-board',
	standalone: true,
	imports: [KanbanColumnComponent],
	templateUrl: './kanban-board.component.html',
	styleUrl: './kanban-board.component.scss',
})
export class KanbanBoardComponent {}
