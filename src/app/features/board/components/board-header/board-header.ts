import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-board-header',
  standalone: true,
  templateUrl: './board-header.html',
})
export class BoardHeaderComponent {
  // Inputs
  boardTitle = input.required<string>();
  isEditingTitle = input.required<boolean>();
  userBoards = input.required<{ id: string; title: string }[]>();
  activeBoardId = input.required<string>();
  rateLimitError = input<string | null>(null);

  // Outputs
  titleEditEnabled = output<void>();
  titleSaved = output<string>();
  titleEditCancelled = output<void>();
  boardSelected = output<string>();
  deleteBoard = output<void>();
  createBoard = output<void>();
  rateLimitDismissed = output<void>();

  onBoardSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value && select.value !== this.activeBoardId()) {
      this.boardSelected.emit(select.value);
    }
  }
}
