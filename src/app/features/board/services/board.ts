import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase';
import { BoardData } from '../models/board.models';

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
}