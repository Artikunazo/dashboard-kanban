import { HttpClient } from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {CONTEXT_PATH, URL_BASE} from '../common/constants';
import {ApiTask} from '../models/tasks_models';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	protected readonly httpClient = inject(HttpClient);

	private readonly URL = `${URL_BASE}${CONTEXT_PATH}task/`;

	getTasksByBoard(idBoard: number): Observable<ApiTask[]> {
		return this.httpClient.get<ApiTask[]>(`${this.URL}all/${idBoard}`);
	}

	getTaskById(idTask: number): Observable<ApiTask> {
		return this.httpClient.get<ApiTask>(`${this.URL}${idTask}`);
	}

	save(task: ApiTask): Observable<ApiTask> {
		return this.httpClient.post<ApiTask>(`${this.URL}save`, task);
	}

	add(task: ApiTask): Observable<ApiTask> {
		return this.httpClient.post<ApiTask>(`${this.URL}save`, task);
	}

	update(task: ApiTask): Observable<boolean> {
		return this.httpClient.put<boolean>(`${this.URL}update`, task);
	}

	delete(idTask: string | number): Observable<any> {
		return this.httpClient.delete<any>(`${this.URL}delete/${idTask}`);
	}

	updateStatus(task: ApiTask): Observable<boolean> {
		return this.httpClient.put<boolean>(`${this.URL}update-status`, task);
	}
}
