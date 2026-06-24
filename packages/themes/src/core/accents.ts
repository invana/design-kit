import type React from 'react';

/**
 * A selectable accent colour. The accent overrides a theme's signature
 * `--primary` / `--accent` / `--ring` tokens so any preset can be re-tinted
 * without authoring a whole new theme. `light` / `dark` are raw HSL triplets
 * (`"H S% L%"`, no `hsl()` wrapper) so they drop straight into the Tailwind v4
 * token format used across `@invana/styling`.
 */
export interface AccentColor {
  id: string;
  name: string;
  /** Solid colour shown in the picker swatch. */
  swatch: string;
  /** Raw HSL triplet applied in light mode, e.g. `"142 70% 43%"`. */
  light: string;
  /** Raw HSL triplet applied in dark mode. */
  dark: string;
}

/**
 * The default 12-colour accent palette (matches the Storybook showcase strip).
 * Pass a custom array to `<ThemeSelector accents={...} />` to override.
 */
export const DEFAULT_ACCENTS: AccentColor[] = [
  { id: 'green', name: 'Green', swatch: '#22c55e', light: '142 70% 43%', dark: '142 70% 60%' },
  { id: 'emerald', name: 'Emerald', swatch: '#10b981', light: '160 84% 39%', dark: '160 84% 55%' },
  { id: 'teal', name: 'Teal', swatch: '#14b8a6', light: '172 66% 50%', dark: '172 66% 65%' },
  { id: 'cyan', name: 'Cyan', swatch: '#0ea5e9', light: '199 89% 48%', dark: '198 93% 60%' },
  { id: 'blue', name: 'Blue', swatch: '#3b82f6', light: '217 91% 60%', dark: '217 91% 70%' },
  { id: 'indigo', name: 'Indigo', swatch: '#747bff', light: '235 85% 70%', dark: '235 85% 75%' },
  { id: 'purple', name: 'Purple', swatch: '#a855f7', light: '271 81% 56%', dark: '271 81% 70%' },
  { id: 'pink', name: 'Pink', swatch: '#ec4899', light: '330 81% 60%', dark: '330 81% 70%' },
  { id: 'red', name: 'Red', swatch: '#ef4444', light: '0 84% 60%', dark: '0 84% 70%' },
  { id: 'orange', name: 'Orange', swatch: '#f97316', light: '24 95% 53%', dark: '24 95% 65%' },
  { id: 'amber', name: 'Amber', swatch: '#f59e0b', light: '38 92% 50%', dark: '38 92% 60%' },
  { id: 'slate', name: 'Slate', swatch: '#64748b', light: '215 16% 47%', dark: '215 16% 60%' },
];

/** Look an accent up by id in a (possibly custom) palette. */
export function findAccent(
  id: string | null | undefined,
  accents: AccentColor[] = DEFAULT_ACCENTS
): AccentColor | undefined {
  if (!id) return undefined;
  return accents.find((a) => a.id === id);
}

/**
 * Build the CSS custom-property overrides for an accent. Spread the result onto
 * the `style` of whatever subtree should be re-tinted (see `<ThemeScope>`).
 * Returns an empty object when no accent is selected, so the active theme keeps
 * its own signature colour.
 */
export function accentVars(
  accent: AccentColor | null | undefined,
  isDark: boolean
): React.CSSProperties {
  if (!accent) return {};

  const raw = isDark ? accent.dark : accent.light;
  const hsl = `hsl(${raw})`;

  return {
    '--primary': raw,
    '--primary-foreground': '0 0% 100%',
    '--accent': raw,
    '--accent-foreground': '0 0% 100%',
    '--ring': raw,
    '--color-primary': hsl,
    '--color-primary-foreground': 'hsl(0 0% 100%)',
    '--color-accent': hsl,
    '--color-accent-foreground': 'hsl(0 0% 100%)',
    '--color-ring': hsl,
  } as React.CSSProperties;
}
