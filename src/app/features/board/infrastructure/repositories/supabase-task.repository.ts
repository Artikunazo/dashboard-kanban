import {Injectable, inject} from '@angular/core';
import {TaskRepository} from '../../domain/repositories/task.repository';
import {SupabaseService} from '../../../../core/services/supabase';
import {Task} from '../../models/board.models';

/** Supabase implementation of {@link TaskRepository}. */
@Injectable({
	providedIn: 'root',
})
export class SupabaseTaskRepository implements TaskRepository {
	private supabase = inject(SupabaseService).client;

	async updateTaskPosition(task: Task): Promise<boolean> {
		try {
			const {error} = await this.supabase
				.from('tasks')
				.update({
					column_id: task.column_id,
					position: task.position,
				})
				.eq('id', task.id);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error updating task in Supabase:', error);
			return false;
		}
	}

	/**
	 * Strips `assignee` (a joined field, not a real DB column) before upserting
	 * to prevent Supabase PGRST204 ("column does not exist") errors.
	 */
	async updateTasksBulk(tasks: Task[]): Promise<boolean> {
		if (tasks.length === 0) return true;

		try {
			// Remove joined properties before upserting since Supabase will throw PGRST204
			// because 'assignee' is not an actual column in the 'tasks' table.
			const tasksToUpdate = tasks.map(({assignee, ...rest}) => rest);

			const {error} = await this.supabase.from('tasks').upsert(tasksToUpdate);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error in bulk update:', error);
			return false;
		}
	}

	async createTask(taskData: Partial<Task>): Promise<Task | null> {
		try {
			const {data, error} = await this.supabase
				.from('tasks')
				.insert([taskData])
				.select()
				.maybeSingle();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error creating task:', error);
			return null;
		}
	}

	async updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
		try {
			const {error} = await this.supabase
				.from('tasks')
				.update(updates)
				.eq('id', taskId);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error updating task:', error);
			return false;
		}
	}

	async deleteTask(taskId: string): Promise<boolean> {
		try {
			const {error} = await this.supabase
				.from('tasks')
				.delete()
				.eq('id', taskId);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error deleting task:', error);
			return false;
		}
	}
}
