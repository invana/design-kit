import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  themes,
  applyTheme,
  getThemeVariantById,
  getAllThemeVariants,
  type Theme,
  type ThemeVariant,
} from '@invana/styling/themes.config';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
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

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'invana-theme';

function readStorage(): { theme: string; mode: ThemeMode } | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    return JSON.parse(raw) as { theme: string; mode: ThemeMode };
  } catch {
    return null;
  }
}

function writeStorage(theme: string, mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, mode }));
  } catch {
    // ignore
  }
}

// ─── Resolve effective dark/light from "system" ───────────────────────────────

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
}

function buildVariantId(themeId: string, mode: ThemeMode, isDark: boolean): string {
  if (mode === 'system') {
    return `${themeId}-${isDark ? 'dark' : 'light'}`;
  }
  return `${themeId}-${mode}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'default',
  defaultMode = 'system',
}) => {
  const [theme, setThemeState] = useState<string>(() => {
    return readStorage()?.theme ?? defaultTheme;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return readStorage()?.mode ?? defaultMode;
  });

  const [isDark, setIsDark] = useState<boolean>(() => resolveIsDark(mode));

  // Keep isDark in sync when mode === 'system' and the OS preference changes.
  useEffect(() => {
    if (mode !== 'system') {
      setIsDark(mode === 'dark');
      return;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  // Apply theme to DOM whenever theme / mode / isDark changes.
  useEffect(() => {
    const variantId = buildVariantId(theme, mode, isDark);
    // Validate the variant exists before applying
    const resolved = getThemeVariantById(variantId);
    if (resolved) {
      applyTheme(variantId);
    } else {
      // Fallback to default-light
      applyTheme('default-light');
    }
  }, [theme, mode, isDark]);

  const setTheme = useCallback((themeId: string) => {
    setThemeState(themeId);
    writeStorage(themeId, mode);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    writeStorage(theme, newMode);
  }, [theme]);

  const toggleMode = useCallback(() => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setModeState(next);
    writeStorage(theme, next);
  }, [isDark, theme]);

  const variantId = buildVariantId(theme, mode, isDark);

  const value: ThemeContextValue = {
    theme,
    mode,
    variantId,
    isDark,
    themes,
    variants: getAllThemeVariants(),
    setTheme,
    setMode,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the current theme and controls anywhere inside a `<ThemeProvider>`.
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleMode, setTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
