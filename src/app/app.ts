import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase';
import { BoardComponent } from './features/board/board';

const BOARD_STORAGE_KEY = 'active_board_id';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private supabaseService = inject(SupabaseService);

  activeBoardId = signal<string | null>(null);

  async ngOnInit() {
    const user = await this.supabaseService.initializeAnonymousSession();

    if (user) {
      // 1. Try to restore the last active board from localStorage
      const savedBoardId = localStorage.getItem(BOARD_STORAGE_KEY);

      let boardId: string | null = savedBoardId;

      if (!boardId) {
        // 2. No saved board — check if the user already has one in the DB
        boardId = await this.supabaseService.getUserBoard(user.id);

        if (boardId) {
          console.log('Board recovered from database:', boardId);
        } else {
          // 3. First visit — create a demo board
          console.log('New user, creating demo board...');
          boardId = await this.supabaseService.createDemoBoard(user.id);
        }
      } else {
        console.log('Board restored from localStorage:', boardId);
      }

      if (boardId) {
        this.activeBoardId.set(boardId);
        localStorage.setItem(BOARD_STORAGE_KEY, boardId);
      }
    }
  }

  onBoardChanged(boardId: string) {
    this.activeBoardId.set(boardId);
    localStorage.setItem(BOARD_STORAGE_KEY, boardId);
  }
}