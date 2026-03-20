import { Component, input, output } from '@angular/core';
import { Task } from '../../models/board.models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  templateUrl: './task-card.html',
  host: {
    class: 'bg-gray-700 p-4 rounded-lg shadow-sm hover:ring-2 hover:ring-blue-500 cursor-grab active:cursor-grabbing transition-all flex flex-col min-h-[120px] group',
    '(click)': 'taskClicked.emit()',
  },
})
export class TaskCardComponent {
  task = input.required<Task>();
  taskClicked = output<void>();
}
