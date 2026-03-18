import { BoardData } from '../../models/board.models';

export abstract class BoardRepository {
  abstract getFullBoard(boardId: string): Promise<BoardData | null>;
  abstract getBoardDetails(boardId: string): Promise<any | null>;
  abstract updateBoardTitle(boardId: string, newTitle: string): Promise<boolean>;
  abstract deleteBoard(boardId: string): Promise<boolean>;
  abstract createBoardWithDefaults(title?: string): Promise<string | null>;
  abstract getAllUserBoards(): Promise<{ id: string; title: string }[]>;
}
