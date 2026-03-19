import { Injectable, inject } from '@angular/core';
import { BoardRepository } from '../../domain/repositories/board.repository';
import { SupabaseService } from '../../../../core/services/supabase';
import { BoardData } from '../../models/board.models';
import { LexoRank } from '@dalet-oss/lexorank';

@Injectable({
  providedIn: 'root'
})
export class SupabaseBoardRepository implements BoardRepository {
  private supabase = inject(SupabaseService).client;

  async getFullBoard(boardId: string): Promise<BoardData | null> {
    try {
      const { data: columns, error: colError } = await this.supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true });

      if (colError) throw colError;

      const columnIds = columns.map((column) => column.id);
      const { data: tasks, error: taskError } = await this.supabase
        .from('tasks')
        .select(
          `*, assignee:team_members (name, avatar_url)`
        )
        .in('column_id', columnIds)
        .order('position', { ascending: true });

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

  async getBoardDetails(boardId: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting board details:', error);
      return null;
    }
  }

  async updateBoardTitle(boardId: string, newTitle: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('boards')
        .update({ title: newTitle })
        .eq('id', boardId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating board title:', error);
      return false;
    }
  }

  async deleteBoard(boardId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
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

  async createBoardWithDefaults(title: string = 'New Project'): Promise<string | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const visitorId = session?.user?.id;

      if (!visitorId) throw new Error('No active session found');

      const { data: board, error: boardError } = await this.supabase
        .from('boards')
        .insert([{ visitor_id: visitorId, title }])
        .select('id')
        .single();

      if (boardError) throw boardError;

      const defaultColumns = [
        { board_id: board.id, title: 'To Do', position: LexoRank.middle().toString() },
        { board_id: board.id, title: 'In Progress', position: LexoRank.middle().genNext().toString() },
        { board_id: board.id, title: 'Done', position: LexoRank.middle().genNext().genNext().toString() },
      ];

      const { error: colsError } = await this.supabase
        .from('columns')
        .insert(defaultColumns);

      if (colsError) throw colsError;

      return board.id;
    } catch (error) {
      console.error('Error creating board with defaults:', error);
      return null;
    }
  }

  async getAllUserBoards(): Promise<{ id: string; title: string; }[]> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const visitorId = session?.user?.id;

      if (!visitorId) return [];

      const { data, error } = await this.supabase
        .from('boards')
        .select('id, title')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user boards:', error);
      return [];
    }
  }
}
