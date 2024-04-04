import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {ITask} from '../models/tasks_models';
import * as fromTasksActions from '../store/actions/tasks_actions';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	constructor() {}

	saveData(data: ITask) {
		const kanbanData = JSON.parse(
			this.loadDataWithoutObservable() ?? JSON.stringify([]),
		);
		const newKanbanData = [...kanbanData, data];
		debugger;
		localStorage.setItem('kanban', JSON.stringify(newKanbanData));
	}

	loadData() {
		return of(localStorage.getItem('kanban'));
	}

	loadDataWithoutObservable() {
		return localStorage.getItem('kanban');
	}

	updateAndSave(data: ITask) {
		const kanbanData = JSON.parse(
			this.loadDataWithoutObservable() ?? JSON.stringify([]),
		);
		const indexToUpdate = kanbanData.findIndex(
			(el: ITask) => el.id === data.id,
		);

		kanbanData[indexToUpdate] = data;
		localStorage.setItem('kanban', JSON.stringify(kanbanData));
	}
}
