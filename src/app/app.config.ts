import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BoardRepository } from './features/board/domain/repositories/board.repository';
import { TaskRepository } from './features/board/domain/repositories/task.repository';
import { SupabaseBoardRepository } from './features/board/infrastructure/repositories/supabase-board.repository';
import { SupabaseTaskRepository } from './features/board/infrastructure/repositories/supabase-task.repository';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: BoardRepository, useClass: SupabaseBoardRepository },
    { provide: TaskRepository, useClass: SupabaseTaskRepository }
  ],
};
