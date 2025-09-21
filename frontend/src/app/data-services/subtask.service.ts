import { HttpClient } from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable} from 'rxjs';
import {CONTEXT_PATH, URL_BASE} from '../common/constants';
import {ApiSubtask, Subtask} from '../models/subtask_models';

@Injectable({
	providedIn: 'root',
})
export class SubtaskService {
	protected readonly httpClient = inject(HttpClient);

	private readonly URL = `${URL_BASE}${CONTEXT_PATH}subtask/`;

	getSubtaskByIdTask(idTask: string | number): Observable<ApiSubtask[]> {
		return this.httpClient.get<ApiSubtask[]>(`${this.URL}all/${idTask}`);
	}

	save(subtask: ApiSubtask): Observable<Subtask> {
		return this.httpClient.post<Subtask>(`${this.URL}save`, subtask);
	}

	delete(idSubtask: number): Observable<any> {
		return this.httpClient.delete<any>(`${this.URL}delete/${idSubtask}`);
	}

	update(subtask: ApiSubtask): Observable<ApiSubtask> {
		return this.httpClient.put<ApiSubtask>(`${this.URL}update`, subtask);
	}
}
