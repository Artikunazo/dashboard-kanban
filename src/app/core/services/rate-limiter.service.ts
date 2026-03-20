import { Injectable } from '@angular/core';

interface RateLimitBucket {
  count: number;
  windowStart: number; // timestamp in ms
}

interface RateLimitConfig {
  maxCount: number;
  /** Window in ms. Use 0 for "per session" (no reset). */
  windowMs: number;
  label: string;
}

const LIMITS: Record<string, RateLimitConfig> = {
  'create-board': {
    maxCount: 5,
    windowMs: 0, // per session — never resets
    label: 'tableros por sesión',
  },
  'create-task': {
    maxCount: 50,
    windowMs: 10 * 60 * 1000, // 10 minutes
    label: 'tareas por 10 minutos',
  },
};

@Injectable({
  providedIn: 'root',
})
export class RateLimiterService {
  private buckets = new Map<string, RateLimitBucket>();

  /**
   * Returns true and records the attempt if the action is within its limit.
   * Returns false if the limit has been reached.
   */
  canPerform(action: string): boolean {
    const config = LIMITS[action];
    if (!config) return true; // unknown actions are not limited

    const now = Date.now();
    const bucket = this.buckets.get(action);

    if (!bucket) {
      this.buckets.set(action, { count: 1, windowStart: now });
      return true;
    }

    // For per-session limits (windowMs === 0), never reset.
    const windowExpired = config.windowMs > 0 && now - bucket.windowStart > config.windowMs;

    if (windowExpired) {
      // New window: reset the bucket
      this.buckets.set(action, { count: 1, windowStart: now });
      return true;
    }

    if (bucket.count >= config.maxCount) {
      return false; // limit reached
    }

    bucket.count++;
    return true;
  }

  /**
   * Returns a human-friendly error message for the blocked action.
   */
  getErrorMessage(action: string): string {
    const config = LIMITS[action];
    if (!config) return 'Límite de uso alcanzado.';
    return `Has alcanzado el límite de ${config.maxCount} ${config.label}. Por favor espera antes de continuar.`;
  }

  /**
   * Returns the current count for an action (useful for UI feedback).
   */
  getCount(action: string): number {
    return this.buckets.get(action)?.count ?? 0;
  }

  /**
   * Returns the configured max for an action.
   */
  getMax(action: string): number {
    return LIMITS[action]?.maxCount ?? Infinity;
  }
}
