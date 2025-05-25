# ModernToasts API Documentation

Complete API reference for ModernToasts library.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Methods](#api-methods)
- [Configuration](#configuration)
- [Types](#types)
- [Events](#events)
- [Examples](#examples)

## Installation

```bash
npm install modern-toasts
```

## Basic Usage

### ES Modules

```javascript
import toast from 'modern-toasts';

toast.success('Hello World!');
```

### Script Tag

```html
<script src="https://unpkg.com/modern-toasts@latest/dist/modern-toasts.min.js"></script>
<script>
  const { toast } = window.ModernToasts;
  toast.success('Hello World!');
</script>
```

## API Methods

### Toast Display Methods

#### `toast.success(message, options?)`

Display a success toast notification.

**Parameters:**

- `message` (string): The message to display
- `options` (ToastOptions, optional): Configuration options

**Returns:** `string` - Unique toast ID

**Example:**

```javascript
const id = toast.success('Operation completed successfully!', {
  autoDismiss: 5000,
  position: 'top-right'
});
```

#### `toast.error(message, options?)`

Display an error toast notification.

**Parameters:**

- `message` (string): The error message to display
- `options` (ToastOptions, optional): Configuration options

**Returns:** `string` - Unique toast ID

**Example:**

```javascript
toast.error('Something went wrong!', {
  autoDismiss: 0, // Won't auto-dismiss
  backgroundColor: '#dc2626'
});
```

#### `toast.info(message, options?)`

Display an info toast notification.

**Parameters:**

- `message` (string): The info message to display
- `options` (ToastOptions, optional): Configuration options

**Returns:** `string` - Unique toast ID

**Example:**

```javascript
toast.info('Here is some useful information', {
  icon: '<svg>...</svg>', // Custom icon
  className: 'my-custom-toast'
});
```

#### `toast.warning(message, options?)`

Display a warning toast notification.

**Parameters:**

- `message` (string): The warning message to display
- `options` (ToastOptions, optional): Configuration options

**Returns:** `string` - Unique toast ID

**Example:**

```javascript
toast.warning('Please review your input', {
  pauseOnHover: false,
  borderColor: '#f59e0b'
});
```

### Management Methods

#### `toast.dismiss(id)`

Dismiss a specific toast by its ID.

**Parameters:**

- `id` (string): The unique ID of the toast to dismiss

**Example:**

```javascript
const id = toast.success('This will be dismissed');
setTimeout(() => {
  toast.dismiss(id);
}, 2000);
```

#### `toast.dismissAll()`

Dismiss all currently visible toasts.

**Example:**

```javascript
toast.dismissAll();
```

### Configuration Methods

#### `toast.configure(config)`

Update global configuration for all future toasts.

**Parameters:**

- `config` (Partial`<ToastConfig>`): Configuration object

**Example:**

```javascript
toast.configure({
  position: 'top-right',
  maxVisibleStackToasts: 4,
  defaultDuration: 5000,
  enableBorderAnimation: true,
  animationDirection: 'left-to-right'
});
```

#### `toast.getConfig()`

Get current global configuration.

**Returns:** `ToastConfig` - Current configuration object

**Example:**

```javascript
const currentConfig = toast.getConfig();
console.log('Current position:', currentConfig.position);
```

## Configuration Options

### ToastOptions

Individual toast configuration options:

```typescript
interface ToastOptions {
  autoDismiss?: number;        // Auto-dismiss duration in ms (default: 3000)
  position?: ToastPosition;    // Position override
  backgroundColor?: string;    // Custom background color
  textColor?: string;         // Custom text color
  borderColor?: string;       // Custom border color
  showCloseButton?: boolean;  // Show close button (default: true)
  pauseOnHover?: boolean;     // Pause on hover (default: true)
  className?: string;         // Custom CSS class
  icon?: string;              // Custom icon HTML/SVG
  animationDirection?: AnimationDirection; // Animation direction
}
```

### ToastConfig

Global configuration options:

```typescript
interface ToastConfig {
  position?: ToastPosition;              // Default position
  maxVisibleStackToasts?: number;        // Max visible toasts (default: 3)
  stackOffsetY?: number;                 // Vertical offset (default: 10px)
  stackOffsetX?: number;                 // Horizontal offset (default: 4px)
  scaleDecrementPerLevel?: number;       // Scale reduction (default: 0.05)
  opacityDecrementPerLevel?: number;     // Opacity reduction (default: 0.2)
  maxRenderedToasts?: number;            // Max rendered (default: 5)
  defaultDuration?: number;              // Default duration (default: 3000ms)
  animationDuration?: number;            // Animation duration (default: 300ms)
  enableBorderAnimation?: boolean;       // Enable border animation (default: true)
  enableFillAnimation?: boolean;         // Enable fill animation (default: true)
  animationDirection?: AnimationDirection; // Default animation direction
  customCSS?: string;                    // Custom CSS injection
}
```

## Types

### ToastPosition

```typescript
type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'top-center' 
  | 'bottom-center';
```

### AnimationDirection

```typescript
type AnimationDirection = 
  | 'left-to-right' 
  | 'right-to-left' 
  | 'top-to-bottom' 
  | 'bottom-to-top';
```

### ToastType

```typescript
enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning'
}
```

## Events

### Event Listeners

#### `toast.on(event, callback)`

Add an event listener for toast events.

**Parameters:**

- `event` (ToastEvent): Event type ('show', 'dismiss', 'click', 'hover')
- `callback` (ToastEventCallback): Function to call when event occurs

**Example:**

```javascript
toast.on('show', (toastData) => {
  console.log('Toast shown:', toastData.message);
});

toast.on('dismiss', (toastData) => {
  console.log('Toast dismissed:', toastData.id);
});
```

#### `toast.off(event, callback)`

Remove an event listener.

**Parameters:**

- `event` (ToastEvent): Event type
- `callback` (ToastEventCallback): The same function reference used in `on()`

**Example:**

```javascript
const showHandler = (toast) => console.log('Shown:', toast.message);

toast.on('show', showHandler);
// Later...
toast.off('show', showHandler);
```

## Advanced Examples

### Multiple Instances

```javascript
import { ModernToasts } from 'modern-toasts';

const topToasts = new ModernToasts({
  position: 'top-right',
  maxVisibleStackToasts: 2
});

const bottomToasts = new ModernToasts({
  position: 'bottom-left',
  enableBorderAnimation: false
});

topToasts.success('Top notification');
bottomToasts.info('Bottom notification');
```

### Custom Styling

```javascript
toast.success('Custom styled toast', {
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  borderColor: '#10b981',
  className: 'my-custom-toast'
});

// Global custom CSS
toast.configure({
  customCSS: `
    .my-custom-toast {
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }
  `
});
```

### Event Handling

```javascript
let toastCount = 0;

toast.on('show', (toastData) => {
  toastCount++;
  console.log(`Total toasts shown: ${toastCount}`);
});

toast.on('dismiss', (toastData) => {
  console.log(`Toast "${toastData.message}" was dismissed`);
});
```

### Programmatic Control

```javascript
// Show toast and store ID
const id = toast.info('Processing...', { autoDismiss: 0 });

// Simulate async operation
setTimeout(() => {
  toast.dismiss(id);
  toast.success('Processing complete!');
}, 3000);
```

### Animation Directions

```javascript
// Different animation styles
toast.success('Left to right', { animationDirection: 'left-to-right' });
toast.error('Right to left', { animationDirection: 'right-to-left' });
toast.info('Top to bottom', { animationDirection: 'top-to-bottom' });
toast.warning('Bottom to top', { animationDirection: 'bottom-to-top' });
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## TypeScript Support

ModernToasts is written in TypeScript and provides full type definitions:

```typescript
import toast, { ToastType, ToastOptions, ToastConfig } from 'modern-toasts';

const options: ToastOptions = {
  autoDismiss: 5000,
  position: 'top-right',
  showCloseButton: true
};

const id: string = toast.success('Typed toast!', options);
```
