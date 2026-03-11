import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from './services/board';
import { Task, Column } from './models/board.models';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './board.html'
})
export class BoardComponent implements OnInit {
  private boardService = inject(BoardService);
  boardId = input.required<string>();

  isLoading = signal<boolean>(true);
  columns = signal<Column[]>([]);

  // ColumndId, Tasks of column
  tasksByColumn = signal<Record<string, Task[]>>({});

  async ngOnInit() {
    await this.loadBoardData();
  }

  private async loadBoardData() {
    this.isLoading.set(true);
    const data = await this.boardService.getFullBoard(this.boardId());

    if (data) {
      this.columns.set(data.columns);

      // Transformamos los datos planos a arreglos separados por columna
      const grouped: Record<string, Task[]> = {};
      data.columns.forEach(col => grouped[col.id] = []);
      data.tasks.forEach(task => {
        if (grouped[task.column_id]) {
          grouped[task.column_id].push(task);
        }
      });
      this.tasksByColumn.set(grouped);
    }
    this.isLoading.set(false);
  }

  // 4. La función que maneja la física de soltar una tarjeta
  drop(event: CdkDragDrop<Task[]>, targetColumnId: string) {
    if (event.previousContainer === event.container) {
      // Reordenar dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transferir a una columna diferente
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Actualizamos el ID de la columna en la tarea localmente
      const movedTask = event.container.data[event.currentIndex];
      movedTask.column_id = targetColumnId;
    }

    console.log('¡Estructura actualizada localmente!');
    // Próximo paso: Enviar esta nueva posición a Supabase
  }
}