import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase';
import { BoardData, Task } from '../models/board.models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private supabase = inject(SupabaseService).client;

  async getFullBoard(boardId: string): Promise<BoardData | null> {
    try {
      console.log('Fetching columns and tasks for board:', boardId);

      const { data: columns, error: colError } = await this.supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

      if (colError) throw colError;

      const columnIds = columns.map(column => column.id);
      const { data: tasks, error: taskError } = await this.supabase
        .from('tasks')
        .select('*')
        .in('column_id', columnIds)
        .order('position', { ascending: true });

      if (taskError) throw taskError;

      return {
        columns: columns || [],
        tasks: tasks || []
      };

    } catch (error) {
      console.error('Error fetching board data:', error);
      return null;
    }
  }

  async updateTaskPosition(task: Task): Promise<boolean> {
    try {
      // Hacemos un UPDATE directo a la tabla tasks
      const { error } = await this.supabase
        .from('tasks')
        .update({
          column_id: task.column_id,
          position: task.position
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
      const { error } = await this.supabase
        .from('tasks')
        .upsert(tasks);

      if (error) throw error;
      return true;

    } catch (error) {
      console.error('Error en la actualización masiva:', error);
      return false;
    }
  }
}