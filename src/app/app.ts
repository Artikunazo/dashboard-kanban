import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class App implements OnInit {
  private supabaseService = inject(SupabaseService);

  async ngOnInit() {
    const user = await this.supabaseService.initializeAnonymousSession();

    if (user) {
      const boardId = await this.supabaseService.createDemoBoard(user.id);
    }
  }
}