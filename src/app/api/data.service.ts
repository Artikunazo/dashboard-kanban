import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {ITask} from '../models/tasks_models';
import * as fromTasksActions from '../store/actions/tasks_actions';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	constructor() {}

	saveData(data: ITask, key = 'kanban') {
		const kanbanData = JSON.parse(
			this.loadDataWithoutObservable() ?? JSON.stringify([]),
		);
		const newKanbanData = [...kanbanData, data];
		localStorage.setItem(key, JSON.stringify(newKanbanData));
	}

	loadData(key = 'kanban') {
		return of(localStorage.getItem(key));
	}

	loadDataWithoutObservable(key = 'kanban') {
		return localStorage.getItem(key);
	}

	updateAndSave(data: ITask, key = 'kanban') {
		const kanbanData = JSON.parse(
			this.loadDataWithoutObservable() ?? JSON.stringify([]),
		);
		const indexToUpdate = kanbanData.findIndex(
			(el: ITask) => el.id === data.id,
		);

		kanbanData[indexToUpdate] = data;
		localStorage.setItem(key, JSON.stringify(kanbanData));
	}

	saveTheme(themeName: string, key = 'theme') {
		localStorage.setItem(key, themeName);
	}

	getTheme(key = 'theme') {
		return of(localStorage.getItem(key));
	}
}
