import {
  sanitizeHtml,
  validateToastOptions,
  validateConfig,
  debounce,
  generateUniqueId,
  deepClone,
  supportsCSSVariables,
} from '../src/utils';

describe('Utils', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML tags', () => {
      const input = '<script>alert("XSS")</script>';
      const output = sanitizeHtml(input);
      expect(output).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });

    it('should handle normal text', () => {
      const input = 'Hello World';
      const output = sanitizeHtml(input);
      expect(output).toBe('Hello World');
    });

    it('should escape special characters', () => {
      const input = '& < > " \'';
      const output = sanitizeHtml(input);
      expect(output).toBe('&amp; &lt; &gt; " \'');
    });
  });

  describe('validateToastOptions', () => {
    it('should accept valid options', () => {
      expect(() => validateToastOptions({ autoDismiss: 5000 })).not.toThrow();
      expect(() => validateToastOptions({ position: 'top-right' })).not.toThrow();
      expect(() => validateToastOptions({ animationDirection: 'left-to-right' })).not.toThrow();
    });

    it('should throw for invalid autoDismiss', () => {
      expect(() => validateToastOptions({ autoDismiss: -1 }))
        .toThrow('autoDismiss must be a non-negative number');
      expect(() => validateToastOptions({ autoDismiss: 'invalid' as any }))
        .toThrow('autoDismiss must be a non-negative number');
    });

    it('should throw for invalid position', () => {
      expect(() => validateToastOptions({ position: 'invalid' as any }))
        .toThrow('Invalid position: invalid');
    });

    it('should throw for invalid animation direction', () => {
      expect(() => validateToastOptions({ animationDirection: 'invalid' as any }))
        .toThrow('Invalid animation direction: invalid');
    });
  });

  describe('validateConfig', () => {
    it('should accept valid config', () => {
      expect(() => validateConfig({ maxVisibleStackToasts: 5 })).not.toThrow();
      expect(() => validateConfig({ defaultDuration: 3000 })).not.toThrow();
    });

    it('should throw for invalid maxVisibleStackToasts', () => {
      expect(() => validateConfig({ maxVisibleStackToasts: 0 }))
        .toThrow('maxVisibleStackToasts must be a positive number');
      expect(() => validateConfig({ maxVisibleStackToasts: 'invalid' as any }))
        .toThrow('maxVisibleStackToasts must be a positive number');
    });

    it('should throw for invalid maxRenderedToasts', () => {
      expect(() => validateConfig({ maxRenderedToasts: -1 }))
        .toThrow('maxRenderedToasts must be a positive number');
    });

    it('should throw for invalid defaultDuration', () => {
      expect(() => validateConfig({ defaultDuration: -1000 }))
        .toThrow('defaultDuration must be a non-negative number');
    });

    it('should throw for invalid animationDuration', () => {
      expect(() => validateConfig({ animationDuration: -100 }))
        .toThrow('animationDuration must be a non-negative number');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('third');
    });

    it('should handle multiple debounce cycles', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 50);

      debouncedFn('first');
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('first');

      debouncedFn('second');
      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledWith('second');

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateUniqueId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateUniqueId());
      }
      expect(ids.size).toBe(1000);
    });

    it('should start with toast prefix', () => {
      const id = generateUniqueId();
      expect(id).toMatch(/^toast-\d+-[a-z0-9]+$/);
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[2]).not.toBe(arr[2]);
    });

    it('should clone dates', () => {
      const date = new Date('2024-01-01');
      const cloned = deepClone(date);
      
      expect(cloned).toEqual(date);
      expect(cloned).not.toBe(date);
      expect(cloned.getTime()).toBe(date.getTime());
    });
  });

  describe('supportsCSSVariables', () => {
    it('should return true when CSS.supports exists', () => {
      expect(supportsCSSVariables()).toBe(true);
    });

    it('should return false when CSS.supports is missing', () => {
      // Mock CSS.supports as undefined
      const originalSupports = window.CSS.supports;
      
      // Replace supports with undefined
      (window.CSS as any).supports = undefined;
      
      const result = supportsCSSVariables();
      expect(result).toBeFalsy(); // Accept false, undefined, or null
      
      // Restore CSS.supports
      (window.CSS as any).supports = originalSupports;
    });
  });
});