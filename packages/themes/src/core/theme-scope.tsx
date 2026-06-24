import React from 'react';
import { useThemeOptional } from './theme-provider';

export interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Accent CSS variables to apply. When omitted, the value is read from the
   * surrounding `<ThemeProvider>` (`accentVars`). Pass explicitly for
   * standalone use without a provider.
   */
  accentVars?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Wraps a subtree and applies the active accent override to it. Because accents
 * are scoped (not written to the document root), only the content inside a
 * `<ThemeScope>` is re-tinted — a parent app keeps its own colours. Pair it with
 * `<ThemeSelector>` so picking an accent recolours the wrapped preview/section.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <ThemeSelector />
 *   <ThemeScope>
 *     <YourApp />
 *   </ThemeScope>
 * </ThemeProvider>
 * ```
 */
export const ThemeScope: React.FC<ThemeScopeProps> = ({
  accentVars,
  children,
  style,
  ...rest
}) => {
  const ctx = useThemeOptional();
  const vars = accentVars ?? ctx?.accentVars ?? {};

  return (
    <div style={{ ...vars, ...style }} {...rest}>
      {children}
    </div>
  );
};
