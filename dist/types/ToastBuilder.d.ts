import { ToastData, AnimationDirection } from './types';
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
export declare class ToastBuilder {
    private toastData;
    private toastEl;
    private fragment;
    private config;
    private animationDirection;
    private enableBorderAnimation;
    private enableFillAnimation;
    private icons;
    constructor(toastData: ToastData, typeConfig: ToastTypeConfig, globalConfig: {
        animationDirection: AnimationDirection;
        enableBorderAnimation: boolean;
        enableFillAnimation: boolean;
    }, icons: Record<string, string>);
    /**
     * Create the main toast container
     */
    private createContainer;
    /**
     * Add border elements based on animation direction
     */
    addBorders(): ToastBuilder;
    /**
     * Create border elements based on animation direction
     */
    private createBorderElements;
    /**
     * Get border configurations based on animation direction
     */
    private getBorderConfigurations;
    /**
     * Add fill progress element
     */
    addFillProgress(): ToastBuilder;
    /**
     * Add toast content (icon, text, close button)
     */
    addContent(): ToastBuilder;
    /**
     * Create icon element
     */
    private createIcon;
    /**
     * Create text content
     */
    private createTextContent;
    /**
     * Create close button
     */
    private createCloseButton;
    /**
     * Apply custom styles if provided
     */
    applyCustomStyles(): ToastBuilder;
    /**
     * Build and return the complete toast element
     */
    build(): HTMLElement;
}
export {};
//# sourceMappingURL=ToastBuilder.d.ts.map