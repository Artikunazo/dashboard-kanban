import { Component, input, output } from '@angular/core';
import { TeamMember } from '../../../features/board/models/board.models';

@Component({
  selector: 'app-assignee-picker',
  standalone: true,
  templateUrl: './assignee-picker.html',
})
export class AssigneePickerComponent {
  members = input<TeamMember[]>([]);
  selectedId = input<string | null>(null);

  selectedIdChange = output<string | null>();

  toggle(memberId: string) {
    this.selectedIdChange.emit(
      this.selectedId() === memberId ? null : memberId
    );
  }

  unassign() {
    this.selectedIdChange.emit(null);
  }

  get selectedMember(): TeamMember | undefined {
    return this.members().find((m) => m.id === this.selectedId());
  }
}
