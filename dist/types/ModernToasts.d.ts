import { ToastType, ToastOptions, ToastConfig, ToastEvent, ToastEventCallback, ModernToastsAPI } from './types';
/**
 * ModernToasts - A modern toast notification library
 * Implementation directly copied from working vanilla demo
 */
export declare class ModernToasts implements ModernToastsAPI {
    private config;
    private toasts;
    private container;
    private containerInner;
    private eventListeners;
    private isInitialized;
    constructor(config?: Partial<ToastConfig>);
    /**
     * Initialize the toast system
     */
    private init;
    /**
     * Inject CSS styles into the document
     */
    private injectCSS;
    /**
     * Create the toast container - Clean CSS class approach
     */
    private createContainer;
    /**
     * Update container position using CSS classes - Clean approach
     */
    private updateContainerPosition;
    /**
     * Update CSS custom properties
     */
    private updateCSSProperties;
    /**
     * Update CSS duration for a specific toast
     */
    private updateToastAnimationDuration;
    /**
     * Create toast element using the builder pattern
     */
    private createToastElement;
    /**
     * Set up event listeners for a toast with proper cleanup
     */
    private setupToastEventListeners;
    /**
     * Calculate position-aware stacking offsets
     */
    private calculateStackingOffsets;
    /**
     * Update toast stack styles - CSS Variables approach with position-aware offsets
     */
    private updateToastStackStyles;
    /**
     * Update animation classes for existing toasts
     */
    private updateAnimationClasses;
    /**
     * Add toast with proper options handling
     */
    private addToast;
    /**
     * Remove toast with proper cleanup
     */
    private removeToast;
    /**
     * Clean up event listeners for a toast
     */
    private cleanupToastEventListeners;
    /**
     * Emit event to listeners
     */
    private emit;
    /**
     * Show a toast notification
     */
    show(message: string, type: ToastType, options?: ToastOptions): string;
    /**
     * Show success toast
     */
    success(message: string, options?: ToastOptions): string;
    /**
     * Show error toast
     */
    error(message: string, options?: ToastOptions): string;
    /**
     * Show info toast
     */
    info(message: string, options?: ToastOptions): string;
    /**
     * Show warning toast
     */
    warning(message: string, options?: ToastOptions): string;
    /**
     * Dismiss a specific toast
     */
    dismiss(id: string): void;
    /**
     * Dismiss all toasts
     */
    dismissAll(): void;
    /**
     * Update configuration
     */
    configure(config: Partial<ToastConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): ToastConfig;
    /**
     * Add event listener
     */
    on(event: ToastEvent, callback: ToastEventCallback): void;
    /**
     * Remove event listener
     */
    off(event: ToastEvent, callback: ToastEventCallback): void;
    /**
     * Destroy the toast system
     */
    destroy(): void;
}
//# sourceMappingURL=ModernToasts.d.ts.map