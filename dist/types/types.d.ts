/**
 * Toast types available in ModernToasts
 */
export declare enum ToastType {
    Success = "success",
    Error = "error",
    Info = "info",
    Warning = "warning"
}
/**
 * Position options for toast container
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
/**
 * Animation direction options
 */
export type AnimationDirection = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
/**
 * Options for individual toast notifications
 */
export interface ToastOptions {
    /** Auto-dismiss duration in milliseconds (default: 3000) */
    autoDismiss?: number;
    /** Position of the toast container (default: 'bottom-right') */
    position?: ToastPosition;
    /** Background color of the toast */
    backgroundColor?: string;
    /** Text color of the toast */
    textColor?: string;
    /** Border color of the toast */
    borderColor?: string;
    /** Whether to show close button (default: true) */
    showCloseButton?: boolean;
    /** Whether to pause auto-dismiss on hover (default: true) */
    pauseOnHover?: boolean;
    /** Custom CSS class to add to the toast */
    className?: string;
    /** Custom icon HTML or SVG string */
    icon?: string;
    /** Animation direction for border and fill animations (default: 'left-to-right') */
    animationDirection?: AnimationDirection;
}
/**
 * Global configuration for ModernToasts
 */
export interface ToastConfig {
    /** Default position for all toasts (default: 'bottom-right') */
    position?: ToastPosition;
    /** Maximum number of visible stacked toasts (default: 3) */
    maxVisibleStackToasts?: number;
    /** Vertical offset between stacked toasts in pixels (default: 10) */
    stackOffsetY?: number;
    /** Horizontal offset between stacked toasts in pixels (default: 4) */
    stackOffsetX?: number;
    /** Scale reduction per stack level (default: 0.05) */
    scaleDecrementPerLevel?: number;
    /** Opacity reduction per stack level (default: 0.2) */
    opacityDecrementPerLevel?: number;
    /** Maximum number of rendered toasts (default: 5) */
    maxRenderedToasts?: number;
    /** Default auto-dismiss duration in milliseconds (default: 3000) */
    defaultDuration?: number;
    /** Animation duration for enter/exit in milliseconds (default: 300) */
    animationDuration?: number;
    /** Whether to enable border animations (default: true) */
    enableBorderAnimation?: boolean;
    /** Whether to enable fill animations (default: true) */
    enableFillAnimation?: boolean;
    /** Default animation direction (default: 'left-to-right') */
    animationDirection?: AnimationDirection;
    /** Custom CSS to inject */
    customCSS?: string;
}
/**
 * Internal toast data structure
 */
export interface ToastData {
    id: string;
    message: string;
    type: ToastType;
    options: Required<ToastOptions>;
    element?: HTMLElement;
    timer?: number;
    isRemoving?: boolean;
    createdAt: number;
    closeButton?: HTMLButtonElement;
    closeButtonListener?: EventListener;
    mouseEnterListener?: EventListener;
    mouseLeaveListener?: EventListener;
}
/**
 * Toast event types
 */
export type ToastEvent = 'show' | 'dismiss' | 'click' | 'hover';
/**
 * Event callback function
 */
export type ToastEventCallback = (toast: ToastData) => void;
/**
 * Main ModernToasts API interface
 */
export interface ModernToastsAPI {
    /** Show a success toast */
    success(message: string, options?: ToastOptions): string;
    /** Show an error toast */
    error(message: string, options?: ToastOptions): string;
    /** Show an info toast */
    info(message: string, options?: ToastOptions): string;
    /** Show a warning toast */
    warning(message: string, options?: ToastOptions): string;
    /** Show a custom toast */
    show(message: string, type: ToastType, options?: ToastOptions): string;
    /** Dismiss a specific toast by ID */
    dismiss(id: string): void;
    /** Dismiss all toasts */
    dismissAll(): void;
    /** Update global configuration */
    configure(config: Partial<ToastConfig>): void;
    /** Get current configuration */
    getConfig(): ToastConfig;
    /** Add event listener */
    on(event: ToastEvent, callback: ToastEventCallback): void;
    /** Remove event listener */
    off(event: ToastEvent, callback: ToastEventCallback): void;
    /** Destroy the toast system and cleanup */
    destroy(): void;
}
//# sourceMappingURL=types.d.ts.map