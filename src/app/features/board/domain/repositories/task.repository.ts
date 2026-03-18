import { Task } from '../../models/board.models';

export abstract class TaskRepository {
  abstract createTask(taskData: Partial<Task>): Promise<Task | null>;
  abstract updateTask(taskId: string, updates: Partial<Task>): Promise<boolean>;
  abstract updateTaskPosition(task: Task): Promise<boolean>;
  abstract updateTasksBulk(tasks: Task[]): Promise<boolean>;
  abstract deleteTask(taskId: string): Promise<boolean>;
}
