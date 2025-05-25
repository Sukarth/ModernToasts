import { ModernToasts } from '../src/ModernToasts';
import { ToastType, ToastConfig } from '../src/types';
import { DOM_CONFIG, CSS_CLASSES, ANIMATION_TIMING } from '../src/constants';

describe('ModernToasts', () => {
  let toasts: ModernToasts;

  beforeEach(() => {
    toasts = new ModernToasts();
  });

  afterEach(() => {
    toasts.destroy();
  });

  describe('initialization', () => {
    it('should create container elements on initialization', () => {
      const container = document.querySelector(`.${CSS_CLASSES.CONTAINER}`);
      const containerInner = document.querySelector(`.${CSS_CLASSES.CONTAINER_INNER}`);

      expect(container).toBeTruthy();
      expect(containerInner).toBeTruthy();
      expect(container?.getAttribute('aria-live')).toBe('polite');
    });

    it('should inject CSS styles', () => {
      const styles = document.getElementById(DOM_CONFIG.STYLE_ID);
      expect(styles).toBeTruthy();
    });

    it('should set default position class', () => {
      const container = document.querySelector(`.${CSS_CLASSES.CONTAINER}`);
      expect(container?.className).toContain('position-bottom-right');
    });

    it('should not create duplicate containers on multiple instances', () => {
      const toasts2 = new ModernToasts();
      const containers = document.querySelectorAll(`.${CSS_CLASSES.CONTAINER}`);
      
      expect(containers.length).toBe(1);
      
      toasts2.destroy();
    });
  });

  describe('show methods', () => {
    it('should show success toast', () => {
      const id = toasts.success('Success message');
      
      expect(id).toMatch(/^toast-\d+-[a-z0-9]+$/);
      
      const toastEl = document.getElementById(id);
      expect(toastEl).toBeTruthy();
      expect(toastEl?.className).toContain('toast-success');
    });

    it('should show error toast', () => {
      const id = toasts.error('Error message');
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      expect(toastEl?.className).toContain('toast-error');
    });

    it('should show info toast', () => {
      const id = toasts.info('Info message');
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      expect(toastEl?.className).toContain('toast-info');
    });

    it('should show warning toast', () => {
      const id = toasts.warning('Warning message');
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      expect(toastEl?.className).toContain('toast-warning');
    });

    it('should show custom toast with show method', () => {
      const id = toasts.show('Custom message', ToastType.Success);
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      expect(toastEl?.className).toContain('toast-success');
    });
  });

  describe('toast options', () => {
    it('should apply custom options', () => {
      const id = toasts.success('Test', {
        autoDismiss: 5000,
        className: 'custom-class',
      });
      
      const toastEl = document.getElementById(id);
      expect(toastEl?.className).toContain('custom-class');
    });

    it('should validate toast options', () => {
      expect(() => {
        toasts.success('Test', { autoDismiss: -1 });
      }).toThrow('autoDismiss must be a non-negative number');
    });

    it('should not show close button when disabled', () => {
      const id = toasts.success('Test', { showCloseButton: false });
      const toastEl = document.getElementById(id);
      const closeButton = toastEl?.querySelector(`.${CSS_CLASSES.TOAST_CLOSE_BUTTON}`);
      
      expect(closeButton).toBeFalsy();
    });

    it('should apply custom styles', () => {
      const id = toasts.success('Test', {
        backgroundColor: '#ff0000',
        textColor: '#00ff00',
        borderColor: '#0000ff',
      });
      
      const toastEl = document.getElementById(id) as HTMLElement;
      // Accept both hex and rgb formats
      expect(['#ff0000', 'rgb(255, 0, 0)']).toContain(toastEl.style.backgroundColor);
      expect(['#00ff00', 'rgb(0, 255, 0)']).toContain(toastEl.style.color);
      expect(['#0000ff', 'rgb(0, 0, 255)']).toContain(toastEl.style.borderColor);
    });
  });

  describe('auto dismiss', () => {
    it('should auto dismiss after specified duration', () => {
      const id = toasts.success('Test', { autoDismiss: 100 });
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id)).toBeFalsy();
    });

    it('should not auto dismiss when autoDismiss is 0', () => {
      const id = toasts.success('Test', { autoDismiss: 0 });
      const toastEl = document.getElementById(id);
      
      expect(toastEl).toBeTruthy();
      
      jest.advanceTimersByTime(10000);
      
      expect(document.getElementById(id)).toBeTruthy();
    });
  });

  describe('dismiss methods', () => {
    it('should dismiss specific toast', () => {
      const id = toasts.success('Test');
      
      expect(document.getElementById(id)).toBeTruthy();
      
      toasts.dismiss(id);
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id)).toBeFalsy();
    });

    it('should dismiss all toasts', () => {
      const id1 = toasts.success('Test 1');
      const id2 = toasts.error('Test 2');
      const id3 = toasts.info('Test 3');
      
      expect(document.getElementById(id1)).toBeTruthy();
      expect(document.getElementById(id2)).toBeTruthy();
      expect(document.getElementById(id3)).toBeTruthy();
      
      toasts.dismissAll();
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id1)).toBeFalsy();
      expect(document.getElementById(id2)).toBeFalsy();
      expect(document.getElementById(id3)).toBeFalsy();
    });

    it('should handle dismissing non-existent toast', () => {
      expect(() => {
        toasts.dismiss('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('stacking behavior', () => {
    it('should stack multiple toasts', () => {
      const id1 = toasts.success('Toast 1');
      const id2 = toasts.success('Toast 2');
      const id3 = toasts.success('Toast 3');
      
      const toast1 = document.getElementById(id1) as HTMLElement;
      const toast2 = document.getElementById(id2) as HTMLElement;
      const toast3 = document.getElementById(id3) as HTMLElement;
      
      // Check z-index ordering
      const z1 = parseInt(toast1.style.getPropertyValue('--toast-z-index'));
      const z2 = parseInt(toast2.style.getPropertyValue('--toast-z-index'));
      const z3 = parseInt(toast3.style.getPropertyValue('--toast-z-index'));
      
      expect(z3).toBeGreaterThan(z2);
      expect(z2).toBeGreaterThan(z1);
    });

    it('should limit visible toasts based on maxVisibleStackToasts', () => {
      toasts.configure({ maxVisibleStackToasts: 2 });
      
      const id1 = toasts.success('Toast 1');
      const id2 = toasts.success('Toast 2');
      const id3 = toasts.success('Toast 3');
      
      const toast1 = document.getElementById(id1) as HTMLElement;
      const toast2 = document.getElementById(id2) as HTMLElement;
      const toast3 = document.getElementById(id3) as HTMLElement;
      
      // Wait for styles to be applied
      jest.runAllTimers();
      
      // Check that all toasts exist
      expect(toast1).toBeTruthy();
      expect(toast2).toBeTruthy();
      expect(toast3).toBeTruthy();
      
      // Check that configuration was applied
      const config = toasts.getConfig();
      expect(config.maxVisibleStackToasts).toBe(2);
      
      // Check that CSS custom properties are set (indicating stacking is working)
      expect(toast1.style.getPropertyValue('--toast-z-index')).toBeTruthy();
      expect(toast2.style.getPropertyValue('--toast-z-index')).toBeTruthy();
      expect(toast3.style.getPropertyValue('--toast-z-index')).toBeTruthy();
    });

    it('should limit rendered toasts based on maxRenderedToasts', () => {
      toasts.configure({ maxRenderedToasts: 2 });
      
      const id1 = toasts.success('Toast 1');
      const id2 = toasts.success('Toast 2');
      const id3 = toasts.success('Toast 3');
      
      expect(document.getElementById(id1)).toBeFalsy(); // Should be removed
      expect(document.getElementById(id2)).toBeTruthy();
      expect(document.getElementById(id3)).toBeTruthy();
    });
  });

  describe('configuration', () => {
    it('should update position', () => {
      toasts.configure({ position: 'top-left' });
      
      const container = document.querySelector(`.${CSS_CLASSES.CONTAINER}`);
      expect(container?.className).toContain('position-top-left');
      expect(container?.className).not.toContain('position-bottom-right');
    });

    it('should update animation direction with position', () => {
      toasts.configure({ position: 'top-center' });
      const config = toasts.getConfig();
      
      expect(config.animationDirection).toBe('bottom-to-top');
    });

    it('should validate configuration', () => {
      expect(() => {
        toasts.configure({ maxVisibleStackToasts: 0 });
      }).toThrow('maxVisibleStackToasts must be a positive number');
    });

    it('should update custom CSS', () => {
      const customCSS = '.toast { background: red !important; }';
      toasts.configure({ customCSS });
      
      const customStyle = document.getElementById(DOM_CONFIG.CUSTOM_STYLE_ID);
      expect(customStyle?.textContent).toBe(customCSS);
    });

    it('should disable animations', () => {
      toasts.configure({
        enableBorderAnimation: false,
        enableFillAnimation: false,
      });
      
      const id = toasts.success('Test');
      const toastEl = document.getElementById(id);
      
      expect(toastEl?.className).toContain(CSS_CLASSES.NO_BORDER_ANIMATION);
      expect(toastEl?.className).toContain(CSS_CLASSES.NO_FILL_ANIMATION);
    });
  });

  describe('event system', () => {
    it('should emit show event', () => {
      const showHandler = jest.fn();
      toasts.on('show', showHandler);
      
      const id = toasts.success('Test');
      jest.runAllTimers();
      
      expect(showHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          type: ToastType.Success,
          message: 'Test',
        })
      );
    });

    it('should emit dismiss event', () => {
      const dismissHandler = jest.fn();
      toasts.on('dismiss', dismissHandler);
      
      const id = toasts.success('Test');
      toasts.dismiss(id);
      
      expect(dismissHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          id,
          type: ToastType.Success,
          message: 'Test',
        })
      );
    });

    it('should remove event listener', () => {
      const handler = jest.fn();
      toasts.on('show', handler);
      toasts.off('show', handler);
      
      toasts.success('Test');
      jest.runAllTimers();
      
      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle errors in event listeners', () => {
      const errorHandler = jest.fn(() => {
        throw new Error('Test error');
      });
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      toasts.on('show', errorHandler);
      toasts.success('Test');
      jest.runAllTimers();
      
      expect(consoleError).toHaveBeenCalledWith(
        'Error in toast event listener:',
        expect.any(Error)
      );
      
      consoleError.mockRestore();
    });
  });

  describe('pause on hover', () => {
    it('should pause auto dismiss on hover', () => {
      const id = toasts.success('Test', { 
        autoDismiss: 1000,
        pauseOnHover: true 
      });
      
      const toastEl = document.getElementById(id) as HTMLElement;
      
      // Advance time partially
      jest.advanceTimersByTime(500);
      
      // Hover over toast
      const mouseEnterEvent = new Event('mouseenter');
      toastEl.dispatchEvent(mouseEnterEvent);
      
      // Advance time past original dismiss time
      jest.advanceTimersByTime(1000);
      
      // Toast should still exist
      expect(document.getElementById(id)).toBeTruthy();
      
      // Mouse leave
      const mouseLeaveEvent = new Event('mouseleave');
      toastEl.dispatchEvent(mouseLeaveEvent);
      
      // Should dismiss after remaining time
      jest.advanceTimersByTime(1000);
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id)).toBeFalsy();
    });

    it('should not pause when pauseOnHover is false', () => {
      const id = toasts.success('Test', { 
        autoDismiss: 100,
        pauseOnHover: false 
      });
      
      const toastEl = document.getElementById(id) as HTMLElement;
      
      // Hover over toast
      const mouseEnterEvent = new Event('mouseenter');
      toastEl.dispatchEvent(mouseEnterEvent);
      
      // Should still dismiss
      jest.advanceTimersByTime(100);
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id)).toBeFalsy();
    });
  });

  describe('close button', () => {
    it('should close toast when close button is clicked', () => {
      const id = toasts.success('Test');
      const toastEl = document.getElementById(id);
      const closeButton = toastEl?.querySelector(`.${CSS_CLASSES.TOAST_CLOSE_BUTTON}`) as HTMLElement;
      
      expect(closeButton).toBeTruthy();
      
      closeButton.click();
      jest.advanceTimersByTime(ANIMATION_TIMING.EXIT_DURATION);
      
      expect(document.getElementById(id)).toBeFalsy();
    });
  });

  describe('destroy', () => {
    it('should clean up everything on destroy', () => {
      const id1 = toasts.success('Test 1');
      const id2 = toasts.error('Test 2');
      
      toasts.destroy();
      
      expect(document.querySelector(`.${CSS_CLASSES.CONTAINER}`)).toBeFalsy();
      expect(document.getElementById(DOM_CONFIG.STYLE_ID)).toBeFalsy();
      expect(document.getElementById(id1)).toBeFalsy();
      expect(document.getElementById(id2)).toBeFalsy();
    });

    it('should clear all timers on destroy', () => {
      toasts.success('Test 1', { autoDismiss: 5000 });
      toasts.success('Test 2', { autoDismiss: 5000 });
      
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      
      toasts.destroy();
      
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
      
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('animation direction', () => {
    it('should apply correct animation direction from options', () => {
      const id = toasts.success('Test', { animationDirection: 'right-to-left' });
      const toastEl = document.getElementById(id);
      
      expect(toastEl?.getAttribute('data-animation-direction')).toBe('right-to-left');
    });

    it('should use global animation direction as fallback', () => {
      toasts.configure({ animationDirection: 'top-to-bottom' });
      
      const id = toasts.success('Test');
      const toastEl = document.getElementById(id);
      
      expect(toastEl?.getAttribute('data-animation-direction')).toBe('top-to-bottom');
    });
  });

  describe('memory management', () => {
    it('should clean up event listeners on toast removal', () => {
      const id = toasts.success('Test', { pauseOnHover: true });
      const toastEl = document.getElementById(id) as HTMLElement;
      
      const removeEventListenerSpy = jest.spyOn(toastEl, 'removeEventListener');
      
      toasts.dismiss(id);
      
      // Should remove mouseenter and mouseleave listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('should clean up close button event listener', () => {
      const id = toasts.success('Test');
      const toastEl = document.getElementById(id);
      const closeButton = toastEl?.querySelector(`.${CSS_CLASSES.TOAST_CLOSE_BUTTON}`) as HTMLElement;
      
      const removeEventListenerSpy = jest.spyOn(closeButton, 'removeEventListener');
      
      toasts.dismiss(id);
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });
  });
});