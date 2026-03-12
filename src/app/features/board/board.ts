import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from './services/board';
import { Task, Column } from './models/board.models';
// 1. Importamos el Modal y su tipo
import { TaskModal, ModalMode } from './components/task-modal/task-modal';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [DragDropModule, TaskModal],
  templateUrl: './board.html'
})
export class BoardComponent implements OnInit {
  private boardService = inject(BoardService);
  boardId = input.required<string>();

  isLoading = signal<boolean>(true);
  columns = signal<Column[]>([]);
  tasksByColumn = signal<Record<string, Task[]>>({});

  // 3. Estados reactivos para controlar el Modal
  isModalOpen = signal<boolean>(false);
  modalMode = signal<ModalMode>('create');
  selectedTask = signal<Task | null>(null);
  activeColumnId = signal<string | null>(null);

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

  openCreateModal(columnId: string) {
    this.activeColumnId.set(columnId);
    this.modalMode.set('create');
    this.selectedTask.set(null);
    this.isModalOpen.set(true);
  }

  openViewModal(task: Task) {
    this.selectedTask.set(task);
    this.modalMode.set('view');
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.activeColumnId.set(null);
    this.selectedTask.set(null);
  }

  // 5. El método que guarda la tarea en BD y actualiza la pantalla
  async onSaveTask(taskData: Partial<Task>) {
    // Calculamos en qué posición debe ir (al final de la lista actual)
    const columnId = taskData.column_id!;
    const currentTasks = this.tasksByColumn()[columnId] || [];
    taskData.position = currentTasks.length;

    // Llamamos a Supabase
    const newTask = await this.boardService.createTask(taskData);

    if (newTask) {
      // Si se guardó con éxito, actualizamos nuestro estado local (Signal)
      this.tasksByColumn.update(prev => {
        const updated = { ...prev };
        updated[columnId] = [...(updated[columnId] || []), newTask];
        return updated;
      });
      console.log('Tarea creada con éxito');
    }
  }
}