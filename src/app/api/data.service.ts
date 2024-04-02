import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class DataService {
	constructor() {}

	saveData(data: string) {
		localStorage.setItem('kanban', JSON.stringify(data));
	}

	loadData() {
		return of(localStorage.getItem('kanban'));
	}
}
