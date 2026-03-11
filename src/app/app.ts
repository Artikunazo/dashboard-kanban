import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase';
import { BoardComponent } from './features/board/board';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private supabaseService = inject(SupabaseService);

  // Creamos un estado reactivo para guardar el ID
  activeBoardId = signal<string | null>(null);

  async ngOnInit() {
    const user = await this.supabaseService.initializeAnonymousSession();

    if (user) {
      // Pedimos el tablero
      const boardId = await this.supabaseService.createDemoBoard(user.id);

      if (boardId) {
        // En cuanto tenemos el ID, actualizamos el Signal.
        // Esto le avisará al HTML que ya puede pintar el componente del Kanban.
        this.activeBoardId.set(boardId);
      }
    }
  }
}