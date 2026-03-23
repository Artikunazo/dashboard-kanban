import { TestBed } from '@angular/core/testing';
import { ToastService, ToastType } from './toast.service';
import { vi } from 'vitest';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success toast', () => {
    service.showSuccess('Success msg');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Success msg');
    expect(toasts[0].type).toBe('success');
  });

  it('should show error toast', () => {
    service.showError('Error msg');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Error msg');
    expect(toasts[0].type).toBe('error');
  });

  it('should show info toast', () => {
    service.showInfo('Info msg');
    const toasts = service.toasts();
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Info msg');
    expect(toasts[0].type).toBe('info');
  });

  it('should remove toast after timeout', () => {
    service.showInfo('Timeout test');
    expect(service.toasts().length).toBe(1);
    
    vi.advanceTimersByTime(4000);
    expect(service.toasts().length).toBe(0);
  });

  it('should explicitly remove toast by id', () => {
    service.showInfo('Manual remove');
    const id = service.toasts()[0].id;
    service.remove(id);
    expect(service.toasts().length).toBe(0);
  });
});
