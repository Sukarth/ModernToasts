# 🍞 ModernToasts

A modern, lightweight toast notification library with beautiful stacked animations. Zero dependencies, TypeScript support, and works everywhere.

[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://sukarth.github.io/ModernToasts-Demo/) [![npm version](https://img.shields.io/npm/v/modern-toasts)](https://www.npmjs.com/package/modern-toasts) [![bundle size](https://img.shields.io/bundlephobia/minzip/modern-toasts)](https://bundlephobia.com/package/modern-toasts) [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](https://github.com/sukarth/ModernToasts)

<div align="center">
  <img src="https://raw.githubusercontent.com/sukarth/ModernToasts/main/assets/demo.gif" alt="ModernToasts Demo" width="600">
</div>

## ✨ Features

- 🎨 **Beautiful Animations** - Signature border animations and smooth stacking effects
- 📱 **Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- ♿ **Accessibility First** - ARIA compliant, keyboard navigation, screen reader support
- 🎯 **TypeScript Ready** - Full type safety with excellent developer experience
- 🪶 **Lightweight** - Only ~42KB minified (~7.8KB gzipped), zero dependencies
- 🔧 **Highly Customizable** - Themes, positions, animations, and more
- 🚀 **Multiple Usage Methods** - Script tag, npm package, ES modules
- 📦 **Framework Agnostic** - Works with any framework or vanilla JavaScript
- 🧪 **Well Tested** - Comprehensive test suite with 92%+ coverage
- 🔒 **Secure** - XSS protection with input sanitization
- 🎯 **Event System** - Listen to toast lifecycle events
- ⏸️ **Pause on Hover** - Auto-dismiss pauses when hovering
- 🧹 **Memory Safe** - Proper cleanup of event listeners and timers

## 🚀 Quick Start

### 📦 Installation

```bash
# NPM
npm install modern-toasts

# Yarn
yarn add modern-toasts

# PNPM
pnpm add modern-toasts
```

### 🏷️ Script Tag (CDN)

```html
<!-- Include the library -->
<script src="https://unpkg.com/modern-toasts@latest/dist/modern-toasts.min.js"></script>

<script>
  const { toast } = window.ModernToasts;
  
  // Show toasts
  toast.success('Hello World!');
  toast.error('Something went wrong');
  toast.info('Here is some info');
  toast.warning('Be careful!');
</script>
```

### 📦 ES Modules / NPM

```javascript
import toast from 'modern-toasts';

// Simple usage
toast.success('Operation completed!');
toast.error('Something went wrong');

// With options
toast.success('Custom toast!', {
  autoDismiss: 5000,
  position: 'top-right',
  backgroundColor: '#custom-color'
});
```

### 🎮 Try it Now

```javascript
// Basic examples
toast.success('🎉 Welcome to ModernToasts!');
toast.error('❌ Something went wrong');
toast.info('ℹ️ Here is some information');
toast.warning('⚠️ Please be careful');

// Advanced examples
toast.success('Custom styled toast', {
  autoDismiss: 0,  // Won't auto-dismiss
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  borderColor: '#10b981'
});

// Configure globally
toast.configure({
  position: 'top-right',
  maxVisibleStackToasts: 4,
  enableBorderAnimation: true
});
```

## 📖 API Reference

### Basic Methods

```javascript
// Show different types of toasts
toast.success(message, options?)
toast.error(message, options?)
toast.info(message, options?)
toast.warning(message, options?)

// Generic method
toast.show(message, type, options?)

// Management
toast.dismiss(id)           // Dismiss specific toast
toast.dismissAll()          // Dismiss all toasts
```

### Configuration

```javascript
// Configure globally
toast.configure({
  position: 'bottom-right',
  maxVisibleStackToasts: 3,
  defaultDuration: 4000,
  enableBorderAnimation: true
});

// Get current config
const config = toast.getConfig();
```

### Toast Options

```typescript
interface ToastOptions {
  autoDismiss?: number;        // Auto-dismiss duration in ms (default: 3000)
  position?: ToastPosition;    // Position of toast container
  backgroundColor?: string;    // Custom background color
  textColor?: string;         // Custom text color
  borderColor?: string;       // Custom border color
  showCloseButton?: boolean;  // Show close button (default: true)
  pauseOnHover?: boolean;     // Pause auto-dismiss on hover (default: true)
  className?: string;         // Custom CSS class
  icon?: string;              // Custom icon HTML/SVG
  animationDirection?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'; // Animation direction (default: 'left-to-right')
}
```

### Global Configuration

```typescript
interface ToastConfig {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxVisibleStackToasts?: number;     // Default: 3
  stackOffsetY?: number;              // Default: 10px
  stackOffsetX?: number;              // Default: 4px
  scaleDecrementPerLevel?: number;    // Default: 0.05
  opacityDecrementPerLevel?: number;  // Default: 0.2
  maxRenderedToasts?: number;         // Default: 5
  defaultDuration?: number;           // Default: 3000ms
  animationDuration?: number;         // Default: 300ms
  enableBorderAnimation?: boolean;    // Default: true
  enableFillAnimation?: boolean;      // Default: true
  animationDirection?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'; // Default: 'left-to-right'
  customCSS?: string;                 // Custom CSS injection
}
```

## 🎨 Customization

### Positions

```javascript
toast.configure({ position: 'top-right' });    // Top right corner
toast.configure({ position: 'top-left' });     // Top left corner
toast.configure({ position: 'bottom-right' }); // Bottom right corner (default)
toast.configure({ position: 'bottom-left' });  // Bottom left corner
toast.configure({ position: 'top-center' });   // Top center
toast.configure({ position: 'bottom-center' }); // Bottom center
```

### Custom Styling

```javascript
// Individual toast styling
toast.success('Custom styled toast', {
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  borderColor: '#10b981'
});

// Global custom CSS
toast.configure({
  customCSS: `
    .mt-toast {
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }
    .mt-toast-title {
      font-weight: 700;
    }
  `
});
```

### Animation Control

```javascript
toast.configure({
  enableBorderAnimation: true,    // Enable signature border animations
  enableFillAnimation: true,      // Enable fill progress animations
  animationDuration: 300,         // Animation duration in ms
  animationDirection: 'left-to-right', // Animation direction
  stackOffsetY: 12,              // Vertical stacking offset
  stackOffsetX: 6,               // Horizontal stacking offset
  scaleDecrementPerLevel: 0.03,  // Scale reduction per stack level
  opacityDecrementPerLevel: 0.15 // Opacity reduction per stack level
});
```

### Animation Directions

Choose from four different animation styles for both border and fill animations:

```javascript
// Left to right (default)
toast.success('Left to right animation', {
  animationDirection: 'left-to-right'
});

// Right to left
toast.error('Right to left animation', {
  animationDirection: 'right-to-left'
});

// Top to bottom
toast.info('Top to bottom animation', {
  animationDirection: 'top-to-bottom'
});

// Bottom to top
toast.warning('Bottom to top animation', {
  animationDirection: 'bottom-to-top'
});

// Set globally for all toasts
toast.configure({
  animationDirection: 'right-to-left'
});
```

## 🔧 Advanced Usage

### Multiple Instances

```javascript
import { ModernToasts } from 'modern-toasts';

// Create separate instances with different configs
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

### Event Listeners

```javascript
// Listen to toast events
toast.on('show', (toastData) => {
  console.log('Toast shown:', toastData);
});

toast.on('dismiss', (toastData) => {
  console.log('Toast dismissed:', toastData);
});

// Remove event listeners
toast.off('show', callback);
```

### Custom Icons

```javascript
toast.success('Custom icon toast', {
  icon: '<svg>...</svg>' // Your custom SVG icon
});
```

## 🎯 TypeScript Support

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

## 📱 Responsive Design

ModernToasts automatically adapts to different screen sizes:

- **Desktop**: Full-width toasts with optimal spacing
- **Tablet**: Responsive width with touch-friendly controls
- **Mobile**: Full-width toasts with swipe-to-dismiss (coming soon)

## ♿ Accessibility

- **ARIA Live Regions**: Screen reader announcements
- **Keyboard Navigation**: Focus management and keyboard controls
- **High Contrast**: Supports high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Semantic HTML**: Proper roles and labels

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 📦 Bundle Sizes

- **Minified (recommended)**: 41.73 KB minified (7.84 KB gzipped)
- **UMD (script tag)**: 68.60 KB minified (12.02 KB gzipped)
- **ES Module**: 63.84 KB minified (11.68 KB gzipped)
- **CommonJS**: 64.05 KB minified (11.74 KB gzipped)

### Pre-compressed Files

All build outputs include pre-compressed `.gz` files for optimal CDN delivery:
- `modern-toasts.min.js.gz` - 7.84 KB
- `modern-toasts.umd.js.gz` - 12.02 KB
- `modern-toasts.esm.js.gz` - 11.68 KB
- `modern-toasts.cjs.js.gz` - 11.74 KB

## 🔄 Migration from Other Libraries

### From react-hot-toast

```javascript
// Before
import toast from 'react-hot-toast';
toast.success('Hello');

// After
import toast from 'modern-toasts';
toast.success('Hello');
```

### From react-toastify

```javascript
// Before
import { toast } from 'react-toastify';
toast.success('Hello');

// After
import toast from 'modern-toasts';
toast.success('Hello');
```

## 🚀 Recent Improvements

### Performance Enhancements
- **Memory Management**: Fixed memory leaks by properly cleaning up event listeners
- **DOM Optimization**: Refactored toast creation using builder pattern for better performance
- **Efficient Array Operations**: Optimized toast management data structures
- **Constants Extraction**: Removed magic numbers for better maintainability

### Code Quality
- **Test Suite**: Added comprehensive Jest tests with 92%+ coverage
- **ESLint Integration**: Added linting with TypeScript-specific rules
- **Security**: Added XSS protection with input sanitization
- **Type Safety**: Enhanced TypeScript types and validation

### New Features
- **Event System**: Fully implemented toast lifecycle events (show/dismiss)
- **Pause on Hover**: Now properly pauses auto-dismiss when hovering
- **Input Validation**: Added robust validation for options and configuration
- **Better Error Handling**: Improved error messages and handling

### Architecture Improvements
- **Builder Pattern**: Implemented ToastBuilder for cleaner element creation
- **Utility Functions**: Extracted common functionality to utility modules
- **Constants Module**: Centralized configuration values
- **Modular Design**: Better separation of concerns

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the beautiful toast implementations in modern web applications
- Built with TypeScript, Rollup, and modern web standards
- Special thanks to the open source community

---

<div align="center">
  <strong>Made with ❤️ by <a href="https://github.com/sukarth">Sukarth Acharya</a></strong>
  <br>
  <a href="https://sukarth.github.io/ModernToasts-Demo/">Live Demo</a> • 
  <a href="https://github.com/sukarth/ModernToasts">GitHub</a> • 
  <a href="https://www.npmjs.com/package/modern-toasts">NPM</a>
</div>