import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  themes,
  applyTheme,
  getThemeVariantById,
  getAllThemeVariants,
  type Theme,
  type ThemeVariant,
} from '@invana/styling/themes.config';
import { DEFAULT_ACCENTS, findAccent, accentVars, type AccentColor } from './accents';

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
  /** Active accent id, or `null` when the theme uses its own signature accent. */
  accent: string | null;
  /** Available accent colours offered to pickers. */
  accents: AccentColor[];
  /**
   * CSS custom-property overrides for the active accent (empty when none).
   * Spread onto a subtree's `style` — see `<ThemeScope>` — to re-tint it.
   */
  accentVars: React.CSSProperties;
  /** Switch to a different theme (keeps the current mode) */
  setTheme: (themeId: string) => void;
  /** Switch mode. "system" will follow prefers-color-scheme */
  setMode: (mode: ThemeMode) => void;
  /** Convenience toggle between light ↔ dark */
  toggleMode: () => void;
  /** Override the accent, or pass `null` to fall back to the theme's own. */
  setAccent: (accent: string | null) => void;
  /**
   * Persist the current selection now. Only needed with `persist="manual"` —
   * where live changes apply but don't survive a reload until `commit()` is
   * called (e.g. a "Save as default" button). A no-op when persistence is off.
   */
  commit: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Storage helpers ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'invana-theme';

interface StoredState {
  theme: string;
  mode: ThemeMode;
  accent?: string | null;
}

function readStorage(): StoredState | null {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function writeStorage(theme: string, mode: ThemeMode, accent: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, mode, accent }));
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
  /** Default accent id, or `null` to use the theme's own. @default null */
  defaultAccent?: string | null;
  /** Accent palette offered by pickers. @default DEFAULT_ACCENTS */
  accents?: AccentColor[];
  /**
   * When the selection is persisted to storage:
   * - `"change"` — on every change (an app theme switcher that should stick).
   * - `"manual"` — only when `commit()` is called, so live previews don't
   *   survive a reload until explicitly saved (a settings panel with "Save").
   *
   * The last persisted selection is always restored on load, regardless of mode.
   * @default "change"
   */
  persist?: 'change' | 'manual';
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
  defaultAccent = null,
  accents = DEFAULT_ACCENTS,
  persist = 'change',
}) => {
  const [theme, setThemeState] = useState<string>(() => {
    return readStorage()?.theme ?? defaultTheme;
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    return readStorage()?.mode ?? defaultMode;
  });

  const [accent, setAccentState] = useState<string | null>(() => {
    return readStorage()?.accent ?? defaultAccent;
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
    if (persist === 'change') writeStorage(themeId, mode, accent);
  }, [mode, accent, persist]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    if (persist === 'change') writeStorage(theme, newMode, accent);
  }, [theme, accent, persist]);

  const toggleMode = useCallback(() => {
    const next: ThemeMode = isDark ? 'light' : 'dark';
    setModeState(next);
    if (persist === 'change') writeStorage(theme, next, accent);
  }, [isDark, theme, accent, persist]);

  const setAccent = useCallback((next: string | null) => {
    setAccentState(next);
    if (persist === 'change') writeStorage(theme, mode, next);
  }, [theme, mode, persist]);

  // Persist the current selection on demand (for `persist="manual"`).
  const commit = useCallback(() => {
    writeStorage(theme, mode, accent);
  }, [theme, mode, accent]);

  const variantId = buildVariantId(theme, mode, isDark);
  const resolvedAccentVars = accentVars(findAccent(accent, accents), isDark);

  const value: ThemeContextValue = {
    theme,
    mode,
    variantId,
    isDark,
    themes,
    variants: getAllThemeVariants(),
    accent,
    accents,
    accentVars: resolvedAccentVars,
    setTheme,
    setMode,
    toggleMode,
    setAccent,
    commit,
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

/**
 * Like {@link useTheme}, but returns `null` instead of throwing when there is no
 * surrounding `<ThemeProvider>`. Lets a component bind to the provider when one
 * exists and fall back to its own state otherwise.
 */
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
