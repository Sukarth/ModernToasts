import { ToastBuilder } from '../src/ToastBuilder';
import { ToastData, ToastType } from '../src/types';
import { CSS_CLASSES } from '../src/constants';

describe('ToastBuilder', () => {
  const mockIcons = {
    success: '<svg>success</svg>',
    error: '<svg>error</svg>',
    info: '<svg>info</svg>',
    warning: '<svg>warning</svg>',
    close: '<svg>close</svg>',
  };

  const mockTypeConfig = {
    title: 'Success',
    ariaRole: 'status' as const,
    baseClass: 'toast-success',
    borderColorClass: 'border-success',
    fillColorClass: 'fill-success',
    iconColorClass: 'toast-icon-success',
  };

  const mockGlobalConfig = {
    animationDirection: 'left-to-right' as const,
    enableBorderAnimation: true,
    enableFillAnimation: true,
  };

  const createMockToastData = (overrides?: Partial<ToastData>): ToastData => ({
    id: 'test-toast-1',
    message: 'Test message',
    type: ToastType.Success,
    options: {
      autoDismiss: 3000,
      position: 'bottom-right',
      backgroundColor: '',
      textColor: '',
      borderColor: '',
      showCloseButton: true,
      pauseOnHover: true,
      className: '',
      icon: '',
      animationDirection: 'left-to-right',
    },
    createdAt: Date.now(),
    isRemoving: false,
    ...overrides,
  });

  describe('build', () => {
    it('should create a toast element with correct structure', () => {
      const toastData = createMockToastData();
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      
      const element = builder
        .addBorders()
        .addFillProgress()
        .addContent()
        .build();

      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.id).toBe('test-toast-1');
      expect(element.className).toContain('toast');
      expect(element.className).toContain('toast-success');
      expect(element.getAttribute('role')).toBe('status');
      expect(element.getAttribute('data-toast-id')).toBe('test-toast-1');
      expect(element.getAttribute('data-animation-direction')).toBe('left-to-right');
    });

    it('should add animation disable classes when animations are disabled', () => {
      const toastData = createMockToastData();
      const config = {
        ...mockGlobalConfig,
        enableBorderAnimation: false,
        enableFillAnimation: false,
      };
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, config, mockIcons);
      const element = builder.build();

      expect(element.className).toContain(CSS_CLASSES.NO_BORDER_ANIMATION);
      expect(element.className).toContain(CSS_CLASSES.NO_FILL_ANIMATION);
    });
  });

  describe('addBorders', () => {
    it('should add correct borders for left-to-right animation', () => {
      const toastData = createMockToastData();
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      
      const element = builder.addBorders().build();
      const borders = element.querySelectorAll('.border-element');

      expect(borders.length).toBe(6);
      expect(borders[0].className).toContain('border-left-top');
      expect(borders[1].className).toContain('border-left-bottom');
      expect(borders[2].className).toContain('border-top');
      expect(borders[3].className).toContain('border-bottom');
      expect(borders[4].className).toContain('border-right-top');
      expect(borders[5].className).toContain('border-right-bottom');
    });

    it('should add correct borders for top-to-bottom animation', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          animationDirection: 'top-to-bottom',
        },
      });
      
      const config = {
        ...mockGlobalConfig,
        animationDirection: 'top-to-bottom' as const,
      };
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, config, mockIcons);
      const element = builder.addBorders().build();
      const borders = element.querySelectorAll('.border-element');

      expect(borders.length).toBe(7);
      const borderClasses = Array.from(borders).map(b => b.className);
      expect(borderClasses.some(c => c.includes('border-bottom-left'))).toBe(true);
      expect(borderClasses.some(c => c.includes('border-bottom-right'))).toBe(true);
    });

    it('should add correct borders for bottom-to-top animation', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          animationDirection: 'bottom-to-top',
        },
      });
      
      const config = {
        ...mockGlobalConfig,
        animationDirection: 'bottom-to-top' as const,
      };
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, config, mockIcons);
      const element = builder.addBorders().build();
      const borders = element.querySelectorAll('.border-element');

      expect(borders.length).toBe(5);
      const borderClasses = Array.from(borders).map(b => b.className);
      expect(borderClasses.some(c => c.includes('border-top-left'))).toBe(true);
      expect(borderClasses.some(c => c.includes('border-top-right'))).toBe(true);
    });
  });

  describe('addFillProgress', () => {
    it('should add fill progress element with correct classes', () => {
      const toastData = createMockToastData();
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      
      const element = builder.addFillProgress().build();
      const fillProgress = element.querySelector('.fill-progress');

      expect(fillProgress).toBeTruthy();
      expect(fillProgress?.className).toContain('fill-success');
      expect(fillProgress?.className).toContain('animation-left-to-right');
    });

    it('should set correct initial styles for horizontal animations', () => {
      const toastData = createMockToastData();
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      
      const element = builder.addFillProgress().build();
      const fillProgress = element.querySelector('.fill-progress') as HTMLElement;

      expect(fillProgress.style.width).toBe('0%');
      expect(fillProgress.style.height).toBe('');
    });

    it('should set correct initial styles for vertical animations', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          animationDirection: 'top-to-bottom',
        },
      });
      
      const config = {
        ...mockGlobalConfig,
        animationDirection: 'top-to-bottom' as const,
      };
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, config, mockIcons);
      const element = builder.addFillProgress().build();
      const fillProgress = element.querySelector('.fill-progress') as HTMLElement;

      expect(fillProgress.style.height).toBe('0%');
      expect(fillProgress.style.width).toBe('100%');
    });
  });

  describe('addContent', () => {
    it('should add content with icon, text, and close button', () => {
      const toastData = createMockToastData();
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      
      const element = builder.addContent().build();
      const content = element.querySelector('.toast-content');
      const icon = element.querySelector('.toast-icon');
      const title = element.querySelector('.toast-title');
      const message = element.querySelector('.toast-message');
      const closeButton = element.querySelector('.toast-close-button');

      expect(content).toBeTruthy();
      expect(icon).toBeTruthy();
      expect(icon?.innerHTML).toBe('<svg>success</svg>');
      expect(title?.textContent).toBe('Success');
      expect(message?.textContent).toBe('Test message');
      expect(closeButton).toBeTruthy();
    });

    it('should not add close button when showCloseButton is false', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          showCloseButton: false,
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.addContent().build();
      const closeButton = element.querySelector('.toast-close-button');

      expect(closeButton).toBeFalsy();
    });

    it('should use custom icon when provided', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          icon: '<svg>custom</svg>',
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.addContent().build();
      const icon = element.querySelector('.toast-icon');

      expect(icon?.innerHTML).toBe('<svg>custom</svg>');
    });

    it('should sanitize message content', () => {
      const toastData = createMockToastData({
        message: '<script>alert("XSS")</script>',
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.addContent().build();
      const message = element.querySelector('.toast-message');

      expect(message?.textContent).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });
  });

  describe('applyCustomStyles', () => {
    it('should apply custom background color', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          backgroundColor: '#ff0000',
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.applyCustomStyles().build();

      expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('should apply custom text color', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          textColor: '#00ff00',
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.applyCustomStyles().build();

      expect(element.style.color).toBe('rgb(0, 255, 0)');
    });

    it('should apply custom border color', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          borderColor: '#0000ff',
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.addBorders().applyCustomStyles().build();
      const borders = element.querySelectorAll('.border-element');

      // Accept both hex and rgb formats
      expect(['#0000ff', 'rgb(0, 0, 255)']).toContain(element.style.borderColor);
      borders.forEach(border => {
        expect(['#0000ff', 'rgb(0, 0, 255)']).toContain((border as HTMLElement).style.backgroundColor);
      });
    });

    it('should add custom class name', () => {
      const toastData = createMockToastData({
        options: {
          ...createMockToastData().options,
          className: 'custom-toast',
        },
      });
      
      const builder = new ToastBuilder(toastData, mockTypeConfig, mockGlobalConfig, mockIcons);
      const element = builder.applyCustomStyles().build();

      expect(element.className).toContain('custom-toast');
    });
  });
});