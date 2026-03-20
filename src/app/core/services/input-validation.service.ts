import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Centralized input validation and sanitization utilities.
 * Used as static helpers so they can be injected via Angular DI or called directly.
 */
export class InputValidationService {
  /**
   * Strips HTML tags, trims whitespace, and truncates to maxLength.
   */
  static sanitize(value: string, maxLength: number): string {
    if (!value) return '';
    const stripped = value.replace(/<[^>]*>/g, '');
    return stripped.trim().slice(0, maxLength);
  }

  /**
   * ValidatorFn: rejects values containing < or > characters (potential HTML injection).
   */
  static noHtmlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    const hasHtml = /<[^>]*>/.test(value);
    return hasHtml ? { noHtml: true } : null;
  };

  /**
   * ValidatorFn: maxLength applied AFTER trimming whitespace.
   */
  static maxLengthTrimmed(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = (control.value ?? '').trim();
      return value.length > max ? { maxlength: { requiredLength: max, actualLength: value.length } } : null;
    };
  }
}
