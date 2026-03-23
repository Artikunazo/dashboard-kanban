import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastComponent } from './toast';
import { ToastService } from '../../../core/services/toast.service';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render success toast', () => {
    toastService.showSuccess('Success message');
    fixture.detectChanges();
    
    const toastElements = fixture.debugElement.queryAll(By.css('div.pointer-events-auto'));
    expect(toastElements.length).toBe(1);
    expect(toastElements[0].nativeElement.textContent).toContain('Success message');
    expect(fixture.debugElement.query(By.css('.text-emerald-400'))).toBeTruthy();
  });

  it('should render error toast', () => {
    toastService.showError('Error message');
    fixture.detectChanges();
    
    const toastElements = fixture.debugElement.queryAll(By.css('div.pointer-events-auto'));
    expect(toastElements.length).toBe(1);
    expect(fixture.debugElement.query(By.css('.text-red-500'))).toBeTruthy();
  });

  it('should render info toast', () => {
    toastService.showInfo('Info message');
    fixture.detectChanges();
    
    const toastElements = fixture.debugElement.queryAll(By.css('div.pointer-events-auto'));
    expect(toastElements.length).toBe(1);
    expect(fixture.debugElement.query(By.css('.text-blue-400'))).toBeTruthy();
  });

  it('should call remove when dismiss button is clicked', () => {
    const spy = vi.spyOn(toastService, 'remove');
    toastService.showInfo('Dismissable');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
