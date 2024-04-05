import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {ITask} from '../models/tasks_models';
import * as fromTasksActions from '../store/actions/tasks_actions';
import * as uuid from 'uuid';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	protected readonly defaultTasks: ITask[] = [
		{
			title: 'Tarea 1',
			description:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque aspernatur debitis magni, doloribus et quod quibusdam! Laborum ipsum officiis reprehenderit molestiae mollitia, tempore optio beatae qui ex, quae veniam asperiores!',
			subtasks: [
				{
					title: 'SubTask 1',
					status: 'ToDo',
				},
			],
			status: 'ToDo',
			id: uuid.v4(),
		},
		{
			title: 'Tarea 2',
			description:
				'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque aspernatur debitis magni, doloribus et quod quibusdam! Laborum ipsum officiis reprehenderit molestiae mollitia, tempore optio beatae qui ex, quae veniam asperiores!',
			subtasks: [
				{
					title: 'SubTask 1',
					status: 'ToDo',
				},
				{
					title: 'SubTask 2',
					status: 'ToDo',
				},
			],
			status: 'ToDo',
			id: uuid.v4(),
		},
	];
	constructor() {}

	saveData(data: ITask, key = 'kanban') {
		const kanbanData = JSON.parse(
			this.loadDataWithoutObservable() ?? JSON.stringify([]),
		);
		const newKanbanData = [...kanbanData, data];
		localStorage.setItem(key, JSON.stringify(newKanbanData));
	}

	loadData(key = 'kanban') {
		const data = localStorage.getItem(key);
		if (!data) {
			for (const task of this.defaultTasks) {
				this.saveData(task);
			}
		}
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
