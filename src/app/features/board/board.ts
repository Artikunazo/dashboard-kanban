import {
	Component,
	inject,
	input,
	output,
	OnInit,
	signal,
	effect,
} from '@angular/core';
import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import {BoardService} from './services/board';
import {Task, Column} from './models/board.models';
// 1. Importamos el Modal y su tipo
import {TaskModal, ModalMode} from './components/task-modal/task-modal';

@Component({
	selector: 'app-board',
	standalone: true,
	imports: [DragDropModule, TaskModal],
	templateUrl: './board.html',
})
export class BoardComponent implements OnInit {
	private boardService = inject(BoardService);
	boardId = input.required<string>();

	boardChanged = output<string>();

	isLoading = signal<boolean>(true);
	columns = signal<Column[]>([]);
	tasksByColumn = signal<Record<string, Task[]>>({});

	// 3. Estados reactivos para controlar el Modal
	isModalOpen = signal<boolean>(false);
	modalMode = signal<ModalMode>('create');
	selectedTask = signal<Task | null>(null);
	activeColumnId = signal<string | null>(null);

	boardTitle = signal<string>('Cargando tablero...');
	isEditingTitle = signal<boolean>(false);
	userBoards = signal<{id: string; title: string}[]>([]);

	constructor() {
		// Este efecto vigilará silenciosamente a boardId()
		effect(
			() => {
				// Al leer boardId() aquí, Angular sabe que debe re-ejecutar este bloque
				// cada vez que el padre nos mande un ID diferente.
				const currentBoardId = this.boardId();

				if (currentBoardId) {
					console.log(
						`El ID del tablero cambió a: ${currentBoardId}. Recargando datos...`,
					);
					this.loadBoardData();
				}
			},
			{allowSignalWrites: true},
		);
		// allowSignalWrites es importante porque loadBoardData() modifica señales
		// como isLoading, columns y tasksByColumn.
	}

	async ngOnInit() {
		//await this.loadBoardData();
	}

	private async loadBoardData() {
		this.isLoading.set(true);

		// Load all boards list
		const boardsList = await this.boardService.getAllUserBoards();
		this.userBoards.set(boardsList);

		const boardDetails = await this.boardService.getBoardDetails(
			this.boardId(),
		);
		if (boardDetails) {
			// Ajusta 'title' si en tu base de datos la columna se llama 'name'
			this.boardTitle.set(boardDetails.title || 'Mi Tablero Kanban');
		}

		const data = await this.boardService.getFullBoard(this.boardId());

		if (data) {
			this.columns.set(data.columns);

			// Transformamos los datos planos a arreglos separados por columna
			const grouped: Record<string, Task[]> = {};
			data.columns.forEach((col) => (grouped[col.id] = []));
			data.tasks.forEach((task) => {
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
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex,
			);
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
			console.log(
				`Enviando ${tasksToUpdate.length} tareas a actualizar de golpe...`,
			);
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
		// CASO 1: MODO EDICIÓN
		if (this.modalMode() === 'edit' && this.selectedTask()) {
			const taskId = this.selectedTask()!.id;
			const columnId = this.selectedTask()!.column_id;

			const success = await this.boardService.updateTask(taskId, {
				title: taskData.title,
				description: taskData.description,
			});

			if (success) {
				// Actualizamos el Signal local para no tener que recargar la base de datos
				this.tasksByColumn.update((prev) => {
					const updated = {...prev};
					const taskIndex = updated[columnId].findIndex((t) => t.id === taskId);

					if (taskIndex > -1) {
						// Fusionamos la tarea vieja con los datos nuevos
						updated[columnId][taskIndex] = {
							...updated[columnId][taskIndex],
							title: taskData.title!,
							description: taskData.description,
						};
					}
					return updated;
				});
			}
		}

		// CASO 2: MODO CREACIÓN (Tu código anterior)
		else {
			const columnId = taskData.column_id!;
			const currentTasks = this.tasksByColumn()[columnId] || [];
			taskData.position = currentTasks.length;

			const newTask = await this.boardService.createTask(taskData);

			if (newTask) {
				this.tasksByColumn.update((prev) => {
					const updated = {...prev};
					updated[columnId] = [...(updated[columnId] || []), newTask];
					return updated;
				});
			}
		}
	}

	enableTitleEdit() {
		this.isEditingTitle.set(true);
	}

	async saveBoardTitle(newTitle: string) {
		if (!newTitle.trim() || newTitle === this.boardTitle()) {
			this.isEditingTitle.set(false);
			return;
		}

		const success = await this.boardService.updateBoardTitle(
			this.boardId(),
			newTitle,
		);
		if (success) {
			this.boardTitle.set(newTitle);
			this.loadBoardData();
		}
		this.isEditingTitle.set(false);
	}

	// 3. Función para borrar el tablero
	async onDeleteBoard() {
		const confirmed = window.confirm(
			'Are you sure you want to delete this board? This action cannot be undone.',
		);

		if (confirmed) {
			const success = await this.boardService.deleteBoard(this.boardId());
			if (success) {
				window.location.reload();
			}
		}
	}

	// 4. Función para crear un nuevo tablero (Placeholder por ahora)
	async onCreateNewBoard() {
		const newTitle = prompt('Enter the name for the new board:', 'New Project');

		if (!newTitle) return;

		this.isLoading.set(true);

		const newBoardId =
			await this.boardService.createBoardWithDefaults(newTitle);

		if (newBoardId) {
			this.boardChanged.emit(newBoardId);
		} else {
			this.isLoading.set(false);
			alert('Failed to create the board. Please try again.');
		}
	}

	onBoardSelected(event: Event) {
		const selectElement = event.target as HTMLSelectElement;
		const selectedId = selectElement.value;

		// Si selecciona uno diferente al actual, emitimos el cambio al app.ts
		if (selectedId && selectedId !== this.boardId()) {
			this.boardChanged.emit(selectedId);
		}
	}
}
