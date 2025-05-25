import {
  ToastType,
  ToastOptions,
  ToastConfig,
  ToastData,
  ToastEvent,
  ToastEventCallback,
  ModernToastsAPI,
  ToastPosition,
  AnimationDirection
} from './types';
import {
  ANIMATION_TIMING,
  STACK_CONFIG,
  CSS_CLASSES,
  DOM_CONFIG,
  POSITION_CLASSES
} from './constants';
import {
  validateToastOptions,
  validateConfig,
  generateUniqueId,
  raf
} from './utils';
import { ToastBuilder } from './ToastBuilder';

/**
 * SVG Icons for different toast types
 */
const ICONS = {
  success: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
  info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>',
  close: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>'
};

/**
 * Get default animation direction based on position
 */
function getDefaultAnimationDirection(position: ToastPosition): AnimationDirection {
  switch (position) {
    case 'top-left':
    case 'bottom-left':
      return 'right-to-left';
    case 'top-right':
    case 'bottom-right':
      return 'left-to-right';
    case 'top-center':
      return 'bottom-to-top';
    case 'bottom-center':
      return 'top-to-bottom';
    default:
      return 'left-to-right';
  }
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<ToastConfig> = {
  position: 'bottom-right',
  maxVisibleStackToasts: STACK_CONFIG.DEFAULT_MAX_VISIBLE,
  stackOffsetY: STACK_CONFIG.DEFAULT_OFFSET_Y,
  stackOffsetX: STACK_CONFIG.DEFAULT_OFFSET_X,
  scaleDecrementPerLevel: STACK_CONFIG.DEFAULT_SCALE_DECREMENT,
  opacityDecrementPerLevel: STACK_CONFIG.DEFAULT_OPACITY_DECREMENT,
  maxRenderedToasts: STACK_CONFIG.DEFAULT_MAX_RENDERED,
  defaultDuration: ANIMATION_TIMING.DEFAULT_DURATION,
  animationDuration: ANIMATION_TIMING.DEFAULT_ANIMATION_DURATION,
  enableBorderAnimation: true,
  enableFillAnimation: true,
  animationDirection: getDefaultAnimationDirection('bottom-right'),
  customCSS: ''
};

/**
 * Default toast options
 */
const DEFAULT_TOAST_OPTIONS: Required<ToastOptions> = {
  autoDismiss: ANIMATION_TIMING.DEFAULT_DURATION,
  position: 'bottom-right',
  backgroundColor: '',
  textColor: '',
  borderColor: '',
  showCloseButton: true,
  pauseOnHover: true,
  className: '',
  icon: '',
  animationDirection: 'left-to-right'
};

/**
 * Toast type configurations - using working demo class names
 */
const TYPE_CONFIG = {
  [ToastType.Success]: {
    title: 'Success',
    ariaRole: 'status' as const,
    baseClass: 'toast-success',
    borderColorClass: 'border-success',
    fillColorClass: 'fill-success',
    iconColorClass: 'toast-icon-success'
  },
  [ToastType.Error]: {
    title: 'Error',
    ariaRole: 'alert' as const,
    baseClass: 'toast-error',
    borderColorClass: 'border-error',
    fillColorClass: 'fill-error',
    iconColorClass: 'toast-icon-error'
  },
  [ToastType.Info]: {
    title: 'Info',
    ariaRole: 'status' as const,
    baseClass: 'toast-info',
    borderColorClass: 'border-info',
    fillColorClass: 'fill-info',
    iconColorClass: 'toast-icon-info'
  },
  [ToastType.Warning]: {
    title: 'Warning',
    ariaRole: 'status' as const,
    baseClass: 'toast-warning',
    borderColorClass: 'border-warning',
    fillColorClass: 'fill-warning',
    iconColorClass: 'toast-icon-warning'
  }
};

/**
 * ModernToasts - A modern toast notification library
 * Implementation directly copied from working vanilla demo
 */
export class ModernToasts implements ModernToastsAPI {
  private config: Required<ToastConfig>;
  private toasts: ToastData[] = [];
  private container: HTMLElement | null = null;
  private containerInner: HTMLElement | null = null;
  private eventListeners: Map<ToastEvent, ToastEventCallback[]> = new Map();
  private isInitialized = false;

  constructor(config?: Partial<ToastConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.init();
  }

  /**
   * Initialize the toast system
   */
  private init(): void {
    if (this.isInitialized) {
      return;
    }

    // Inject CSS if not already present
    this.injectCSS();

    // Create container
    this.createContainer();

    // Set CSS custom properties
    this.updateCSSProperties();

    this.isInitialized = true;
  }

  /**
   * Inject CSS styles into the document
   */
  private injectCSS(): void {
    if (document.getElementById(DOM_CONFIG.STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = DOM_CONFIG.STYLE_ID;

    // CSS will be injected here during build process
    style.textContent = '/* CSS_PLACEHOLDER */';

    document.head.appendChild(style);

    // Inject custom CSS if provided
    if (this.config.customCSS) {
      const customStyle = document.createElement('style');
      customStyle.id = DOM_CONFIG.CUSTOM_STYLE_ID;
      customStyle.textContent = this.config.customCSS;
      document.head.appendChild(customStyle);
    }
  }

  /**
   * Create the toast container - Clean CSS class approach
   */
  private createContainer(): void {
    // Check if container already exists in DOM (shared across instances)
    const existingContainer = document.querySelector(`.${CSS_CLASSES.CONTAINER}`);
    if (existingContainer) {
      this.container = existingContainer as HTMLElement;
      this.containerInner = existingContainer.querySelector(`.${CSS_CLASSES.CONTAINER_INNER}`) as HTMLElement;
      return;
    }

    this.container = document.createElement('div');
    this.container.className = CSS_CLASSES.CONTAINER;
    this.container.setAttribute('aria-live', 'polite');

    this.containerInner = document.createElement('div');
    this.containerInner.className = CSS_CLASSES.CONTAINER_INNER;

    this.container.appendChild(this.containerInner);
    document.body.appendChild(this.container);

    // Set position using CSS classes
    this.updateContainerPosition();
  }

  /**
   * Update container position using CSS classes - Clean approach
   */
  private updateContainerPosition(): void {
    if (!this.container) {
      return;
    }

    // Remove all position classes
    POSITION_CLASSES.forEach(cls => {
      if (this.container) {
        this.container.classList.remove(cls);
      }
    });

    // Add the correct position class
    const positionClass = `position-${this.config.position}`;
    this.container.classList.add(positionClass);
  }

  /**
   * Update CSS custom properties
   */
  private updateCSSProperties(): void {
    const root = document.documentElement;
    root.style.setProperty('--duration', `${this.config.defaultDuration / 1000}s`);
  }

  /**
   * Update CSS duration for a specific toast
   */
  private updateToastAnimationDuration(toastEl: HTMLElement, duration: number): void {
    // Set animation duration to toast duration - 1 second (finish before close), or 3s default if no auto-dismiss
    const animationDuration = duration > ANIMATION_TIMING.DURATION_BUFFER
      ? (duration - ANIMATION_TIMING.DURATION_BUFFER) / 1000
      : duration > 0
        ? duration / 1000
        : ANIMATION_TIMING.DEFAULT_NO_DISMISS_DURATION / 1000;
    toastEl.style.setProperty('--duration', `${animationDuration}s`);
  }

  /**
   * Create toast element using the builder pattern
   */
  private createToastElement(toastData: ToastData): HTMLElement {
    const config = TYPE_CONFIG[toastData.type];

    const builder = new ToastBuilder(
      toastData,
      config,
      {
        animationDirection: this.config.animationDirection,
        enableBorderAnimation: this.config.enableBorderAnimation,
        enableFillAnimation: this.config.enableFillAnimation
      },
      ICONS
    );

    const toastEl = builder
      .addBorders()
      .addFillProgress()
      .addContent()
      .applyCustomStyles()
      .build();

    // Set up event listeners with proper cleanup
    this.setupToastEventListeners(toastData, toastEl);

    return toastEl;
  }

  /**
   * Set up event listeners for a toast with proper cleanup
   */
  private setupToastEventListeners(toastData: ToastData, toastEl: HTMLElement): void {
    // Close button listener
    const closeButton = toastEl.querySelector(`.${CSS_CLASSES.TOAST_CLOSE_BUTTON}`) as HTMLButtonElement;
    if (closeButton) {
      const closeListener = (e: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        this.removeToast(toastData.id);
      };

      closeButton.addEventListener('click', closeListener, { passive: false });
      closeButton.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });

      // Store references for cleanup
      toastData.closeButton = closeButton;
      toastData.closeButtonListener = closeListener;
    }

    // Pause on hover functionality
    if (toastData.options.pauseOnHover && toastData.options.autoDismiss > 0) {
      let remainingTime = toastData.options.autoDismiss;
      let _pauseStartTime: number;

      const mouseEnterListener = (): void => {
        if (toastData.timer) {
          clearTimeout(toastData.timer);
          _pauseStartTime = Date.now();
        }
      };

      const mouseLeaveListener = (): void => {
        if (toastData.options.autoDismiss > 0 && !toastData.isRemoving) {
          const elapsed = Date.now() - toastData.createdAt;
          remainingTime = Math.max(1000, toastData.options.autoDismiss - elapsed);

          toastData.timer = window.setTimeout(() => {
            this.removeToast(toastData.id);
          }, remainingTime);
        }
      };

      toastEl.addEventListener('mouseenter', mouseEnterListener);
      toastEl.addEventListener('mouseleave', mouseLeaveListener);

      // Store references for cleanup
      toastData.mouseEnterListener = mouseEnterListener;
      toastData.mouseLeaveListener = mouseLeaveListener;
    }
  }

  /**
   * Calculate position-aware stacking offsets
   */
  private calculateStackingOffsets(effectiveIndex: number): { xOffset: number; yOffset: number } {
    const baseXOffset = effectiveIndex * this.config.stackOffsetX;
    const baseYOffset = effectiveIndex * this.config.stackOffsetY;

    // Position-aware offset calculations
    switch (this.config.position) {
      case 'bottom-right':
        return { xOffset: baseXOffset, yOffset: baseYOffset };

      case 'bottom-left':
        return { xOffset: -baseXOffset, yOffset: baseYOffset }; // Flip X for left side

      case 'bottom-center':
        return { xOffset: 0, yOffset: baseYOffset }; // No X offset for center

      case 'top-right':
        return { xOffset: baseXOffset, yOffset: -baseYOffset }; // Flip Y for top

      case 'top-left':
        return { xOffset: -baseXOffset, yOffset: -baseYOffset }; // Flip both for top-left

      case 'top-center':
        return { xOffset: 0, yOffset: -baseYOffset }; // No X offset, flip Y for top

      default:
        return { xOffset: baseXOffset, yOffset: baseYOffset };
    }
  }

  /**
   * Update toast stack styles - CSS Variables approach with position-aware offsets
   */
  private updateToastStackStyles(): void {
    if (!this.containerInner) {
      return;
    }

    const toastsToStyle = this.toasts.slice(0, this.config.maxRenderedToasts);

    // Remove elements that are no longer in visible toasts
    const currentElements = Array.from(this.containerInner.children);
    currentElements.forEach(element => {
      const toastId = element.getAttribute('data-toast-id') || element.id;
      const stillExists = toastsToStyle.some(toast => toast.id === toastId);
      if (!stillExists) {
        element.remove();
      }
    });

    toastsToStyle.forEach((toast, index) => {
      if (!toast.element) {
        return;
      }

      const effectiveIndex = Math.min(index, this.config.maxVisibleStackToasts - 1);

      let currentOpacity = 1 - effectiveIndex * this.config.opacityDecrementPerLevel;
      let currentScale = 1 - effectiveIndex * this.config.scaleDecrementPerLevel;
      let { xOffset, yOffset } = this.calculateStackingOffsets(effectiveIndex);
      const zIndex = (toastsToStyle.length - index) * STACK_CONFIG.Z_INDEX_MULTIPLIER;

      // For toasts beyond the visible stack
      if (index >= this.config.maxVisibleStackToasts) {
        const hiddenStackIndex = index - (this.config.maxVisibleStackToasts - 1);
        currentOpacity = Math.max(0, (1 - (this.config.maxVisibleStackToasts - 1) * this.config.opacityDecrementPerLevel) - hiddenStackIndex * STACK_CONFIG.HIDDEN_OPACITY_DECREMENT);
        currentScale = 1 - (this.config.maxVisibleStackToasts - 1) * this.config.scaleDecrementPerLevel;
        const hiddenOffsets = this.calculateStackingOffsets(this.config.maxVisibleStackToasts - 1);
        xOffset = hiddenOffsets.xOffset;
        yOffset = hiddenOffsets.yOffset;
      }

      // Track visibility state
      const isVisible = toast.element.dataset.visible === 'true';
      const finalOpacity = isVisible ? Math.max(STACK_CONFIG.MIN_OPACITY, currentOpacity) : 0;

      // Use CSS custom properties instead of inline styles
      const toastEl = toast.element;
      toastEl.style.setProperty('--toast-opacity', finalOpacity.toString());
      toastEl.style.setProperty('--toast-scale', currentScale.toString());
      toastEl.style.setProperty('--toast-x-offset', `${xOffset}px`);
      toastEl.style.setProperty('--toast-y-offset', `${yOffset}px`);
      toastEl.style.setProperty('--toast-z-index', zIndex.toString());

      // Add visibility class instead of inline transform
      if (isVisible) {
        toastEl.classList.add(CSS_CLASSES.TOAST_VISIBLE);
        toastEl.classList.remove(CSS_CLASSES.TOAST_ENTERING);
      } else {
        toastEl.classList.remove(CSS_CLASSES.TOAST_VISIBLE);
        toastEl.classList.add(CSS_CLASSES.TOAST_ENTERING);
      }

      // Add to container if not already there
      if (this.containerInner && !this.containerInner.contains(toast.element)) {
        this.containerInner.appendChild(toast.element);
      }
    });
  }

  /**
   * Update animation classes for existing toasts
   */
  private updateAnimationClasses(): void {
    this.toasts.forEach(toast => {
      if (!toast.element) {
        return;
      }

      // Remove existing animation classes
      toast.element.classList.remove(CSS_CLASSES.NO_BORDER_ANIMATION, CSS_CLASSES.NO_FILL_ANIMATION);

      // Add animation disable classes if needed
      if (!this.config.enableBorderAnimation) {
        toast.element.classList.add(CSS_CLASSES.NO_BORDER_ANIMATION);
      }
      if (!this.config.enableFillAnimation) {
        toast.element.classList.add(CSS_CLASSES.NO_FILL_ANIMATION);
      }
    });
  }

  /**
   * Add toast with proper options handling
   */
  private addToast(message: string, type: ToastType, options: ToastOptions = {}): string {
    // Validate options
    validateToastOptions(options);

    const id = generateUniqueId();

    // Merge options with defaults, prioritizing passed options
    const mergedOptions: Required<ToastOptions> = {
      ...DEFAULT_TOAST_OPTIONS,
      ...options,
      // Use global config as fallback for animation direction
      animationDirection: options.animationDirection || this.config.animationDirection
    };

    const toastData: ToastData = {
      id,
      message,
      type,
      options: mergedOptions,
      createdAt: Date.now(),
      isRemoving: false,
      element: undefined,
      timer: undefined
    };

    const toastEl = this.createToastElement(toastData);
    toastData.element = toastEl;

    // Add to the beginning of the array (newest on top conceptually)
    this.toasts.unshift(toastData);

    // Limit rendered toasts
    if (this.toasts.length > this.config.maxRenderedToasts) {
      const oldestToast = this.toasts.pop(); // Remove from the end of array
      if (oldestToast && oldestToast.element) {
        oldestToast.element.remove(); // Remove from DOM immediately if over limit
      }
    }

    if (this.containerInner) {
      this.containerInner.appendChild(toastEl); // Append to DOM
    }

    // Set initial visibility state (like the working version)
    toastEl.dataset.visible = 'false';
    this.updateToastStackStyles(); // Apply initial stacking styles (opacity 0, scaled)

    // Set animation duration based on toast duration
    const duration = mergedOptions.autoDismiss !== undefined ? mergedOptions.autoDismiss : this.config.defaultDuration;
    this.updateToastAnimationDuration(toastEl, duration);

    // Trigger visibility change like the working version
    raf(() => {
      toastEl.dataset.visible = 'true';
      this.updateToastStackStyles(); // Re-apply stacking styles with visible state

      // Emit show event
      this.emit('show', toastData);
    });

    // Auto-close timer
    if (duration > 0) {
      toastData.timer = window.setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }

    return id;
  }

  /**
   * Remove toast with proper cleanup
   */
  private removeToast(id: string): void {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex === -1) {
      return;
    }

    const toastData = this.toasts[toastIndex];
    if (!toastData.element) {
      return;
    }

    // Prevent double-removal by marking as removing immediately
    if (toastData.isRemoving) {
      return;
    }
    toastData.isRemoving = true;

    // Clear auto-close timer if manually closed
    if (toastData.timer) {
      clearTimeout(toastData.timer);
      toastData.timer = undefined;
    }

    // Clean up event listeners
    this.cleanupToastEventListeners(toastData);

    // Emit dismiss event
    this.emit('dismiss', toastData);

    // Set visibility to false like the working version
    toastData.element.dataset.visible = 'false';
    this.updateToastStackStyles(); // Re-apply styles with invisible state

    // Remove from DOM after animation
    setTimeout(() => {
      // Remove element from DOM
      if (toastData.element && toastData.element.parentNode) {
        toastData.element.remove();
      }

      // Remove from array
      const currentIndex = this.toasts.findIndex(t => t.id === id);
      if (currentIndex !== -1) {
        this.toasts.splice(currentIndex, 1);
        // Re-render all remaining toasts with updated positions
        this.updateToastStackStyles();
      }
    }, ANIMATION_TIMING.EXIT_DURATION);
  }

  /**
   * Clean up event listeners for a toast
   */
  private cleanupToastEventListeners(toastData: ToastData): void {
    if (toastData.closeButton && toastData.closeButtonListener) {
      toastData.closeButton.removeEventListener('click', toastData.closeButtonListener);
    }

    if (toastData.element) {
      if (toastData.mouseEnterListener) {
        toastData.element.removeEventListener('mouseenter', toastData.mouseEnterListener);
      }
      if (toastData.mouseLeaveListener) {
        toastData.element.removeEventListener('mouseleave', toastData.mouseLeaveListener);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: ToastEvent, toast: ToastData): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(toast);
      } catch (error) {
        console.error('Error in toast event listener:', error);
      }
    });
  }

  /**
   * Show a toast notification
   */
  show(message: string, type: ToastType, options: ToastOptions = {}): string {
    return this.addToast(message, type, options);
  }

  /**
   * Show success toast
   */
  success(message: string, options?: ToastOptions): string {
    return this.show(message, ToastType.Success, options);
  }

  /**
   * Show error toast
   */
  error(message: string, options?: ToastOptions): string {
    return this.show(message, ToastType.Error, options);
  }

  /**
   * Show info toast
   */
  info(message: string, options?: ToastOptions): string {
    return this.show(message, ToastType.Info, options);
  }

  /**
   * Show warning toast
   */
  warning(message: string, options?: ToastOptions): string {
    return this.show(message, ToastType.Warning, options);
  }

  /**
   * Dismiss a specific toast
   */
  dismiss(id: string): void {
    this.removeToast(id);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll(): void {
    const toastIds = this.toasts.map(t => t.id);
    toastIds.forEach(id => this.dismiss(id));
  }

  /**
   * Update configuration
   */
  configure(config: Partial<ToastConfig>): void {
    // Validate configuration
    validateConfig(config);

    // If position is changing and no explicit animation direction is provided, set default
    if (config.position && config.animationDirection === undefined) {
      config.animationDirection = getDefaultAnimationDirection(config.position);
    }

    this.config = { ...this.config, ...config };

    // Update container position if changed
    if (config.position) {
      this.updateContainerPosition();
    }

    // Update CSS properties
    this.updateCSSProperties();

    // Re-calculate stacking styles if position or stacking config changed
    if (config.position || config.stackOffsetX !== undefined || config.stackOffsetY !== undefined ||
        config.scaleDecrementPerLevel !== undefined || config.opacityDecrementPerLevel !== undefined ||
        config.maxVisibleStackToasts !== undefined) {
      this.updateToastStackStyles();
    }

    // Update animation classes if animation settings changed
    if (config.enableBorderAnimation !== undefined || config.enableFillAnimation !== undefined) {
      this.updateAnimationClasses();
    }

    // Re-inject custom CSS if changed
    if (config.customCSS !== undefined) {
      const existingCustom = document.getElementById(DOM_CONFIG.CUSTOM_STYLE_ID);
      if (existingCustom) {
        existingCustom.remove();
      }

      if (this.config.customCSS) {
        const customStyle = document.createElement('style');
        customStyle.id = DOM_CONFIG.CUSTOM_STYLE_ID;
        customStyle.textContent = this.config.customCSS;
        document.head.appendChild(customStyle);
      }
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ToastConfig {
    return { ...this.config };
  }

  /**
   * Add event listener
   */
  on(event: ToastEvent, callback: ToastEventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.push(callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: ToastEvent, callback: ToastEventCallback): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Destroy the toast system
   */
  destroy(): void {
    // Clear all timers
    this.toasts.forEach(toast => {
      if (toast.timer) {
        clearTimeout(toast.timer);
      }
    });

    // Remove container
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.containerInner = null;
    }

    // Remove styles
    const styles = document.getElementById(DOM_CONFIG.STYLE_ID);
    if (styles) {
      styles.remove();
    }

    const customStyles = document.getElementById(DOM_CONFIG.CUSTOM_STYLE_ID);
    if (customStyles) {
      customStyles.remove();
    }

    // Clear data
    this.toasts = [];
    this.eventListeners.clear();
    this.isInitialized = false;
  }
}