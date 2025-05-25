/**
 * Animation timing constants
 */
export const ANIMATION_TIMING = {
  EXIT_DURATION: 300,
  DURATION_BUFFER: 1000,
  DEFAULT_NO_DISMISS_DURATION: 3000,
  DEFAULT_DURATION: 3000,
  DEFAULT_ANIMATION_DURATION: 350,
  VISIBILITY_DELAY: 0
} as const;

/**
 * Stack configuration constants
 */
export const STACK_CONFIG = {
  DEFAULT_MAX_VISIBLE: 3,
  DEFAULT_MAX_RENDERED: 5,
  DEFAULT_OFFSET_Y: 10,
  DEFAULT_OFFSET_X: 4,
  DEFAULT_SCALE_DECREMENT: 0.05,
  DEFAULT_OPACITY_DECREMENT: 0.2,
  MIN_OPACITY: 0.05,
  HIDDEN_OPACITY_DECREMENT: 0.15,
  Z_INDEX_MULTIPLIER: 10
} as const;

/**
 * CSS class names
 */
export const CSS_CLASSES = {
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
} as const;

/**
 * DOM constants
 */
export const DOM_CONFIG = {
  STYLE_ID: 'modern-toasts-styles',
  CUSTOM_STYLE_ID: 'modern-toasts-custom-styles',
  MIN_TOAST_HEIGHT: 70,
  CONTENT_MIN_HEIGHT: 60,
  BORDER_WIDTH: 2
} as const;

/**
 * Position class mappings
 */
export const POSITION_CLASSES = [
  'position-top-left',
  'position-top-center',
  'position-top-right',
  'position-bottom-left',
  'position-bottom-center',
  'position-bottom-right'
] as const;