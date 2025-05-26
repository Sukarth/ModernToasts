# Changelog

All notable changes to ModernToasts will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-05-26

### 🎛️ Enhanced Pause Control & Perfect Timing

This release significantly improves the pause on hover system with bulletproof timing consistency and advanced background toast control.

### ✨ New Features

#### **Enhanced Pause on Hover System**
- **Background Toast Control**: New `pauseBackgroundToastsOnHover` option to pause ALL background toasts when hovering over any toast
- **Perfect Timing Consistency**: Implemented virtual timestamp system that eliminates timing drift after multiple pause/resume cycles
- **Individual Control**: Maintain per-toast `pauseOnHover` settings while having global background control

#### **Advanced Stack Configuration**
- **Fine-tuned Stacking**: New options for `stackOffsetY`, `stackOffsetX`, `scaleDecrementPerLevel`, and `opacityDecrementPerLevel`
- **Real-time Configuration**: All stacking parameters now configurable at runtime
- **Position-aware Defaults**: Intelligent default values based on toast position

### 🔧 Technical Improvements

#### **Bulletproof Timing System**
- **Virtual Timestamps**: Maintains perfect timing accuracy through any number of pause/resume cycles
- **Edge Case Handling**: Proper timing when toasts are promoted (top toast removed)
- **Memory Efficiency**: Optimized pause state management with proper cleanup

#### **Enhanced User Experience**
- **Intuitive Behavior**: Background toasts pause when hovering over any toast (configurable)
- **Smooth Animations**: Both timer AND animations pause together for consistent experience
- **Flexible Control**: Global and per-toast configuration options

### 🐛 Bug Fixes

#### **Critical Timing Fixes**
- **Removed Artificial Minimum**: Fixed 1000ms minimum constraint that caused toasts to live longer than configured duration
- **Immediate Dismissal**: Toasts that have expired during pause now dismiss immediately instead of extending duration
- **Timing Contract**: Toasts now respect exact configured `autoDismiss` duration

#### **Race Condition Protection**
- **Double-pause Prevention**: Added guards to prevent multiple pause operations on same toast
- **State Validation**: Added defensive checks for consistent pause state (`pausedRemainingTime` + `pausedAt`)
- **Rapid Hover Handling**: Fixed timing corruption from rapid mouse movement

#### **State Consistency**
- **Defensive Programming**: Added validation to ensure pause state consistency
- **Memory Cleanup**: Improved cleanup of pause-related event listeners
- **Edge Case Handling**: Better handling of edge cases in pause/resume cycles

### 🎮 Playground Enhancements

#### **Complete Feature Coverage**
- **Advanced Stack Settings**: Real-time sliders for all stacking parameters
- **Background Pause Toggle**: Test the new background pause functionality
- **Custom Text Colors**: Fixed and enhanced custom text color support
- **Comprehensive Testing**: All library features now accessible in playground

#### **Better Organization**
- **Improved Structure**: Playground moved to `examples/playground/` for better organization
- **Enhanced Navigation**: Updated all links and references for new structure

### 📦 Bundle Updates

#### **Updated Sizes**
- **Minified**: 41.73 KB minified (8.22 KB gzipped)
- **UMD**: 68.60 KB minified (12.79 KB gzipped)
- **ES Module**: 63.84 KB minified (12.45 KB gzipped)
- **CommonJS**: 64.05 KB minified (12.51 KB gzipped)

### 🔄 Migration Guide

This release is **100% backward compatible**. No code changes required.

#### **New Optional Features**
```javascript
// Enable the new background pause feature (default: true)
toast.configure({
  pauseBackgroundToastsOnHover: true
});

// Fine-tune stacking behavior
toast.configure({
  stackOffsetY: 12,
  stackOffsetX: 6,
  scaleDecrementPerLevel: 0.03,
  opacityDecrementPerLevel: 0.15
});
```

#### **Improved Behavior**
- Toasts now respect exact configured duration (no more artificial 1s minimum)
- Expired toasts dismiss immediately when paused
- Perfect timing consistency through multiple pause/resume cycles
- Background toasts pause when hovering over any toast (configurable)

### 🧪 Testing

- **All Tests Passing**: 77 tests continue to pass with new functionality
- **Edge Case Coverage**: Added comprehensive testing for timing edge cases
- **Race Condition Testing**: Verified protection against rapid hover events

### 📚 Documentation Updates

- **Complete API Reference**: Added all new configuration options
- **Usage Examples**: Enhanced pause on hover examples and configuration
- **Playground Guide**: Updated documentation for new playground location
- **Bundle Sizes**: Updated with latest gzipped sizes

### 🎯 What's Next

- Mobile swipe-to-dismiss functionality
- Additional animation easing options
- Theme system for quick styling

---

**Full Changelog**: https://github.com/sukarth/ModernToasts/compare/v1.0.0...v1.1.0

## [1.0.0] - 2025-05-25

### 🎉 Initial Release

The first stable release of ModernToasts - a modern, lightweight toast notification library.

