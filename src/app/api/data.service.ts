import {Injectable} from '@angular/core';
import {of} from 'rxjs';
import {ITask} from '../models/tasks_models';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	constructor() {}

	saveData(data: ITask) {
		localStorage.setItem('kanban', JSON.stringify(data));
	}

	loadData() {
		return of(localStorage.getItem('kanban'));
	}
}
