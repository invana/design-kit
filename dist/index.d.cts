import React from 'react';
import { Theme, ThemeVariant } from '@invana/styling/themes.config';
import { NavHorizontalProps, NavVerticalProps } from '@invana/ui';

type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeContextValue {
    /** Active theme id, e.g. "default", "tailwind", "vite" */
    theme: string;
    /** Active mode */
    mode: ThemeMode;
    /** Full variant id applied to the DOM, e.g. "default-dark" */
    variantId: string;
    /** Whether dark mode is currently active (resolved, even for "system") */
    isDark: boolean;
    /** All available themes */
    themes: Theme[];
    /** All available flat variants */
    variants: ThemeVariant[];
    /** Switch to a different theme (keeps the current mode) */
    setTheme: (themeId: string) => void;
    /** Switch mode. "system" will follow prefers-color-scheme */
    setMode: (mode: ThemeMode) => void;
    /** Convenience toggle between light ↔ dark */
    toggleMode: () => void;
}
interface ThemeProviderProps {
    children: React.ReactNode;
    /** Default theme id. @default "default" */
    defaultTheme?: string;
    /** Default mode. @default "system" */
    defaultMode?: ThemeMode;
    /**
     * Storage key for persisting the selection.
     * Set to null to disable persistence.
     * @default "invana-theme"
     */
    storageKey?: string | null;
}
declare const ThemeProvider: React.FC<ThemeProviderProps>;
/**
 * Access the current theme and controls anywhere inside a `<ThemeProvider>`.
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleMode, setTheme } = useTheme();
 * ```
 */
declare function useTheme(): ThemeContextValue;

interface AppLayoutBaseProps {
    className?: string;
    header: NavHorizontalProps;
    main: React.ReactNode;
    mainClassName?: string;
    footer: NavHorizontalProps;
}
declare const AppLayoutBase: React.FC<AppLayoutBaseProps>;

interface AppLayoutV1Props {
    leftNav: NavVerticalProps;
    className?: string;
    header: NavHorizontalProps;
    main: React.ReactNode;
    mainClassName?: string;
    footer: NavHorizontalProps;
}
declare const AppLayoutV1: React.FC<AppLayoutV1Props>;

interface SectionConfig {
    content: React.ReactNode;
    defaultSize?: number | string;
    minSize?: number | string;
    maxSize?: number | string;
    collapsible?: boolean;
}
interface MainSectionConfig {
    content: React.ReactNode;
    defaultSize?: number | string;
    minSize?: number | string;
}
interface AppLayoutV2Props {
    className?: string;
    header: NavHorizontalProps;
    footer?: NavHorizontalProps;
    mainClassName?: string;
    leftNav: NavVerticalProps;
    leftSection?: SectionConfig;
    mainSection: MainSectionConfig;
    bottomSection?: SectionConfig;
    rightSection?: SectionConfig;
}
declare const AppLayoutV2: React.FC<AppLayoutV2Props>;

export { AppLayoutBase, type AppLayoutBaseProps, AppLayoutV1, type AppLayoutV1Props, AppLayoutV2, type AppLayoutV2Props, type MainSectionConfig, type SectionConfig, type ThemeContextValue, type ThemeMode, ThemeProvider, type ThemeProviderProps, useTheme };
