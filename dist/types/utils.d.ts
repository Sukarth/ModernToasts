import { ToastOptions, ToastConfig } from './types';
/**
 * Sanitize HTML content to prevent XSS attacks
 */
export declare function sanitizeHtml(input: string): string;
/**
 * Validate toast options
 */
export declare function validateToastOptions(options: Partial<ToastOptions>): void;
/**
 * Validate configuration object
 */
export declare function validateConfig(config: Partial<ToastConfig>): void;
/**
 * Debounce function for performance optimization
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Create a unique ID for toasts
 */
export declare function generateUniqueId(): string;
/**
 * Deep clone an object
 */
export declare function deepClone<T>(obj: T): T;
/**
 * Check if the browser supports CSS custom properties
 */
export declare function supportsCSSVariables(): boolean;
/**
 * Request animation frame with fallback
 */
export declare const raf: ((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame;
/**
 * Cancel animation frame with fallback
 */
export declare const cancelRaf: ((handle: number) => void) & typeof cancelAnimationFrame;
//# sourceMappingURL=utils.d.ts.map