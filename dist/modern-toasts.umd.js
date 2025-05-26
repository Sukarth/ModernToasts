(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ModernToasts = {}));
})(this, (function (exports) { 'use strict';

    /**
     * Toast types available in ModernToasts
     */
    exports.ToastType = void 0;
    (function (ToastType) {
        ToastType["Success"] = "success";
        ToastType["Error"] = "error";
        ToastType["Info"] = "info";
        ToastType["Warning"] = "warning";
    })(exports.ToastType || (exports.ToastType = {}));

    /**
     * Animation timing constants
     */
    const ANIMATION_TIMING = {
        EXIT_DURATION: 300,
        DURATION_BUFFER: 1000,
        DEFAULT_NO_DISMISS_DURATION: 3000,
        DEFAULT_DURATION: 3000,
        DEFAULT_ANIMATION_DURATION: 350};
    /**
     * Stack configuration constants
     */
    const STACK_CONFIG = {
        DEFAULT_MAX_VISIBLE: 3,
        DEFAULT_MAX_RENDERED: 5,
        DEFAULT_OFFSET_Y: 10,
        DEFAULT_OFFSET_X: 4,
        DEFAULT_SCALE_DECREMENT: 0.05,
        DEFAULT_OPACITY_DECREMENT: 0.2,
        MIN_OPACITY: 0.05,
        HIDDEN_OPACITY_DECREMENT: 0.15,
        Z_INDEX_MULTIPLIER: 10
    };
    /**
     * CSS class names
     */
    const CSS_CLASSES = {
        CONTAINER: 'toast-container',
        CONTAINER_INNER: 'toast-container-inner',
        TOAST: 'toast',
        TOAST_ENTERING: 'toast-entering',
        TOAST_VISIBLE: 'toast-visible',
        TOAST_CONTENT: 'toast-content',
        TOAST_ICON: 'toast-icon',
        TOAST_TEXT: 'toast-text',
        TOAST_TITLE: 'toast-title',
        TOAST_MESSAGE: 'toast-message',
        TOAST_CLOSE: 'toast-close',
        TOAST_CLOSE_BUTTON: 'toast-close-button',
        BORDER_ELEMENT: 'border-element',
        FILL_PROGRESS: 'fill-progress',
        NO_BORDER_ANIMATION: 'no-border-animation',
        NO_FILL_ANIMATION: 'no-fill-animation'
    };
    /**
     * DOM constants
     */
    const DOM_CONFIG = {
        STYLE_ID: 'modern-toasts-styles',
        CUSTOM_STYLE_ID: 'modern-toasts-custom-styles'};
    /**
     * Position class mappings
     */
    const POSITION_CLASSES = [
        'position-top-left',
        'position-top-center',
        'position-top-right',
        'position-bottom-left',
        'position-bottom-center',
        'position-bottom-right'
    ];

    /**
     * Sanitize HTML content to prevent XSS attacks
     */
    function sanitizeHtml(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
    /**
     * Validate toast options
     */
    function validateToastOptions(options) {
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
    function validateConfig(config) {
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
     * Create a unique ID for toasts
     */
    function generateUniqueId() {
        return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    /**
     * Request animation frame with fallback
     */
    const raf = window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : (callback) => window.setTimeout(callback, 16);
    /**
     * Cancel animation frame with fallback
     */
    window.cancelAnimationFrame
        ? window.cancelAnimationFrame.bind(window)
        : window.clearTimeout.bind(window);

    /**
     * Builder class for creating toast elements
     * Simplifies the complex toast creation logic
     */
    class ToastBuilder {
        constructor(toastData, typeConfig, globalConfig, icons) {
            this.toastData = toastData;
            this.config = typeConfig;
            this.animationDirection = toastData.options.animationDirection || globalConfig.animationDirection;
            this.enableBorderAnimation = globalConfig.enableBorderAnimation;
            this.enableFillAnimation = globalConfig.enableFillAnimation;
            this.icons = icons;
            this.fragment = document.createDocumentFragment();
            this.toastEl = this.createContainer();
        }
        /**
         * Create the main toast container
         */
        createContainer() {
            const toastEl = document.createElement('div');
            toastEl.id = this.toastData.id;
            const classes = [CSS_CLASSES.TOAST, this.config.baseClass];
            if (!this.enableBorderAnimation) {
                classes.push(CSS_CLASSES.NO_BORDER_ANIMATION);
            }
            if (!this.enableFillAnimation) {
                classes.push(CSS_CLASSES.NO_FILL_ANIMATION);
            }
            toastEl.className = classes.join(' ');
            toastEl.setAttribute('role', this.config.ariaRole);
            toastEl.setAttribute('data-toast-id', this.toastData.id);
            toastEl.setAttribute('data-animation-direction', this.animationDirection);
            return toastEl;
        }
        /**
         * Add border elements based on animation direction
         */
        addBorders() {
            const borders = this.createBorderElements();
            borders.forEach(border => this.fragment.appendChild(border));
            return this;
        }
        /**
         * Create border elements based on animation direction
         */
        createBorderElements() {
            const borders = [];
            const borderConfigs = this.getBorderConfigurations();
            borderConfigs.forEach(config => {
                const borderEl = document.createElement('div');
                borderEl.className = `${CSS_CLASSES.BORDER_ELEMENT} ${config.class} ${this.config.borderColorClass} animation-${this.animationDirection}`;
                // Apply initial styles
                Object.entries(config.initialStyles).forEach(([prop, value]) => {
                    borderEl.style.setProperty(prop, value);
                });
                borders.push(borderEl);
            });
            return borders;
        }
        /**
         * Get border configurations based on animation direction
         */
        getBorderConfigurations() {
            switch (this.animationDirection) {
                case 'top-to-bottom':
                    return [
                        { class: 'border-left-top', initialStyles: { height: '0%', top: '50%' } },
                        { class: 'border-left-bottom', initialStyles: { height: '0%', bottom: '50%' } },
                        { class: 'border-top', initialStyles: { width: '0%' } },
                        { class: 'border-right-top', initialStyles: { height: '0%', top: '0%' } },
                        { class: 'border-right-bottom', initialStyles: { height: '0%', bottom: '0%' } },
                        { class: 'border-bottom-left', initialStyles: { width: '0%' } },
                        { class: 'border-bottom-right', initialStyles: { width: '0%' } }
                    ];
                case 'bottom-to-top':
                    return [
                        { class: 'border-left-top', initialStyles: { height: '0%', bottom: '0%' } },
                        { class: 'border-bottom', initialStyles: { width: '0%' } },
                        { class: 'border-right-top', initialStyles: { height: '0%', bottom: '0%' } },
                        { class: 'border-top-left', initialStyles: { width: '0%' } },
                        { class: 'border-top-right', initialStyles: { width: '0%' } }
                    ];
                default: // left-to-right and right-to-left
                    return [
                        { class: 'border-left-top', initialStyles: { height: '0%', top: '50%' } },
                        { class: 'border-left-bottom', initialStyles: { height: '0%', bottom: '50%' } },
                        { class: 'border-top', initialStyles: { width: '0%' } },
                        { class: 'border-bottom', initialStyles: { width: '0%' } },
                        { class: 'border-right-top', initialStyles: { height: '0%', top: '0%' } },
                        { class: 'border-right-bottom', initialStyles: { height: '0%', bottom: '0%' } }
                    ];
            }
        }
        /**
         * Add fill progress element
         */
        addFillProgress() {
            const fillProgressEl = document.createElement('div');
            fillProgressEl.className = `${CSS_CLASSES.FILL_PROGRESS} ${this.config.fillColorClass} animation-${this.animationDirection}`;
            // Set initial styles based on animation direction
            if (this.animationDirection === 'top-to-bottom' || this.animationDirection === 'bottom-to-top') {
                fillProgressEl.style.height = '0%';
                fillProgressEl.style.width = '100%';
            }
            else {
                fillProgressEl.style.width = '0%';
            }
            this.fragment.appendChild(fillProgressEl);
            return this;
        }
        /**
         * Add toast content (icon, text, close button)
         */
        addContent() {
            const contentEl = document.createElement('div');
            contentEl.className = CSS_CLASSES.TOAST_CONTENT;
            // Add icon
            const iconContainer = this.createIcon();
            contentEl.appendChild(iconContainer);
            // Add text content
            const textContainer = this.createTextContent();
            contentEl.appendChild(textContainer);
            // Add close button
            if (this.toastData.options.showCloseButton) {
                const closeButtonContainer = this.createCloseButton();
                contentEl.appendChild(closeButtonContainer);
            }
            this.fragment.appendChild(contentEl);
            return this;
        }
        /**
         * Create icon element
         */
        createIcon() {
            const iconContainer = document.createElement('div');
            iconContainer.className = `${CSS_CLASSES.TOAST_ICON} ${this.config.iconColorClass}`;
            // Use custom icon if provided, otherwise use default
            const iconHtml = this.toastData.options.icon || this.icons[this.toastData.type];
            iconContainer.innerHTML = iconHtml;
            return iconContainer;
        }
        /**
         * Create text content
         */
        createTextContent() {
            const textContainer = document.createElement('div');
            textContainer.className = CSS_CLASSES.TOAST_TEXT;
            const titleEl = document.createElement('p');
            titleEl.className = CSS_CLASSES.TOAST_TITLE;
            titleEl.textContent = this.config.title;
            const messageEl = document.createElement('p');
            messageEl.className = CSS_CLASSES.TOAST_MESSAGE;
            messageEl.textContent = sanitizeHtml(this.toastData.message);
            textContainer.appendChild(titleEl);
            textContainer.appendChild(messageEl);
            return textContainer;
        }
        /**
         * Create close button
         */
        createCloseButton() {
            const closeButtonContainer = document.createElement('div');
            closeButtonContainer.className = CSS_CLASSES.TOAST_CLOSE;
            const closeButton = document.createElement('button');
            closeButton.className = CSS_CLASSES.TOAST_CLOSE_BUTTON;
            closeButton.setAttribute('aria-label', 'Close notification');
            closeButton.innerHTML = this.icons.close;
            // Store reference to the button for cleanup
            this.toastData.closeButton = closeButton;
            closeButtonContainer.appendChild(closeButton);
            return closeButtonContainer;
        }
        /**
         * Apply custom styles if provided
         */
        applyCustomStyles() {
            const { backgroundColor, textColor, borderColor } = this.toastData.options;
            if (backgroundColor) {
                this.toastEl.style.backgroundColor = backgroundColor;
            }
            if (textColor) {
                this.toastEl.style.color = textColor;
                // Store text color to apply after elements are added to DOM
                this.toastEl.setAttribute('data-custom-text-color', textColor);
            }
            if (borderColor) {
                this.toastEl.style.borderColor = borderColor;
                // Also update border elements
                const borderElements = this.fragment.querySelectorAll(`.${CSS_CLASSES.BORDER_ELEMENT}`);
                borderElements.forEach((el) => {
                    el.style.backgroundColor = borderColor;
                });
            }
            if (this.toastData.options.className) {
                this.toastEl.classList.add(this.toastData.options.className);
            }
            return this;
        }
        /**
         * Build and return the complete toast element
         */
        build() {
            // Append all fragments to the toast element
            this.toastEl.appendChild(this.fragment);
            // Apply custom text color after elements are in DOM
            const customTextColor = this.toastEl.getAttribute('data-custom-text-color');
            if (customTextColor) {
                const titleElement = this.toastEl.querySelector(`.${CSS_CLASSES.TOAST_TITLE}`);
                const messageElement = this.toastEl.querySelector(`.${CSS_CLASSES.TOAST_MESSAGE}`);
                if (titleElement) {
                    titleElement.style.color = customTextColor;
                }
                if (messageElement) {
                    messageElement.style.color = customTextColor;
                }
                // Remove the temporary attribute
                this.toastEl.removeAttribute('data-custom-text-color');
            }
            return this.toastEl;
        }
    }

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
    function getDefaultAnimationDirection(position) {
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
    const DEFAULT_CONFIG = {
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
        customCSS: '',
        pauseBackgroundToastsOnHover: true
    };
    /**
     * Default toast options
     */
    const DEFAULT_TOAST_OPTIONS = {
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
        [exports.ToastType.Success]: {
            title: 'Success',
            ariaRole: 'status',
            baseClass: 'toast-success',
            borderColorClass: 'border-success',
            fillColorClass: 'fill-success',
            iconColorClass: 'toast-icon-success'
        },
        [exports.ToastType.Error]: {
            title: 'Error',
            ariaRole: 'alert',
            baseClass: 'toast-error',
            borderColorClass: 'border-error',
            fillColorClass: 'fill-error',
            iconColorClass: 'toast-icon-error'
        },
        [exports.ToastType.Info]: {
            title: 'Info',
            ariaRole: 'status',
            baseClass: 'toast-info',
            borderColorClass: 'border-info',
            fillColorClass: 'fill-info',
            iconColorClass: 'toast-icon-info'
        },
        [exports.ToastType.Warning]: {
            title: 'Warning',
            ariaRole: 'status',
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
    class ModernToasts {
        constructor(config) {
            this.toasts = [];
            this.container = null;
            this.containerInner = null;
            this.eventListeners = new Map();
            this.isInitialized = false;
            this.config = { ...DEFAULT_CONFIG, ...config };
            this.init();
        }
        /**
         * Initialize the toast system
         */
        init() {
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
        injectCSS() {
            if (document.getElementById(DOM_CONFIG.STYLE_ID)) {
                return;
            }
            const style = document.createElement('style');
            style.id = DOM_CONFIG.STYLE_ID;
            // CSS will be injected here during build process
            style.textContent = `/* ModernToasts Core Styles - Copied from working demo */

/* Animation disable classes */
.no-border-animation .border-element {
  animation: none !important;
}

.no-fill-animation .fill-progress {
  animation: none !important;
}

/* Animation pause classes for hover functionality */
.toast-paused .border-element {
  animation-play-state: paused !important;
}

.toast-paused .fill-progress {
  animation-play-state: paused !important;
}

/* CSS Custom Properties for Configuration */
:root {
  --duration: 3s;
  --mt-animation-duration: 300ms;
  --mt-border-width: 2px;
  --mt-border-radius: 8px;
  --mt-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  --mt-font-size: 14px;
  --mt-z-index: 9999;
}

/* Animation Keyframes - Left to Right (Default) */
@keyframes fill-progress-left-to-right {
  0% {
    width: 0%;
  }

  6% {
    width: 0%;
  }

  100% {
    width: 150%;
  }
}

@keyframes border-top-left-to-right {
  0% {
    width: 0%;
  }

  10% {
    width: 0%;
  }

  70% {
    width: 100%;
  }

  100% {
    width: 100%;
  }
}

@keyframes border-bottom-left-to-right {
  0% {
    width: 0%;
  }

  10% {
    width: 0%;
  }

  70% {
    width: 100%;
  }

  100% {
    width: 100%;
  }
}

@keyframes border-left-top-left-to-right {
  0% {
    height: 0%;
    top: 50%;
  }

  15% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-left-bottom-left-to-right {
  0% {
    height: 0%;
    bottom: 50%;
  }

  15% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

@keyframes border-right-top-left-to-right {
  0% {
    height: 0%;
    top: 0%;
  }

  70% {
    height: 0%;
    top: 0%;
  }

  85% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-right-bottom-left-to-right {
  0% {
    height: 0%;
    bottom: 0%;
  }

  70% {
    height: 0%;
    bottom: 0%;
  }

  85% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

/* Animation Keyframes - Right to Left */
@keyframes fill-progress-right-to-left {
  0% {
    width: 0%;
  }

  6% {
    width: 0%;
  }

  100% {
    width: 150%;
  }
}

@keyframes border-top-right-to-left {
  0% {
    width: 0%;
    left: auto;
    right: 0;
  }

  10% {
    width: 0%;
    left: auto;
    right: 0;
  }

  70% {
    width: 100%;
    left: auto;
    right: 0;
  }

  100% {
    width: 100%;
    left: auto;
    right: 0;
  }
}

@keyframes border-bottom-right-to-left {
  0% {
    width: 0%;
    left: auto;
    right: 0;
  }

  10% {
    width: 0%;
    left: auto;
    right: 0;
  }

  70% {
    width: 100%;
    left: auto;
    right: 0;
  }

  100% {
    width: 100%;
    left: auto;
    right: 0;
  }
}

@keyframes border-right-top-right-to-left {
  0% {
    height: 0%;
    top: 50%;
  }

  15% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-right-bottom-right-to-left {
  0% {
    height: 0%;
    bottom: 50%;
  }

  15% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

@keyframes border-left-top-right-to-left {
  0% {
    height: 0%;
    top: 0%;
  }

  70% {
    height: 0%;
    top: 0%;
  }

  85% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-left-bottom-right-to-left {
  0% {
    height: 0%;
    bottom: 0%;
  }

  70% {
    height: 0%;
    bottom: 0%;
  }

  85% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

/* Animation Keyframes - Top to Bottom */
@keyframes fill-progress-top-to-bottom {
  0% {
    height: 0%;
  }

  6% {
    height: 0%;
  }

  100% {
    height: 150%;
  }
}

@keyframes border-left-top-to-bottom {
  0% {
    height: 0%;
    top: 0%;
  }

  15% {
    height: 0%;
    top: 0%;
  }

  30% {
    height: 50%;
    top: 0%;
  }

  70% {
    height: 100%;
    top: 0%;
  }

  100% {
    height: 100%;
    top: 0%;
  }
}

@keyframes border-right-top-to-bottom {
  0% {
    height: 0%;
    top: 0%;
  }

  15% {
    height: 0%;
    top: 0%;
  }

  30% {
    height: 50%;
    top: 0%;
  }

  70% {
    height: 100%;
    top: 0%;
  }

  100% {
    height: 100%;
    top: 0%;
  }
}

@keyframes border-top-top-to-bottom {
  0% {
    width: 0%;
    left: 50%;
    transform: translateX(-50%);
  }

  15% {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  100% {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
}

@keyframes border-bottom-left-top-to-bottom {
  0% {
    width: 0%;
    left: 0%;
  }

  70% {
    width: 0%;
    left: 0%;
  }

  85% {
    width: 50%;
    left: 0%;
  }

  100% {
    width: 50%;
    left: 0%;
  }
}

@keyframes border-bottom-right-top-to-bottom {
  0% {
    width: 0%;
    right: 0%;
  }

  70% {
    width: 0%;
    right: 0%;
  }

  85% {
    width: 50%;
    right: 0%;
  }

  100% {
    width: 50%;
    right: 0%;
  }
}

/* Animation Keyframes - Bottom to Top */
@keyframes fill-progress-bottom-to-top {
  0% {
    height: 0%;
    top: 100%;
  }

  6% {
    height: 0%;
    top: 100%;
  }

  100% {
    height: 150%;
    top: -50%;
  }
}

@keyframes border-left-top-bottom-to-top {
  0% {
    height: 0%;
    bottom: 0%;
  }

  15% {
    height: 0%;
    bottom: 0%;
  }

  30% {
    height: 50%;
    bottom: 0%;
  }

  70% {
    height: 100%;
    bottom: 0%;
  }

  100% {
    height: 100%;
    bottom: 0%;
  }
}

@keyframes border-left-bottom-bottom-to-top {
  0% {
    height: 0%;
    top: 0%;
  }

  15% {
    height: 0%;
    top: 0%;
  }

  30% {
    height: 50%;
    top: 0%;
  }

  70% {
    height: 100%;
    top: 0%;
  }

  100% {
    height: 100%;
    top: 0%;
  }
}

@keyframes border-right-top-bottom-to-top {
  0% {
    height: 0%;
    bottom: 0%;
  }

  15% {
    height: 0%;
    bottom: 0%;
  }

  30% {
    height: 50%;
    bottom: 0%;
  }

  70% {
    height: 100%;
    bottom: 0%;
  }

  100% {
    height: 100%;
    bottom: 0%;
  }
}

@keyframes border-right-bottom-bottom-to-top {
  0% {
    height: 0%;
    top: 0%;
  }

  15% {
    height: 0%;
    top: 0%;
  }

  30% {
    height: 50%;
    top: 0%;
  }

  70% {
    height: 100%;
    top: 0%;
  }

  100% {
    height: 100%;
    top: 0%;
  }
}

@keyframes border-bottom-bottom-to-top {
  0% {
    width: 0%;
    left: 50%;
    transform: translateX(-50%);
  }

  15% {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  100% {
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
}

@keyframes border-top-left-bottom-to-top {
  0% {
    width: 0%;
    left: 0%;
  }

  70% {
    width: 0%;
    left: 0%;
  }

  85% {
    width: 50%;
    left: 0%;
  }

  100% {
    width: 50%;
    left: 0%;
  }
}

@keyframes border-top-right-bottom-to-top {
  0% {
    width: 0%;
    right: 0%;
  }

  70% {
    width: 0%;
    right: 0%;
  }

  85% {
    width: 50%;
    right: 0%;
  }

  100% {
    width: 50%;
    right: 0%;
  }
}

/* Legacy animations for backward compatibility */
@keyframes fill-progress {
  0% {
    width: 0%;
  }

  6% {
    width: 0%;
  }

  100% {
    width: 150%;
  }
}

@keyframes border-top {
  0% {
    width: 0%;
  }

  10% {
    width: 0%;
  }

  70% {
    width: 100%;
  }

  100% {
    width: 100%;
  }
}

@keyframes border-bottom {
  0% {
    width: 0%;
  }

  10% {
    width: 0%;
  }

  70% {
    width: 100%;
  }

  100% {
    width: 100%;
  }
}

@keyframes border-left-top {
  0% {
    height: 0%;
    top: 50%;
  }

  15% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-left-bottom {
  0% {
    height: 0%;
    bottom: 50%;
  }

  15% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

@keyframes border-right-top {
  0% {
    height: 0%;
    top: 0%;
  }

  70% {
    height: 0%;
    top: 0%;
  }

  85% {
    height: 50%;
    top: 0%;
  }

  100% {
    height: 50%;
    top: 0%;
  }
}

@keyframes border-right-bottom {
  0% {
    height: 0%;
    bottom: 0%;
  }

  70% {
    height: 0%;
    bottom: 0%;
  }

  85% {
    height: 50%;
    bottom: 0%;
  }

  100% {
    height: 50%;
    bottom: 0%;
  }
}

/* Toast Container Styles - CSS Variables Approach */
:root {
  --toast-container-top: auto;
  --toast-container-bottom: 1rem;
  --toast-container-left: auto;
  --toast-container-right: 1rem;
  --toast-container-transform: none;
  --toast-container-width: calc(100% - 2rem);
  --toast-container-max-width: 20rem;
}

@media (min-width: 768px) {
  :root {
    --toast-container-bottom: 1.5rem;
    --toast-container-right: 1.5rem;
    --toast-container-width: calc(100% - 3rem);
    --toast-container-max-width: 24rem;
  }
}

.toast-container {
  position: fixed;
  z-index: var(--mt-z-index);
  pointer-events: none;
  font-family: var(--mt-font-family);
  font-size: var(--mt-font-size);

  /* Dynamic positioning via CSS variables */
  top: var(--toast-container-top);
  bottom: var(--toast-container-bottom);
  left: var(--toast-container-left);
  right: var(--toast-container-right);
  transform: var(--toast-container-transform);
  width: var(--toast-container-width);
  max-width: var(--toast-container-max-width);
}

/* Position Classes - Clean approach */
.toast-container.position-top-left {
  --toast-container-top: 1rem;
  --toast-container-bottom: auto;
  --toast-container-left: 1rem;
  --toast-container-right: auto;
  --toast-container-transform: none;
}

.toast-container.position-top-center {
  --toast-container-top: 1rem;
  --toast-container-bottom: auto;
  --toast-container-left: 50%;
  --toast-container-right: auto;
  --toast-container-transform: translateX(-50%);
}

.toast-container.position-top-right {
  --toast-container-top: 1rem;
  --toast-container-bottom: auto;
  --toast-container-left: auto;
  --toast-container-right: 1rem;
  --toast-container-transform: none;
}

.toast-container.position-bottom-left {
  --toast-container-top: auto;
  --toast-container-bottom: 1rem;
  --toast-container-left: 1rem;
  --toast-container-right: auto;
  --toast-container-transform: none;
}

.toast-container.position-bottom-center {
  --toast-container-top: auto;
  --toast-container-bottom: 1rem;
  --toast-container-left: 50%;
  --toast-container-right: auto;
  --toast-container-transform: translateX(-50%);
}

.toast-container.position-bottom-right {
  --toast-container-top: auto;
  --toast-container-bottom: 1rem;
  --toast-container-left: auto;
  --toast-container-right: 1rem;
  --toast-container-transform: none;
}

/* Enhanced spacing for larger screens */
@media (min-width: 768px) {
  .toast-container.position-top-left {
    --toast-container-top: 1.5rem;
    --toast-container-left: 1.5rem;
  }

  .toast-container.position-top-center {
    --toast-container-top: 1.5rem;
  }

  .toast-container.position-top-right {
    --toast-container-top: 1.5rem;
    --toast-container-right: 1.5rem;
  }

  .toast-container.position-bottom-left {
    --toast-container-bottom: 1.5rem;
    --toast-container-left: 1.5rem;
  }

  .toast-container.position-bottom-center {
    --toast-container-bottom: 1.5rem;
  }

  .toast-container.position-bottom-right {
    --toast-container-bottom: 1.5rem;
    --toast-container-right: 1.5rem;
  }
}

.toast-container-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Toast Styles - Fixed stacking approach */
.toast {
  pointer-events: auto;
  width: 100%;
  border-radius: var(--mt-border-radius);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: absolute;
  background-color: #111827;
  color: white;
  transition: opacity var(--mt-animation-duration) ease-out, transform var(--mt-animation-duration) ease-out;
  will-change: transform, opacity;
  min-height: 70px;

  /* CSS Variables for dynamic stacking */
  --toast-opacity: 0;
  --toast-scale: 1;
  --toast-x-offset: 0px;
  --toast-y-offset: 0px;
  --toast-z-index: 1000;

  /* Apply variables for stacking */
  opacity: var(--toast-opacity);
  transform: translate(calc(-1 * var(--toast-x-offset)), calc(-1 * var(--toast-y-offset))) scale(var(--toast-scale));
  z-index: var(--toast-z-index);
}

/* Position toasts within container based on container position */
.toast-container.position-bottom-left .toast {
  bottom: 0;
  left: 0;
  transform-origin: bottom left;
}

.toast-container.position-bottom-center .toast {
  bottom: 0;
  left: 0;
  transform-origin: bottom center;
}

.toast-container.position-bottom-right .toast {
  bottom: 0;
  left: 0;
  transform-origin: bottom right;
}

.toast-container.position-top-left .toast {
  top: 0;
  left: 0;
  transform-origin: top left;
}

.toast-container.position-top-center .toast {
  top: 0;
  left: 0;
  transform-origin: top center;
}

.toast-container.position-top-right .toast {
  top: 0;
  left: 0;
  transform-origin: top right;
}

/* Visibility states using classes - Simplified */
.toast.toast-entering {
  --toast-opacity: 0;
  transform: translate(calc(-1 * var(--toast-x-offset)), calc(-1 * var(--toast-y-offset))) scale(calc(var(--toast-scale) * 0.9)) translateY(20px);
}

.toast.toast-visible {
  /* Opacity is controlled by --toast-opacity variable */
  transform: translate(calc(-1 * var(--toast-x-offset)), calc(-1 * var(--toast-y-offset))) scale(var(--toast-scale));
}

/* Specific toast type borders */
.toast-success {
  border: 1px solid rgba(34, 197, 94, 0.5);
}

.toast-error {
  border: 1px solid rgba(239, 68, 68, 0.5);
}

.toast-info {
  border: 1px solid rgba(59, 130, 246, 0.5);
}

.toast-warning {
  border: 1px solid rgba(234, 179, 8, 0.5);
}

.toast-content {
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  z-index: 10;
  pointer-events: auto;
  min-height: 60px;
  gap: 0.75rem;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
}

.toast-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.toast-icon-success svg {
  color: #22c55e;
}

.toast-icon-error svg {
  color: #ef4444;
}

.toast-icon-info svg {
  color: #3b82f6;
}

.toast-icon-warning svg {
  color: #eab308;
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  margin: 0;
  line-height: 1.4;
}

.toast-message {
  margin: 0.125rem 0 0 0;
  font-size: 0.875rem;
  color: white;
  opacity: 0.9;
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  pointer-events: auto;
}

.toast-close-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.375rem;
  color: #9ca3af;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  pointer-events: auto !important;
  position: relative;
  z-index: 9999;
  will-change: auto;
  transform: translateZ(0);
}

.toast-close-button:hover {
  background-color: #374151;
  color: white;
}

.toast-close-button:focus,
.toast-close-button:focus-visible {
  outline: 2px solid #6b7280;
  outline-offset: 1px;
}

.toast-close-button svg {
  width: 1rem;
  height: 1rem;
}

/* Border Animation Elements - With direction support */
.border-element {
  position: absolute;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

/* Left to Right animations (default) */
.border-left-top.animation-left-to-right {
  left: 0;
  width: 2px;
  animation-name: border-left-top-left-to-right;
}

.border-left-bottom.animation-left-to-right {
  left: 0;
  width: 2px;
  animation-name: border-left-bottom-left-to-right;
}

.border-top.animation-left-to-right {
  top: 0;
  left: 0;
  height: 2px;
  animation-name: border-top-left-to-right;
}

.border-bottom.animation-left-to-right {
  bottom: 0;
  left: 0;
  height: 2px;
  animation-name: border-bottom-left-to-right;
}

.border-right-top.animation-left-to-right {
  right: 0;
  width: 2px;
  animation-name: border-right-top-left-to-right;
}

.border-right-bottom.animation-left-to-right {
  right: 0;
  width: 2px;
  animation-name: border-right-bottom-left-to-right;
}

.fill-progress.animation-left-to-right {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0%;
  animation-name: fill-progress-left-to-right;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  z-index: 1;
}

/* Right to Left animations */
.border-left-top.animation-right-to-left {
  left: 0;
  width: 2px;
  animation-name: border-left-top-right-to-left;
}

.border-left-bottom.animation-right-to-left {
  left: 0;
  width: 2px;
  animation-name: border-left-bottom-right-to-left;
}

.border-top.animation-right-to-left {
  top: 0;
  left: auto;
  right: 0;
  height: 2px;
  animation-name: border-top-right-to-left;
}

.border-bottom.animation-right-to-left {
  bottom: 0;
  left: auto;
  right: 0;
  height: 2px;
  animation-name: border-bottom-right-to-left;
}

.border-right-top.animation-right-to-left {
  right: 0;
  width: 2px;
  animation-name: border-right-top-right-to-left;
}

.border-right-bottom.animation-right-to-left {
  right: 0;
  width: 2px;
  animation-name: border-right-bottom-right-to-left;
}

.fill-progress.animation-right-to-left {
  position: absolute;
  top: 0;
  left: auto;
  right: 0;
  bottom: 0;
  width: 0%;
  animation-name: fill-progress-right-to-left;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  z-index: 1;
  transform-origin: right;
}

/* Top to Bottom animations */
.border-left-top.animation-top-to-bottom,
.border-left-bottom.animation-top-to-bottom {
  left: 0;
  width: 2px;
  animation-name: border-left-top-to-bottom;
}

.border-right-top.animation-top-to-bottom,
.border-right-bottom.animation-top-to-bottom {
  right: 0;
  width: 2px;
  animation-name: border-right-top-to-bottom;
}

.border-top.animation-top-to-bottom {
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  animation-name: border-top-top-to-bottom;
}

.border-bottom-left.animation-top-to-bottom {
  bottom: 0;
  left: 0;
  height: 2px;
  animation-name: border-bottom-left-top-to-bottom;
}

.border-bottom-right.animation-top-to-bottom {
  bottom: 0;
  right: 0;
  height: 2px;
  animation-name: border-bottom-right-top-to-bottom;
}

.fill-progress.animation-top-to-bottom {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0%;
  width: 100%;
  animation-name: fill-progress-top-to-bottom;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  z-index: 1;
}

/* Bottom to Top animations */
.border-left-top.animation-bottom-to-top {
  left: 0;
  width: 2px;
  animation-name: border-left-top-bottom-to-top;
}

.border-left-bottom.animation-bottom-to-top {
  left: 0;
  width: 2px;
  animation-name: border-left-bottom-bottom-to-top;
}

.border-right-top.animation-bottom-to-top {
  right: 0;
  width: 2px;
  animation-name: border-right-top-bottom-to-top;
}

.border-right-bottom.animation-bottom-to-top {
  right: 0;
  width: 2px;
  animation-name: border-right-bottom-bottom-to-top;
}

.border-bottom.animation-bottom-to-top {
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  animation-name: border-bottom-bottom-to-top;
}

.border-top-left.animation-bottom-to-top {
  top: 0;
  left: 0;
  height: 2px;
  animation-name: border-top-left-bottom-to-top;
}

.border-top-right.animation-bottom-to-top {
  top: 0;
  right: 0;
  height: 2px;
  animation-name: border-top-right-bottom-to-top;
}

.fill-progress.animation-bottom-to-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0%;
  width: 100%;
  animation-name: fill-progress-bottom-to-top;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  z-index: 1;
  transform-origin: bottom;
}

/* Legacy classes for backward compatibility */
.border-left-top {
  left: 0;
  width: 2px;
  animation-name: border-left-top;
}

.border-left-bottom {
  left: 0;
  width: 2px;
  animation-name: border-left-bottom;
}

.border-top {
  top: 0;
  left: 0;
  height: 2px;
  animation-name: border-top;
}

.border-bottom {
  bottom: 0;
  left: 0;
  height: 2px;
  animation-name: border-bottom;
}

.border-right-top {
  right: 0;
  width: 2px;
  animation-name: border-right-top;
}

.border-right-bottom {
  right: 0;
  width: 2px;
  animation-name: border-right-bottom;
}

.fill-progress {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 0%;
  animation-name: fill-progress;
  animation-duration: var(--duration);
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  z-index: 1;
}

/* Border Colors */
.border-success {
  background-color: rgba(34, 197, 94, 0.5);
}

.border-error {
  background-color: rgba(239, 68, 68, 0.5);
}

.border-info {
  background-color: rgba(59, 130, 246, 0.5);
}

.border-warning {
  background-color: rgba(234, 179, 8, 0.5);
}

/* Fill Colors - Left to Right (default) */
.fill-success.animation-left-to-right,
.fill-success {
  background: linear-gradient(to right, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2), transparent);
}

.fill-error.animation-left-to-right,
.fill-error {
  background: linear-gradient(to right, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2), transparent);
}

.fill-info.animation-left-to-right,
.fill-info {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2), transparent);
}

.fill-warning.animation-left-to-right,
.fill-warning {
  background: linear-gradient(to right, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.2), transparent);
}

/* Fill Colors - Right to Left */
.fill-success.animation-right-to-left {
  background: linear-gradient(to left, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2), transparent);
}

.fill-error.animation-right-to-left {
  background: linear-gradient(to left, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2), transparent);
}

.fill-info.animation-right-to-left {
  background: linear-gradient(to left, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2), transparent);
}

.fill-warning.animation-right-to-left {
  background: linear-gradient(to left, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.2), transparent);
}

/* Fill Colors - Top to Bottom */
.fill-success.animation-top-to-bottom {
  background: linear-gradient(to bottom, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2), transparent);
}

.fill-error.animation-top-to-bottom {
  background: linear-gradient(to bottom, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2), transparent);
}

.fill-info.animation-top-to-bottom {
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2), transparent);
}

.fill-warning.animation-top-to-bottom {
  background: linear-gradient(to bottom, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.2), transparent);
}

/* Fill Colors - Bottom to Top */
.fill-success.animation-bottom-to-top {
  background: linear-gradient(to top, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.2), transparent);
}

.fill-error.animation-bottom-to-top {
  background: linear-gradient(to top, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.2), transparent);
}

.fill-info.animation-bottom-to-top {
  background: linear-gradient(to top, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.2), transparent);
}

.fill-warning.animation-bottom-to-top {
  background: linear-gradient(to top, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.2), transparent);
}`;
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
        createContainer() {
            // Check if container already exists in DOM (shared across instances)
            const existingContainer = document.querySelector(`.${CSS_CLASSES.CONTAINER}`);
            if (existingContainer) {
                this.container = existingContainer;
                this.containerInner = existingContainer.querySelector(`.${CSS_CLASSES.CONTAINER_INNER}`);
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
        updateContainerPosition() {
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
        updateCSSProperties() {
            const root = document.documentElement;
            root.style.setProperty('--duration', `${this.config.defaultDuration / 1000}s`);
        }
        /**
         * Update CSS duration for a specific toast
         */
        updateToastAnimationDuration(toastEl, duration) {
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
        createToastElement(toastData) {
            const config = TYPE_CONFIG[toastData.type];
            const builder = new ToastBuilder(toastData, config, {
                animationDirection: this.config.animationDirection,
                enableBorderAnimation: this.config.enableBorderAnimation,
                enableFillAnimation: this.config.enableFillAnimation
            }, ICONS);
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
        setupToastEventListeners(toastData, toastEl) {
            // Close button listener
            const closeButton = toastEl.querySelector(`.${CSS_CLASSES.TOAST_CLOSE_BUTTON}`);
            if (closeButton) {
                const closeListener = (e) => {
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
                const mouseEnterListener = () => {
                    // Pause current toast timer
                    if (toastData.timer) {
                        clearTimeout(toastData.timer);
                        // Calculate remaining time based on current state
                        if (toastData.pausedRemainingTime) ;
                        else {
                            // First time pausing, calculate from creation time
                            const elapsed = Date.now() - toastData.createdAt;
                            toastData.pausedRemainingTime = Math.max(1000, toastData.options.autoDismiss - elapsed);
                        }
                        toastData.pausedAt = Date.now();
                        toastData.timer = undefined;
                    }
                    // Pause animations by adding CSS class to current toast
                    toastEl.classList.add('toast-paused');
                    // Pause background toasts if configured to do so
                    if (this.config.pauseBackgroundToastsOnHover) {
                        this.pauseBackgroundToasts(toastData.id);
                    }
                };
                const mouseLeaveListener = () => {
                    // Resume current toast timer
                    if (toastData.pausedRemainingTime && !toastData.isRemoving && toastData.options.autoDismiss > 0) {
                        const remainingTime = toastData.pausedRemainingTime;
                        toastData.timer = window.setTimeout(() => {
                            this.removeToast(toastData.id);
                        }, remainingTime);
                        // Update the creation time to maintain consistency for future calculations
                        // New "virtual" creation time = now - (original duration - remaining time)
                        toastData.createdAt = Date.now() - (toastData.options.autoDismiss - remainingTime);
                        // Clear pause tracking
                        toastData.pausedRemainingTime = undefined;
                        toastData.pausedAt = undefined;
                    }
                    // Resume animations by removing CSS class from current toast
                    toastEl.classList.remove('toast-paused');
                    // Resume background toasts if configured to do so
                    if (this.config.pauseBackgroundToastsOnHover) {
                        this.resumeBackgroundToasts(toastData.id);
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
        calculateStackingOffsets(effectiveIndex) {
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
        updateToastStackStyles() {
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
                }
                else {
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
        updateAnimationClasses() {
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
        addToast(message, type, options = {}) {
            // Validate options
            validateToastOptions(options);
            const id = generateUniqueId();
            // Merge options with defaults, prioritizing passed options
            const mergedOptions = {
                ...DEFAULT_TOAST_OPTIONS,
                ...options,
                // Use global config as fallback for animation direction
                animationDirection: options.animationDirection || this.config.animationDirection
            };
            const toastData = {
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
        removeToast(id) {
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
            // Clean up pause tracking data
            toastData.pausedRemainingTime = undefined;
            toastData.pausedAt = undefined;
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
        cleanupToastEventListeners(toastData) {
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
         * Pause background toasts (all toasts except the hovered one)
         */
        pauseBackgroundToasts(hoveredToastId) {
            this.toasts.forEach(toast => {
                if (toast.id !== hoveredToastId && toast.element && toast.options.pauseOnHover && toast.options.autoDismiss > 0) {
                    // Pause animations
                    toast.element.classList.add('toast-paused');
                    // Pause timer if it exists
                    if (toast.timer) {
                        clearTimeout(toast.timer);
                        // Calculate remaining time based on current state
                        if (toast.pausedRemainingTime) ;
                        else {
                            // First time pausing, calculate from creation time
                            const elapsed = Date.now() - toast.createdAt;
                            toast.pausedRemainingTime = Math.max(1000, toast.options.autoDismiss - elapsed);
                        }
                        toast.pausedAt = Date.now();
                        toast.timer = undefined;
                    }
                }
            });
        }
        /**
         * Resume background toasts (all toasts except the hovered one)
         */
        resumeBackgroundToasts(hoveredToastId) {
            this.toasts.forEach(toast => {
                if (toast.id !== hoveredToastId && toast.element && toast.options.pauseOnHover && toast.options.autoDismiss > 0) {
                    // Resume animations
                    toast.element.classList.remove('toast-paused');
                    // Resume timer if it was paused
                    if (toast.pausedRemainingTime && !toast.isRemoving) {
                        const remainingTime = toast.pausedRemainingTime;
                        toast.timer = window.setTimeout(() => {
                            this.removeToast(toast.id);
                        }, remainingTime);
                        // Update the creation time to maintain consistency for future calculations
                        // New "virtual" creation time = now - (original duration - remaining time)
                        toast.createdAt = Date.now() - (toast.options.autoDismiss - remainingTime);
                        // Clean up pause tracking
                        toast.pausedRemainingTime = undefined;
                        toast.pausedAt = undefined;
                    }
                }
            });
        }
        /**
         * Emit event to listeners
         */
        emit(event, toast) {
            const listeners = this.eventListeners.get(event) || [];
            listeners.forEach(callback => {
                try {
                    callback(toast);
                }
                catch (error) {
                    console.error('Error in toast event listener:', error);
                }
            });
        }
        /**
         * Show a toast notification
         */
        show(message, type, options = {}) {
            return this.addToast(message, type, options);
        }
        /**
         * Show success toast
         */
        success(message, options) {
            return this.show(message, exports.ToastType.Success, options);
        }
        /**
         * Show error toast
         */
        error(message, options) {
            return this.show(message, exports.ToastType.Error, options);
        }
        /**
         * Show info toast
         */
        info(message, options) {
            return this.show(message, exports.ToastType.Info, options);
        }
        /**
         * Show warning toast
         */
        warning(message, options) {
            return this.show(message, exports.ToastType.Warning, options);
        }
        /**
         * Dismiss a specific toast
         */
        dismiss(id) {
            this.removeToast(id);
        }
        /**
         * Dismiss all toasts
         */
        dismissAll() {
            const toastIds = this.toasts.map(t => t.id);
            toastIds.forEach(id => this.dismiss(id));
        }
        /**
         * Update configuration
         */
        configure(config) {
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
        getConfig() {
            return { ...this.config };
        }
        /**
         * Add event listener
         */
        on(event, callback) {
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
        off(event, callback) {
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
        destroy() {
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

    // Create a default instance for simple usage
    const defaultInstance = new ModernToasts();
    /**
     * Simple toast API - can be used directly without creating an instance
     */
    const toast = {
        /**
         * Show a success toast
         */
        success: (message, options) => {
            return defaultInstance.success(message, options);
        },
        /**
         * Show an error toast
         */
        error: (message, options) => {
            return defaultInstance.error(message, options);
        },
        /**
         * Show an info toast
         */
        info: (message, options) => {
            return defaultInstance.info(message, options);
        },
        /**
         * Show a warning toast
         */
        warning: (message, options) => {
            return defaultInstance.warning(message, options);
        },
        /**
         * Show a custom toast
         */
        show: (message, type, options) => {
            return defaultInstance.show(message, type, options);
        },
        /**
         * Dismiss a specific toast by ID
         */
        dismiss: (id) => {
            defaultInstance.dismiss(id);
        },
        /**
         * Dismiss all toasts
         */
        dismissAll: () => {
            defaultInstance.dismissAll();
        },
        /**
         * Configure the default toast instance
         */
        configure: (config) => {
            defaultInstance.configure(config);
        },
        /**
         * Get current configuration
         */
        getConfig: () => {
            return defaultInstance.getConfig();
        },
        /**
         * Create a new ModernToasts instance with custom configuration
         */
        create: (config) => {
            return new ModernToasts(config);
        }
    };
    // For script tag usage - attach to window
    if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        window.ModernToasts = {
            toast,
            ModernToasts,
            ToastType: exports.ToastType
        };
    }

    exports.ModernToasts = ModernToasts;
    exports.default = toast;
    exports.toast = toast;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
