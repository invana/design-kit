import React, { useState, useEffect, useMemo } from 'react';
import { themes, applyTheme } from '@invana/styling/themes.config';
import { Button, Separator } from '@invana/ui';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@invana/forms';
import { Sun, Moon } from 'lucide-react';

export interface ThemeControlsProps {
  /**
   * Initial theme ID from Storybook globals
   */
  storybookTheme?: string;
  /**
   * Initial variant (light/dark) from Storybook globals
   */
  storybookVariant?: string;
  /**
   * Whether to show the theme selector dropdown
   * @default true
   */
  showThemeSelector?: boolean;
  /**
   * Whether to show the accent color selector
   * @default true
   */
  showAccentSelector?: boolean;
  /**
   * Whether to show the dark/light mode toggle
   * @default true
   */
  showModeToggle?: boolean;
  /**
   * Custom CSS class for the container
   */
  className?: string;
  /**
   * Current theme (controlled)
   */
  currentTheme?: string;
  /**
   * Current accent (controlled)
   */
  currentAccent?: string;
  /**
   * Is dark mode (controlled)
   */
  isDarkMode?: boolean;
  /**
   * Callback when theme changes
   */
  onThemeChange?: (theme: string) => void;
  /**
   * Callback when accent changes
   */
  onAccentChange?: (accent: string) => void;
  /**
   * Callback when mode changes
   */
  onModeChange?: (isDark: boolean) => void;
}

