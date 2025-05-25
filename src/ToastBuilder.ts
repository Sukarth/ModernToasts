import { ToastData, AnimationDirection } from './types';
import { CSS_CLASSES } from './constants';
import { sanitizeHtml } from './utils';

interface ToastTypeConfig {
  title: string;
  ariaRole: 'status' | 'alert';
  baseClass: string;
  borderColorClass: string;
  fillColorClass: string;
  iconColorClass: string;
}

/**
 * Builder class for creating toast elements
 * Simplifies the complex toast creation logic
 */
export class ToastBuilder {
  private toastEl: HTMLElement;
  private fragment: DocumentFragment;
  private config: ToastTypeConfig;
  private animationDirection: AnimationDirection;
  private enableBorderAnimation: boolean;
  private enableFillAnimation: boolean;
  private icons: Record<string, string>;

  constructor(
    private toastData: ToastData,
    typeConfig: ToastTypeConfig,
    globalConfig: {
      animationDirection: AnimationDirection;
      enableBorderAnimation: boolean;
      enableFillAnimation: boolean;
    },
    icons: Record<string, string>
  ) {
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
  private createContainer(): HTMLElement {
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
  addBorders(): ToastBuilder {
    const borders = this.createBorderElements();
    borders.forEach(border => this.fragment.appendChild(border));
    return this;
  }

  /**
   * Create border elements based on animation direction
   */
  private createBorderElements(): HTMLElement[] {
    const borders: HTMLElement[] = [];
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
  private getBorderConfigurations(): Array<{class: string; initialStyles: Record<string, string>}> {
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
  addFillProgress(): ToastBuilder {
    const fillProgressEl = document.createElement('div');
    fillProgressEl.className = `${CSS_CLASSES.FILL_PROGRESS} ${this.config.fillColorClass} animation-${this.animationDirection}`;

    // Set initial styles based on animation direction
    if (this.animationDirection === 'top-to-bottom' || this.animationDirection === 'bottom-to-top') {
      fillProgressEl.style.height = '0%';
      fillProgressEl.style.width = '100%';
    } else {
      fillProgressEl.style.width = '0%';
    }

    this.fragment.appendChild(fillProgressEl);
    return this;
  }

  /**
   * Add toast content (icon, text, close button)
   */
  addContent(): ToastBuilder {
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
  private createIcon(): HTMLElement {
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
  private createTextContent(): HTMLElement {
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
  private createCloseButton(): HTMLElement {
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
  applyCustomStyles(): ToastBuilder {
    const { backgroundColor, textColor, borderColor } = this.toastData.options;

    if (backgroundColor) {
      this.toastEl.style.backgroundColor = backgroundColor;
    }

    if (textColor) {
      this.toastEl.style.color = textColor;
    }

    if (borderColor) {
      this.toastEl.style.borderColor = borderColor;
      // Also update border elements
      const borderElements = this.fragment.querySelectorAll(`.${CSS_CLASSES.BORDER_ELEMENT}`);
      borderElements.forEach((el: Element) => {
        (el as HTMLElement).style.backgroundColor = borderColor;
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
  build(): HTMLElement {
    // Append all fragments to the toast element
    this.toastEl.appendChild(this.fragment);
    return this.toastEl;
  }
}