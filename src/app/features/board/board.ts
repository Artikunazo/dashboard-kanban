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
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    // 1. Creamos la "caja" para recolectar las tareas que necesitan actualización
    const tasksToUpdate: Task[] = [];

    // 2. Revisamos la columna DESTINO
    event.container.data.forEach((task, index) => {
      if (task.position !== index || task.column_id !== targetColumnId) {
        task.position = index;
        task.column_id = targetColumnId;
        tasksToUpdate.push(task); // Almacenamos en lugar de enviar
      }
    });

    // 3. Si hubo cambio de columna, revisamos la columna ORIGEN
    if (event.previousContainer !== event.container) {
      event.previousContainer.data.forEach((task, index) => {
        if (task.position !== index) {
          task.position = index;
          tasksToUpdate.push(task); // Almacenamos en lugar de enviar
        }
      });
    }

    // 4. Disparamos UNA SOLA petición de red con todas las modificaciones
    if (tasksToUpdate.length > 0) {
      console.log(`Enviando ${tasksToUpdate.length} tareas a actualizar de golpe...`);
      this.boardService.updateTasksBulk(tasksToUpdate);
    }
  }
}