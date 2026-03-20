import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon-plus',
  standalone: true,
  template: `
    <svg [class]="svgClass()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  `,
})
export class IconPlus {
  svgClass = input<string>('w-4 h-4');
}
