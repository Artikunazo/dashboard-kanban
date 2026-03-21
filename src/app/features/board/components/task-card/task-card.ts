import { Component, input, output } from '@angular/core';
import { Task } from '../../models/board.models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  templateUrl: './task-card.html',
  host: {
    class: 'bg-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md border border-slate-700/60 hover:border-indigo-500/50 cursor-grab active:cursor-grabbing transition-all flex flex-col min-h-[120px] group',
    '(mousedown)': 'onMouseDown($event)',
    '(click)': 'onClick($event)',
  },
})
export class TaskCardComponent {
  task = input.required<Task>();
  taskClicked = output<void>();

  private startX = 0;
  private startY = 0;

  onMouseDown(event: MouseEvent) {
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  onClick(event: MouseEvent) {
    const dx = Math.abs(event.clientX - this.startX);
    const dy = Math.abs(event.clientY - this.startY);
    // If we moved less than 5 pixels, it's a click, not a drag.
    if (dx < 5 && dy < 5) {
      this.taskClicked.emit();
    }
  }
}
