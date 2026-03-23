import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssigneePickerComponent } from './assignee-picker';
import { TeamMember } from '../../../features/board/models/board.models';

describe('AssigneePickerComponent', () => {
  let component: AssigneePickerComponent;
  let fixture: ComponentFixture<AssigneePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AssigneePickerComponent);
    component = fixture.componentInstance;
    
    // Set inputs
    fixture.componentRef.setInput('members', [{id: '1', name: 'John'}, {id: '2', name: 'Jane'}] as TeamMember[]);
    fixture.componentRef.setInput('selectedId', '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle selection off if same id clicked', () => {
    vi.spyOn(component.selectedIdChange, 'emit');
    component.toggle('1');
    expect(component.selectedIdChange.emit).toHaveBeenCalledWith(null);
  });

  it('should toggle selection to new id', () => {
    vi.spyOn(component.selectedIdChange, 'emit');
    component.toggle('2');
    expect(component.selectedIdChange.emit).toHaveBeenCalledWith('2');
  });

  it('should unassign', () => {
    vi.spyOn(component.selectedIdChange, 'emit');
    component.unassign();
    expect(component.selectedIdChange.emit).toHaveBeenCalledWith(null);
  });

  it('should return selectedMember', () => {
    expect(component.selectedMember).toBeDefined();
    expect(component.selectedMember?.name).toBe('John');
  });

  describe('DOM interactions for coverage', () => {
    it('should render member buttons with or without avatar and call toggle on click', () => {
      fixture.componentRef.setInput('members', [
        {id: '1', name: 'John', avatar_url: 'https://example.com/avatar.jpg'} as TeamMember,
        {id: '2', name: 'Jane', role: 'Dev'} as TeamMember
      ]);
      fixture.detectChanges();
      
      const buttons = fixture.nativeElement.querySelectorAll('button');
      // first two buttons are the members
      expect(buttons.length).toBeGreaterThanOrEqual(2);
      
      // Avatar is rendered for John
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.src).toContain('avatar.jpg');
      
      // Initials rendered for Jane
      const initials = fixture.nativeElement.querySelector('.bg-indigo-600');
      expect(initials).toBeTruthy();
      expect(initials.textContent.trim()).toBe('J');

      vi.spyOn(component, 'toggle');
      buttons[0].click();
      expect(component.toggle).toHaveBeenCalledWith('1');
    });

    it('should show unassign button when selectedId is set and call unassign on click', () => {
      fixture.componentRef.setInput('selectedId', '1');
      fixture.detectChanges();
      
      const unassignBtn = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
        (b: any) => b.textContent?.includes('Unassign')
      ) as HTMLElement;
      
      expect(unassignBtn).toBeTruthy();
      
      vi.spyOn(component, 'unassign');
      unassignBtn.click();
      expect(component.unassign).toHaveBeenCalled();
    });

    it('should not show unassign button when selectedId is null', () => {
      fixture.componentRef.setInput('selectedId', null);
      fixture.detectChanges();
      
      const unassignBtn = Array.from(fixture.nativeElement.querySelectorAll('button')).find(
        (b: any) => b.textContent?.includes('Unassign')
      );
      
      expect(unassignBtn).toBeFalsy();
    });

    it('should show selected member info and role', () => {
      fixture.componentRef.setInput('members', [
        {id: '2', name: 'Jane', role: 'Developer'} as TeamMember
      ]);
      fixture.componentRef.setInput('selectedId', '2');
      fixture.detectChanges();
      
      const infoParagraph = fixture.nativeElement.querySelector('p.text-indigo-400');
      expect(infoParagraph).toBeTruthy();
      expect(infoParagraph.textContent).toContain('Assigned to Jane');
      expect(infoParagraph.textContent).toContain('Developer');
    });
  });
});
