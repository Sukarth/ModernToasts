import { ModernToasts } from './ModernToasts';
import { ToastType, ToastOptions, ToastConfig } from './types';

// Export types for TypeScript users
export { ToastType, ToastOptions, ToastConfig, ToastData, ToastEvent, ToastEventCallback, ModernToastsAPI } from './types';
export { ModernToasts } from './ModernToasts';

// Create a default instance for simple usage
const defaultInstance = new ModernToasts();

/**
 * Simple toast API - can be used directly without creating an instance
 */
export const toast = {
  /**
   * Show a success toast
   */
  success: (message: string, options?: ToastOptions): string => {
    return defaultInstance.success(message, options);
  },

  /**
   * Show an error toast
   */
  error: (message: string, options?: ToastOptions): string => {
    return defaultInstance.error(message, options);
  },

  /**
   * Show an info toast
   */
  info: (message: string, options?: ToastOptions): string => {
    return defaultInstance.info(message, options);
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, options?: ToastOptions): string => {
    return defaultInstance.warning(message, options);
  },

  /**
   * Show a custom toast
   */
  show: (message: string, type: ToastType, options?: ToastOptions): string => {
    return defaultInstance.show(message, type, options);
  },

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (id: string): void => {
    defaultInstance.dismiss(id);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: (): void => {
    defaultInstance.dismissAll();
  },

  /**
   * Configure the default toast instance
   */
  configure: (config: Partial<ToastConfig>): void => {
    defaultInstance.configure(config);
  },

  /**
   * Get current configuration
   */
  getConfig: (): ToastConfig => {
    return defaultInstance.getConfig();
  },

  /**
   * Create a new ModernToasts instance with custom configuration
   */
  create: (config?: Partial<ToastConfig>): ModernToasts => {
    return new ModernToasts(config);
  }
};

// For script tag usage - attach to window
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  (window as any).ModernToasts = {
    toast,
    ModernToasts,
    ToastType
  };
}

// Default export for convenience
export default toast;