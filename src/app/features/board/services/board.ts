import {Injectable, inject} from '@angular/core';
import {SupabaseService} from '../../../core/services/supabase';
import {BoardData, Task} from '../models/board.models';

@Injectable({
	providedIn: 'root',
})
export class BoardService {
	private supabase = inject(SupabaseService).client;

	async getFullBoard(boardId: string): Promise<BoardData | null> {
		try {
			console.log('Fetching columns and tasks for board:', boardId);

			const {data: columns, error: colError} = await this.supabase
				.from('columns')
				.select('*')
				.eq('board_id', boardId)
				.order('position', {ascending: true});

			if (colError) throw colError;

			const columnIds = columns.map((column) => column.id);
			const {data: tasks, error: taskError} = await this.supabase
				.from('tasks')
				.select(
					`
      *,
      assignee:team_members (
        name,
        avatar_url
      )
    `,
				)
				.in('column_id', columnIds)
				.order('position', {ascending: true});

			if (taskError) throw taskError;

			return {
				columns: columns || [],
				tasks: tasks || [],
			};
		} catch (error) {
			console.error('Error fetching board data:', error);
			return null;
		}
	}

	async updateTaskPosition(task: Task): Promise<boolean> {
		try {
			// Hacemos un UPDATE directo a la tabla tasks
			const {error} = await this.supabase
				.from('tasks')
				.update({
					column_id: task.column_id,
					position: task.position,
				})
				.eq('id', task.id); // Buscamos la tarea por su ID único

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error al actualizar la tarea en Supabase:', error);
			return false;
		}
	}

	async updateTasksBulk(tasks: Task[]): Promise<boolean> {
		if (tasks.length === 0) return true;

		try {
			// Upsert recibe un arreglo completo y actualiza masivamente basándose en el ID
			const {error} = await this.supabase.from('tasks').upsert(tasks);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error en la actualización masiva:', error);
			return false;
		}
	}

	async createTask(taskData: Partial<Task>): Promise<Task | null> {
		try {
			const {data, error} = await this.supabase
				.from('tasks')
				.insert([taskData])
				.select() // Importante: pedimos que devuelva la tarea insertada
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error al crear la tarea:', error);
			return null;
		}
	}

	async getBoardDetails(boardId: string): Promise<any | null> {
		try {
			const {data, error} = await this.supabase
				.from('boards')
				.select('*')
				.eq('id', boardId)
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error obteniendo detalles del tablero:', error);
			return null;
		}
	}

	async updateBoardTitle(boardId: string, newTitle: string): Promise<boolean> {
		try {
			const {error} = await this.supabase
				.from('boards')
				.update({title: newTitle})
				.eq('id', boardId);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error updating board title:', error);
			return false;
		}
	}

	// Delete board (CASCADE will handle columns and tasks if configured in DB)
	async deleteBoard(boardId: string): Promise<boolean> {
		try {
			const {error} = await this.supabase
				.from('boards')
				.delete()
				.eq('id', boardId);

			if (error) throw error;
			return true;
		} catch (error) {
			console.error('Error deleting board:', error);
			return false;
		}
	}

	// Create a new board with default columns
	async createBoardWithDefaults(
		title: string = 'New Project',
	): Promise<string | null> {
		try {
			// 1. Obtenemos al visitante actual directamente de la sesión
			const {
				data: {session},
			} = await this.supabase.auth.getSession();
			const visitorId = session?.user?.id;

			if (!visitorId) throw new Error('No active session found');

			// 2. Creamos el tablero
			const {data: board, error: boardError} = await this.supabase
				.from('boards')
				.insert([{visitor_id: visitorId, title}])
				.select('id')
				.single();

			if (boardError) throw boardError;

			// 3. Preparamos las columnas por defecto en inglés
			const defaultColumns = [
				{board_id: board.id, title: 'To Do', position: 0},
				{board_id: board.id, title: 'In Progress', position: 1},
				{board_id: board.id, title: 'Done', position: 2},
			];

			// 4. Insertamos las columnas masivamente
			const {error: colsError} = await this.supabase
				.from('columns')
				.insert(defaultColumns);

			if (colsError) throw colsError;

			return board.id; // Devolvemos el ID del nuevo tablero listo para usarse
		} catch (error) {
			console.error('Error creating board with defaults:', error);
			return null;
		}
	}

	async getAllUserBoards(): Promise<{id: string; title: string}[]> {
		try {
			const {
				data: {session},
			} = await this.supabase.auth.getSession();
			const visitorId = session?.user?.id;

			if (!visitorId) return [];

			const {data, error} = await this.supabase
				.from('boards')
				.select('id, title')
				.eq('visitor_id', visitorId)
				.order('created_at', {ascending: false}); // Los más nuevos primero

			if (error) throw error;
			return data || [];
		} catch (error) {
			console.error('Error fetching user boards:', error);
			return [];
		}
	}
}
