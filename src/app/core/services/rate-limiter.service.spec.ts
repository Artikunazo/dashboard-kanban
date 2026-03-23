import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { RateLimiterService } from './rate-limiter.service';

describe('RateLimiterService', () => {
  let service: RateLimiterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateLimiterService);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow unknown actions without limit', () => {
    expect(service.canPerform('unknown-action')).toBe(true);
    expect(service.canPerform('unknown-action')).toBe(true);
    
    // Calling it again to cover branch where bucket exists for unknown
    // Actually unknown actions return early before bucket creation.
  });

  it('should allow and set bucket mapping', () => {
     // A bucket is just the action ID map. It won't have a limit if it's not configured.
     // But wait! If the action has NO config, `canPerform` returns `true` early and creates NO bucket.
     expect(service.canPerform('unknown')).toBe(true);
     expect(service.getCount('unknown')).toBe(0);
  });

  it('should limit create-board according to per-session rules', () => {
    // maxCount is 5
    expect(service.canPerform('create-board')).toBe(true);
    expect(service.getCount('create-board')).toBe(1);
    
    expect(service.canPerform('create-board')).toBe(true);
    expect(service.canPerform('create-board')).toBe(true);
    expect(service.canPerform('create-board')).toBe(true);
    expect(service.canPerform('create-board')).toBe(true);
    
    // 6th attempt should fail
    expect(service.canPerform('create-board')).toBe(false);
    expect(service.getCount('create-board')).toBe(5);

    // After adding time, it should still fail because windowMs is 0 (session logic)
    vi.advanceTimersByTime(24 * 60 * 60 * 1000); // 1 day
    expect(service.canPerform('create-board')).toBe(false);
  });

  it('should reset window for create-task after time expires', () => {
    // maxCount is 50, window is 10 min
    for (let i = 0; i < 50; i++) {
        expect(service.canPerform('create-task')).toBe(true);
    }
    // 51st should fail
    expect(service.canPerform('create-task')).toBe(false);
    expect(service.getCount('create-task')).toBe(50);
    
    // Advance timers by less than 10 minutes -> still fails
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(service.canPerform('create-task')).toBe(false);

    // Advance past 10 minutes total
    vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
    
    // Should reset and allow again
    expect(service.canPerform('create-task')).toBe(true);
    expect(service.getCount('create-task')).toBe(1);
  });

  it('should provide correct error messages', () => {
    expect(service.getErrorMessage('unknown')).toBe('Límite de uso alcanzado.');
    expect(service.getErrorMessage('create-board')).toBe('Has alcanzado el límite de 5 tableros por sesión. Por favor espera antes de continuar.');
  });

  it('should provide max counts', () => {
    expect(service.getMax('unknown')).toBe(Infinity);
    expect(service.getMax('create-task')).toBe(50);
  });
});
