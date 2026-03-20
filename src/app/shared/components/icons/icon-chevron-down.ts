import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon-chevron-down',
  standalone: true,
  template: `
    <svg [class]="svgClass()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  `,
})
export class IconChevronDown {
  svgClass = input<string>('w-4 h-4');
}
