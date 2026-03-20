import { Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Column, Task } from '../../models/board.models';
import { TaskCardComponent } from '../task-card/task-card';
import { IconPlus } from '../../../../shared/components/icons/icon-plus';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [DragDropModule, TaskCardComponent, IconPlus],
  templateUrl: './column.html',
})
export class ColumnComponent {
  column = input.required<Column>();
  tasks = input.required<Task[]>();

  addTask = output<void>();
  taskClicked = output<Task>();
  taskDropped = output<CdkDragDrop<Task[]>>();
}
