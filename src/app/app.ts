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

  activeBoardId = signal<string | null>(null);

  async ngOnInit() {
    // 1. Obtenemos al visitante (Supabase se encarga de saber si es nuevo o recurrente)
    const user = await this.supabaseService.initializeAnonymousSession();

    if (user) {
      console.log('Identidad del visitante confirmada:', user.id);

      // 2. Preguntamos a la Base de Datos si ya le habíamos construido su tablero
      let boardId = await this.supabaseService.getUserBoard(user.id);

      if (boardId) {
        console.log('Tablero recuperado desde la Base de Datos:', boardId);
      } else {
        console.log('Usuario sin tablero, fabricando demo board...');
        boardId = await this.supabaseService.createDemoBoard(user.id);
      }

      if (boardId) {
        this.activeBoardId.set(boardId);
      }
    }
  }
}