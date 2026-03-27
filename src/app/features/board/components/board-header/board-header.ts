import { Component, input, output } from '@angular/core';
import { IconClose } from '../../../../shared/components/icons/icon-close';
import { IconEdit } from '../../../../shared/components/icons/icon-edit';
import { IconTrash } from '../../../../shared/components/icons/icon-trash';
import { IconPlus } from '../../../../shared/components/icons/icon-plus';
import { IconChevronDown } from '../../../../shared/components/icons/icon-chevron-down';
import { IconWarning } from '../../../../shared/components/icons/icon-warning';

/** Board topbar: title editing, board switcher dropdown, and create/delete actions. */
@Component({
  selector: 'app-board-header',
  standalone: true,
  templateUrl: './board-header.html',
  imports: [IconClose, IconEdit, IconTrash, IconPlus, IconChevronDown, IconWarning],
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