### ✨ Features

#### Core Functionality

- **Toast Types**: Success, Error, Info, Warning notifications
- **Stacked Animations**: Beautiful stacking effects with configurable offsets
- **Multiple Positions**: 6 position options (top/bottom + left/center/right)
- **Auto-dismiss**: Configurable auto-dismiss with pause on hover
- **Manual Control**: Dismiss individual toasts or all toasts programmatically

#### Animations & Styling

- **Border Animations**: Signature animated borders in 4 directions
- **Fill Animations**: Progress fill animations matching toast duration
- **Smooth Transitions**: CSS-based animations with hardware acceleration
- **Custom Styling**: Full customization of colors, icons, and CSS classes
- **Responsive Design**: Mobile-friendly with touch support

#### Developer Experience

- **TypeScript Support**: Full type definitions and IntelliSense
- **Zero Dependencies**: Lightweight with no external dependencies
- **Multiple Import Methods**: ES modules, CommonJS, UMD, and script tag
- **Event System**: Listen to toast lifecycle events (show/dismiss)
- **Memory Safe**: Proper cleanup of event listeners and timers

#### Architecture

- **Builder Pattern**: Clean toast element creation
- **Modular Design**: Separated concerns with utility modules
- **Constants Management**: Centralized configuration values
- **Input Validation**: Comprehensive validation with helpful error messages
- **XSS Protection**: Built-in HTML sanitization

### 🔧 Technical Details

#### Build System

- **Rollup**: Modern bundling with tree-shaking
- **TypeScript**: Full TypeScript compilation
- **CSS Injection**: Automatic CSS bundling into JavaScript
- **Multiple Formats**: UMD, ES modules, CommonJS, and minified versions

#### Testing & Quality

- **Jest Testing**: Comprehensive test suite with 77+ tests
- **ESLint**: Code quality enforcement with TypeScript rules
- **Type Safety**: Strict TypeScript configuration
- **Coverage**: High test coverage across all modules

#### Distribution

- **NPM Package**: Published to npm registry
- **CDN Ready**: Available via unpkg and jsDelivr
- **Bundle Analysis**: Optimized for minimal bundle size (~8KB minified)
- **Browser Support**: Modern browsers with graceful degradation

### 📦 Package Contents

```
dist/
├── modern-toasts.umd.js      # UMD build for script tags
├── modern-toasts.min.js      # Minified UMD build
├── modern-toasts.esm.js      # ES modules build
├── modern-toasts.cjs.js      # CommonJS build
└── types/                    # TypeScript definitions
    └── index.d.ts
```

### 🎯 API Surface

#### Basic Usage

```javascript
import toast from 'modern-toasts';

toast.success('Hello World!');
toast.error('Something went wrong');
toast.info('Here is some info');
toast.warning('Be careful!');
```

#### Configuration

```javascript
toast.configure({
  position: 'bottom-right',
  maxVisibleStackToasts: 3,
  defaultDuration: 4000,
  enableBorderAnimation: true,
  animationDirection: 'left-to-right'
});
```

#### Advanced Features

```javascript
// Custom styling
toast.success('Custom toast', {
  backgroundColor: '#1f2937',
  borderColor: '#10b981',
  autoDismiss: 0
});

// Event listeners
toast.on('show', (toastData) => {
  console.log('Toast shown:', toastData);
});

// Multiple instances
const customToasts = new ModernToasts({
  position: 'top-left',
  maxVisibleStackToasts: 5
});
```

### 🌐 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

### 📊 Performance

- **Bundle Size**: ~8KB minified + gzipped
- **Runtime Performance**: Hardware-accelerated animations
- **Memory Usage**: Efficient cleanup and garbage collection
- **Load Time**: Fast initialization with lazy CSS injection

### 🔒 Security

- **XSS Protection**: HTML sanitization for user content
- **Input Validation**: Comprehensive validation of all inputs
- **Safe Defaults**: Secure default configuration
- **No Eval**: No dynamic code execution

### ♿ Accessibility

- **ARIA Support**: Proper ARIA live regions and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Semantic HTML with proper announcements
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion`

### 📚 Documentation

- **README**: Comprehensive usage guide
- **API Documentation**: Complete API reference
- **Examples**: Working examples for all use cases
- **TypeScript**: Full type definitions
- **Contributing Guide**: Development setup and guidelines

### 🧪 Testing

- **Unit Tests**: 77+ tests covering all functionality
- **Integration Tests**: End-to-end testing scenarios
- **Type Tests**: TypeScript compilation tests
- **Browser Tests**: Cross-browser compatibility testing
- **Performance Tests**: Bundle size and runtime performance

### 🚀 Getting Started

```bash
# Install
npm install modern-toasts

# Basic usage
import toast from 'modern-toasts';
toast.success('Welcome to ModernToasts!');
```

### 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- Inspired by modern toast implementations in popular applications
- Built with TypeScript, Rollup, and modern web standards

---

**Full Changelog**: https://github.com/sukarth/ModernToasts/commits/v1.0.0
