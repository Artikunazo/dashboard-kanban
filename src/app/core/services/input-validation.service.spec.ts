import { InputValidationService } from './input-validation.service';

describe('InputValidationService', () => {
  describe('sanitize', () => {
    it('should handle falsy values', () => {
      expect(InputValidationService.sanitize(null as any, 10)).toBe('');
      expect(InputValidationService.sanitize('', 10)).toBe('');
    });

    it('should strip HTML tags', () => {
      expect(InputValidationService.sanitize('<script>alert("x")</script>Hello', 100)).toBe('alert("x")Hello');
      expect(InputValidationService.sanitize('<b>Bold</b> text', 100)).toBe('Bold text');
    });

    it('should trim and truncate', () => {
      expect(InputValidationService.sanitize('   Too long string here   ', 8)).toBe('Too long');
    });
  });

  describe('noHtmlValidator', () => {
    it('should return null for valid strings', () => {
      expect(InputValidationService.noHtmlValidator({ value: 'clean string' } as any)).toBeNull();
      expect(InputValidationService.noHtmlValidator({ value: null } as any)).toBeNull();
    });

    it('should return error for strings with html tags', () => {
      expect(InputValidationService.noHtmlValidator({ value: '<b>hi</b>' } as any)).toEqual({ noHtml: true });
      expect(InputValidationService.noHtmlValidator({ value: '<script>' } as any)).toEqual({ noHtml: true });
    });
  });

  describe('maxLengthTrimmed', () => {
    const validator = InputValidationService.maxLengthTrimmed(5);

    it('should return null if within limit after trimming', () => {
      expect(validator({ value: '  123  ' } as any)).toBeNull();
      expect(validator({ value: null } as any)).toBeNull();
    });

    it('should return error if exceeding limit after trimming', () => {
      expect(validator({ value: '  123456  ' } as any)).toEqual({
        maxlength: { requiredLength: 5, actualLength: 6 }
      });
    });
  });
});