export interface UseThemeControlsResult {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  currentAccent: string;
  setCurrentAccent: (accent: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  currentVariant: string;
  accentHsl: string;
  accentStyles: React.CSSProperties;
}

/**
 * Hook for managing theme state and applying themes
 */
export const useThemeControls = (
  storybookTheme = 'default',
  storybookVariant = 'light'
): UseThemeControlsResult => {
  const [currentTheme, setCurrentTheme] = useState(storybookTheme);
  const [isDarkMode, setIsDarkMode] = useState(storybookVariant === 'dark');
  const [currentAccent, setCurrentAccent] = useState('green');

  // Accent color mappings (HSL values for light/dark modes)
  const accentColorMap: Record<string, { light: string; dark: string }> = {
    green: { light: 'hsl(142 70% 43%)', dark: 'hsl(142 70% 60%)' },
    emerald: { light: 'hsl(160 84% 39%)', dark: 'hsl(160 84% 55%)' },
    teal: { light: 'hsl(172 66% 50%)', dark: 'hsl(172 66% 65%)' },
    cyan: { light: 'hsl(199 89% 48%)', dark: 'hsl(198 93% 60%)' },
    blue: { light: 'hsl(217 91% 60%)', dark: 'hsl(217 91% 70%)' },
    indigo: { light: 'hsl(235 85% 70%)', dark: 'hsl(235 85% 75%)' },
    purple: { light: 'hsl(271 81% 56%)', dark: 'hsl(271 81% 70%)' },
    pink: { light: 'hsl(330 81% 60%)', dark: 'hsl(330 81% 70%)' },
    red: { light: 'hsl(0 84% 60%)', dark: 'hsl(0 84% 70%)' },
    orange: { light: 'hsl(24 95% 53%)', dark: 'hsl(24 95% 65%)' },
    amber: { light: 'hsl(38 92% 50%)', dark: 'hsl(38 92% 60%)' },
    slate: { light: 'hsl(215 16% 47%)', dark: 'hsl(215 16% 60%)' },
  };

  // Sync with Storybook's global theme/variant selection
  useEffect(() => {
    setCurrentTheme(storybookTheme);
  }, [storybookTheme]);

  useEffect(() => {
    setIsDarkMode(storybookVariant === 'dark');
  }, [storybookVariant]);

  // Get current theme variant based on theme and mode
  const currentVariant = useMemo(() => {
    return (
      themes
        .find((t: any) => t.id === currentTheme)
        ?.variants.find((v: any) => v.mode === (isDarkMode ? 'dark' : 'light'))?.id ||
      'default-light'
    );
  }, [currentTheme, isDarkMode]);

  // Get accent color styles
  const accentHsl = useMemo(() => {
    return isDarkMode
      ? accentColorMap[currentAccent]?.dark
      : accentColorMap[currentAccent]?.light;
  }, [currentAccent, isDarkMode]);

  // Apply theme to document root when variant changes
  useEffect(() => {
    applyTheme(currentVariant);
  }, [currentVariant]);

  const accentStyles = useMemo(() => {
    if (!accentHsl) return {};
    
    // Extract HSL values without 'hsl()' wrapper for Tailwind
    const rawHsl = accentHsl.replace('hsl(', '').replace(')', '');
    
    return {
      '--primary': rawHsl,
      '--primary-foreground': '0 0% 100%',
      '--accent': rawHsl,
      '--accent-foreground': '0 0% 100%',
      '--ring': rawHsl,
      '--color-primary': accentHsl,
      '--color-primary-foreground': 'hsl(0 0% 100%)',
      '--color-accent': accentHsl,
      '--color-accent-foreground': 'hsl(0 0% 100%)',
      '--color-ring': accentHsl,
    } as React.CSSProperties;
  }, [accentHsl]);

  return {
    currentTheme,
    setCurrentTheme,
    currentAccent,
    setCurrentAccent,
    isDarkMode,
    setIsDarkMode,
    currentVariant,
    accentHsl,
    accentStyles,
  };
};

// Theme Selector Component (Dropdown)
const ThemeSelector = ({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}) => {
  const currentThemeObj = themes.find((t: any) => t.id === currentTheme);

  return (
    <Select value={currentTheme} onValueChange={onThemeChange}>
      <SelectTrigger className="w-35">
        <SelectValue>{currentThemeObj?.name || 'Select Theme'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {themes.map((theme: any) => (
          <SelectItem key={theme.id} value={theme.id}>
            {theme.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Accent Color Selector Component
const AccentSelector = ({
  currentAccent,
  onAccentChange,
}: {
  currentAccent: string;
  onAccentChange: (accent: string) => void;
}) => {
  // Accent colors palette
  const accentColors: Array<{ id: string; color: string; name: string }> = [
    { id: 'green', color: '#22c55e', name: 'Green' },
    { id: 'emerald', color: '#10b981', name: 'Emerald' },
    { id: 'teal', color: '#14b8a6', name: 'Teal' },
    { id: 'cyan', color: '#0ea5e9', name: 'Cyan' },
    { id: 'blue', color: '#3b82f6', name: 'Blue' },
    { id: 'indigo', color: '#747bff', name: 'Indigo' },
    { id: 'purple', color: '#a855f7', name: 'Purple' },
    { id: 'pink', color: '#ec4899', name: 'Pink' },
    { id: 'red', color: '#ef4444', name: 'Red' },
    { id: 'orange', color: '#f97316', name: 'Orange' },
    { id: 'amber', color: '#f59e0b', name: 'Amber' },
    { id: 'slate', color: '#64748b', name: 'Slate' },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {accentColors.map((accent) => (
        <button
          key={accent.id}
          onClick={() => onAccentChange(accent.id)}
          className={`w-7 h-7 rounded-full border-2 transition-all ${
            currentAccent === accent.id
              ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20'
              : 'border-border hover:border-foreground/50 hover:scale-105'
          }`}
          style={{ backgroundColor: accent.color }}
          title={accent.name}
          aria-label={`Select ${accent.name} accent color`}
        />
      ))}
    </div>
  );
};

// Mode Toggle Component
const ModeToggle = ({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) => (
  <Button variant="outline" size="icon" onClick={onToggle} className="relative">
    <Sun
      className={`h-4 w-4 transition-all ${
        isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      }`}
    />
    <Moon
      className={`absolute h-4 w-4 transition-all ${
        isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      }`}
    />
    <span className="sr-only">Toggle theme</span>
  </Button>
);

/**
 * ThemeControls Component
 * 
 * A reusable component that provides theme switching, accent color selection,
 * and light/dark mode toggle controls. Can be used across different stories.
 * 
 * @example
 * ```tsx
 * <ThemeControls
 *   storybookTheme={context.globals.theme}
 *   storybookVariant={context.globals.variant}
 *   showThemeSelector={true}
 *   showAccentSelector={true}
 *   showModeToggle={true}
 * />
 * ```
 */
export const ThemeControls: React.FC<ThemeControlsProps> = ({
  storybookTheme = 'default',
  storybookVariant = 'light',
  showThemeSelector = true,
  showAccentSelector = true,
  showModeToggle = true,
  className = '',
  currentTheme: controlledTheme,
  currentAccent: controlledAccent,
  isDarkMode: controlledIsDarkMode,
  onThemeChange,
  onAccentChange,
  onModeChange,
}) => {
  // Use controlled props if provided, otherwise fall back to internal state
  const internalHook = useThemeControls(storybookTheme, storybookVariant);
  
  const currentTheme = controlledTheme ?? internalHook.currentTheme;
  const currentAccent = controlledAccent ?? internalHook.currentAccent;
  const isDarkMode = controlledIsDarkMode ?? internalHook.isDarkMode;

  const handleThemeChange = (theme: string) => {
    if (!controlledTheme) {
      internalHook.setCurrentTheme(theme);
    }
    onThemeChange?.(theme);
  };

  const handleAccentChange = (accent: string) => {
    if (!controlledAccent) {
      internalHook.setCurrentAccent(accent);
    }
    onAccentChange?.(accent);
  };

  const handleModeToggle = () => {
    const newMode = !isDarkMode;
    if (controlledIsDarkMode === undefined) {
      internalHook.setIsDarkMode(newMode);
    }
    onModeChange?.(newMode);
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {showThemeSelector && (
        <>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
            />
          </div>
          {(showAccentSelector || showModeToggle) && (
            <Separator orientation="vertical" className="h-6 hidden md:block" />
          )}
        </>
      )}

      {showAccentSelector && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Accent:
            </span>
            <AccentSelector
              currentAccent={currentAccent}
              onAccentChange={handleAccentChange}
            />
          </div>
          {showModeToggle && <Separator orientation="vertical" className="h-6" />}
        </>
      )}

      {showModeToggle && (
        <ModeToggle isDark={isDarkMode} onToggle={handleModeToggle} />
      )}
    </div>
  );
};
