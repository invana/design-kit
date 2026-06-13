/**
 * Theme Configuration System
 * Central configuration for all available themes
 */

export interface ThemeVariant {
  id: string;
  name: string;
  mode: 'light' | 'dark' | 'system';
  icon?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  variants: ThemeVariant[];
}

/**
 * Theme Presets contributed as first-class themes. Unlike the classic themes
 * (which vary by light/dark/system), each preset is a single mode and its
 * selectable accent swatches become the "variant" axis — e.g. theme `dark-gold`
 * with variants `dark-gold-gold`, `dark-gold-ocean`, … The colours for every
 * combination are plain CSS in `themes/presets.css`; only the ids/names/modes
 * are listed here so they register with the toolbar and `applyTheme()`.
 */
const DARK_ACCENTS: [string, string][] = [
  ['gold', 'Gold'], ['ocean', 'Ocean'], ['emerald', 'Emerald'], ['rose', 'Rose'],
  ['purple', 'Purple'], ['amber', 'Amber'], ['teal', 'Teal'], ['silver', 'Silver'],
];
const LIGHT_ACCENTS: [string, string][] = [
  ['indigo', 'Indigo'], ['ocean', 'Ocean'], ['emerald', 'Emerald'], ['rose', 'Rose'],
  ['purple', 'Purple'], ['amber', 'Amber'], ['teal', 'Teal'], ['slate', 'Slate'],
];

// `default` is each preset's signature accent. It is
// placed FIRST so it becomes the theme's default variant (variants[0]) — the value
// consumers fall back to when no accent is specified.
const PRESET_THEMES: { id: string; name: string; dark: boolean; accents: [string, string][]; default: string }[] = [
  { id: 'dark-gold', name: 'Dark Gold', dark: true, accents: DARK_ACCENTS, default: 'gold' },
  { id: 'dark-ocean', name: 'Dark Ocean', dark: true, accents: DARK_ACCENTS, default: 'ocean' },
  { id: 'dark-forest', name: 'Dark Forest', dark: true, accents: DARK_ACCENTS, default: 'emerald' },
  { id: 'dark-rose', name: 'Dark Rose', dark: true, accents: DARK_ACCENTS, default: 'rose' },
  { id: 'light-minimal', name: 'Light Minimal', dark: false, accents: LIGHT_ACCENTS, default: 'indigo' },
];

function buildPresetThemes(): Theme[] {
  return PRESET_THEMES.map((p) => {
    // Signature accent first → it becomes variants[0] (the theme's default).
    const ordered = [
      ...p.accents.filter(([id]) => id === p.default),
      ...p.accents.filter(([id]) => id !== p.default),
    ];
    return {
      id: p.id,
      name: p.name,
      description: `${p.name} preset — pick an accent swatch (${p.dark ? 'dark' : 'light'} mode)`,
      variants: ordered.map(([accentId, accentName]) => ({
        id: `${p.id}-${accentId}`,
        name: accentName,
        mode: (p.dark ? 'dark' : 'light') as ThemeVariant['mode'],
        icon: 'circle',
      })),
    };
  });
}

export const themes: Theme[] = [
  {
    id: 'default',
    name: 'Invana',
    description: 'Default Invana brand theme with green accents',
    variants: [
      { id: 'default-light', name: 'Invana Light', mode: 'light', icon: 'sun' },
      { id: 'default-dark', name: 'Invana Dark', mode: 'dark', icon: 'moon' },
      { id: 'default-system', name: 'Invana System', mode: 'system', icon: 'circle' }
    ]
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    description: 'Inspired by tailwindcss.com - black primary buttons, sky/cyan accents',
    variants: [
      { id: 'tailwind-light', name: 'Tailwind Light', mode: 'light', icon: 'sun' },
      { id: 'tailwind-dark', name: 'Tailwind Dark', mode: 'dark', icon: 'moon' },
      { id: 'tailwind-system', name: 'Tailwind System', mode: 'system', icon: 'circle' }
    ]
  },
  {
    id: 'vite',
    name: 'Vite',
    description: 'Inspired by vite.dev - indigo/violet brand (#646cff)',
    variants: [
      { id: 'vite-light', name: 'Vite Light', mode: 'light', icon: 'sun' },
      { id: 'vite-dark', name: 'Vite Dark', mode: 'dark', icon: 'moon' },
      { id: 'vite-system', name: 'Vite System', mode: 'system', icon: 'circle' }
    ]
  },
  ...buildPresetThemes()
];

/**
 * Get all theme variants as a flat list for selection
 */
export function getAllThemeVariants(): ThemeVariant[] {
  return themes.flatMap(theme => theme.variants);
}

/**
 * Get a theme by its ID
 */
export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}

/**
 * Get a theme variant by its ID
 */
export function getThemeVariantById(id: string): { theme: Theme; variant: ThemeVariant } | undefined {
  for (const theme of themes) {
    const variant = theme.variants.find(v => v.id === id);
    if (variant) {
      return { theme, variant };
    }
  }
  return undefined;
}

/**
 * Get the default theme variant
 */
export function getDefaultThemeVariant(): ThemeVariant {
  return themes[0].variants[0];
}

/**
 * Apply a theme to the document
 */
export function applyTheme(variantId: string): void {
  const root = document.documentElement;
  const result = getThemeVariantById(variantId);
  
  if (!result) {
    console.warn(`Theme variant "${variantId}" not found`);
    return;
  }
  
  const { variant } = result;
  
  // Remove all existing theme classes
  getAllThemeVariants().forEach(v => {
    root.classList.remove(`theme-${v.id}`);
  });
  
  // Handle system mode with prefers-color-scheme detection
  if (variant.mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveMode = prefersDark ? 'dark' : 'light';
    const themeBase = variantId.replace('-system', '');
    const effectiveVariantId = `${themeBase}-${effectiveMode}`;
    
    // Apply the effective theme
    root.setAttribute('data-theme', effectiveVariantId);
    root.classList.add(`theme-${effectiveVariantId}`, effectiveMode);
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveMode);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? 'dark' : 'light';
      const newVariantId = `${themeBase}-${newMode}`;
      const oldVariantId = `${themeBase}-${e.matches ? 'light' : 'dark'}`;
      
      root.setAttribute('data-theme', newVariantId);
      root.classList.remove(`theme-${oldVariantId}`, 'light', 'dark');
      root.classList.add(`theme-${newVariantId}`, newMode);
    };
    
    // Clean up previous listener and add new one
    if ((window as any).__themeMediaQueryHandler) {
      mediaQuery.removeEventListener('change', (window as any).__themeMediaQueryHandler);
    }
    (window as any).__themeMediaQueryHandler = handleChange;
    mediaQuery.addEventListener('change', handleChange);
  } else {
    // Apply light or dark mode directly
    root.setAttribute('data-theme', variantId);
    root.classList.add(`theme-${variantId}`, variant.mode);
    root.classList.remove('light', 'dark');
    root.classList.add(variant.mode);
    
    // Clean up system mode listener if switching away from system mode
    if ((window as any).__themeMediaQueryHandler) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.removeEventListener('change', (window as any).__themeMediaQueryHandler);
      delete (window as any).__themeMediaQueryHandler;
    }
  }
}

/**
 * Get theme variant for Storybook toolbar items
 */
export function getStorybookThemeItems() {
  return getAllThemeVariants().map(variant => ({
    value: variant.id,
    title: variant.name,
    icon: variant.icon || (variant.mode === 'system' ? 'circle' : variant.mode === 'light' ? 'sun' : 'moon')
  }));
}
