import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/board.models';

export type ModalMode = 'create' | 'view';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule], // El estándar estable de la industria
  templateUrl: './task-modal.html'
})
export class TaskModal {
  // Inputs reactivos modernos
  isOpen = input.required<boolean>();
  mode = input.required<ModalMode>();
  task = input<Task | null>(null);
  columnId = input<string | null>(null);

  // Outputs modernos
  closeModal = output<void>();
  saveTask = output<Partial<Task>>();

  // Formulario Reactivo
  private fb = inject(NonNullableFormBuilder);
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  constructor() {
    effect(() => {
      if (!this.isOpen()) {
        this.taskForm.reset();
      } else if (this.mode() === 'view' && this.task()) {
        this.taskForm.patchValue({
          title: this.task()!.title,
          description: this.task()!.description || ''
        });
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      console.warn('Form is invalid. Cannot create task.');
      return;
    }

    this.saveTask.emit({
      title: this.taskForm.getRawValue().title,
      description: this.taskForm.getRawValue().description,
      column_id: this.columnId()!
    });

    this.onClose();
  }
}