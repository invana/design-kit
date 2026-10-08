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
 * Colour-preset themes contributed as first-class themes. Each preset is a named
 * palette (Gold, Ocean, Forest, Rose, Minimal) carrying its own signature accent,
 * and — like the classic themes — varies by light/dark/system. The variants are
 * `${id}-light`, `${id}-dark`, `${id}-system`; the colours for the light and dark
 * blocks are plain CSS in `themes/presets.css`. Only the ids/names/modes are
 * listed here so they register with the toolbar and `applyTheme()`.
 */
const PRESET_THEMES: { id: string; name: string; description: string }[] = [
  { id: 'gold', name: 'Gold', description: 'Warm gold accent — near-black canvas (dark) or cream (light)' },
  { id: 'ocean', name: 'Ocean', description: 'Cool blue accent — deep navy canvas (dark) or soft sky-grey (light)' },
  { id: 'forest', name: 'Forest', description: 'Emerald accent — deep green-black canvas (dark) or pale green (light)' },
  { id: 'rose', name: 'Rose', description: 'Rose accent — warm near-black canvas (dark) or blush (light)' },
  { id: 'minimal', name: 'Minimal', description: 'Indigo accent on a clean neutral canvas, light or dark' },
];

function buildPresetThemes(): Theme[] {
  return PRESET_THEMES.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    variants: [
      { id: `${p.id}-light`, name: `${p.name} Light`, mode: 'light', icon: 'sun' },
      { id: `${p.id}-dark`, name: `${p.name} Dark`, mode: 'dark', icon: 'moon' },
      { id: `${p.id}-system`, name: `${p.name} System`, mode: 'system', icon: 'circle' },
    ],
  }));
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
