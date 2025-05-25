import { ToastOptions, ToastConfig } from './types';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate toast options
 */
export function validateToastOptions(options: Partial<ToastOptions>): void {
  if (options.autoDismiss !== undefined) {
    if (typeof options.autoDismiss !== 'number' || options.autoDismiss < 0) {
      throw new Error('autoDismiss must be a non-negative number');
    }
  }

  if (options.position !== undefined) {
    const validPositions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
    if (!validPositions.includes(options.position)) {
      throw new Error(`Invalid position: ${options.position}`);
    }
  }

  if (options.animationDirection !== undefined) {
    const validDirections = ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top'];
    if (!validDirections.includes(options.animationDirection)) {
      throw new Error(`Invalid animation direction: ${options.animationDirection}`);
    }
  }
}

/**
 * Validate configuration object
 */
export function validateConfig(config: Partial<ToastConfig>): void {
  if (config.maxVisibleStackToasts !== undefined) {
    if (typeof config.maxVisibleStackToasts !== 'number' || config.maxVisibleStackToasts < 1) {
      throw new Error('maxVisibleStackToasts must be a positive number');
    }
  }

  if (config.maxRenderedToasts !== undefined) {
    if (typeof config.maxRenderedToasts !== 'number' || config.maxRenderedToasts < 1) {
      throw new Error('maxRenderedToasts must be a positive number');
    }
  }

  if (config.defaultDuration !== undefined) {
    if (typeof config.defaultDuration !== 'number' || config.defaultDuration < 0) {
      throw new Error('defaultDuration must be a non-negative number');
    }
  }

  if (config.animationDuration !== undefined) {
    if (typeof config.animationDuration !== 'number' || config.animationDuration < 0) {
      throw new Error('animationDuration must be a non-negative number');
    }
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends(...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;

  return function executedFunction(...args: Parameters<T>): void {
    const later = (): void => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Create a unique ID for toasts
 */
export function generateUniqueId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  if (obj instanceof Array) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj.map(item => deepClone(item)) as T;
  }

  const clonedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

/**
 * Check if the browser supports CSS custom properties
 */
export function supportsCSSVariables(): boolean {
  return window.CSS && window.CSS.supports && window.CSS.supports('--test', '0');
}

/**
 * Request animation frame with fallback
 */
export const raf = window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : (callback: FrameRequestCallback) => window.setTimeout(callback, 16);

/**
 * Cancel animation frame with fallback
 */
export const cancelRaf = window.cancelAnimationFrame
  ? window.cancelAnimationFrame.bind(window)
  : window.clearTimeout.bind(window);