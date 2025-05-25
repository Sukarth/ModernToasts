import { ModernToasts } from './ModernToasts';
import { ToastType, ToastOptions, ToastConfig } from './types';
export { ToastType, ToastOptions, ToastConfig, ToastData, ToastEvent, ToastEventCallback, ModernToastsAPI } from './types';
export { ModernToasts } from './ModernToasts';
/**
 * Simple toast API - can be used directly without creating an instance
 */
export declare const toast: {
    /**
     * Show a success toast
     */
    success: (message: string, options?: ToastOptions) => string;
    /**
     * Show an error toast
     */
    error: (message: string, options?: ToastOptions) => string;
    /**
     * Show an info toast
     */
    info: (message: string, options?: ToastOptions) => string;
    /**
     * Show a warning toast
     */
    warning: (message: string, options?: ToastOptions) => string;
    /**
     * Show a custom toast
     */
    show: (message: string, type: ToastType, options?: ToastOptions) => string;
    /**
     * Dismiss a specific toast by ID
     */
    dismiss: (id: string) => void;
    /**
     * Dismiss all toasts
     */
    dismissAll: () => void;
    /**
     * Configure the default toast instance
     */
    configure: (config: Partial<ToastConfig>) => void;
    /**
     * Get current configuration
     */
    getConfig: () => ToastConfig;
    /**
     * Create a new ModernToasts instance with custom configuration
     */
    create: (config?: Partial<ToastConfig>) => ModernToasts;
};
export default toast;
//# sourceMappingURL=index.d.ts.map