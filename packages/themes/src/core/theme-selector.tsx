import React, { useEffect, useMemo, useState } from 'react';
import {
  RichSelect,
  ToggleGroup,
  ToggleGroupItem,
  Separator,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  cn,
} from '@invana/ui';
import { themes, applyTheme, getThemeVariantById, type Theme } from '@invana/styling/themes.config';
import { useThemeOptional, type ThemeMode } from './theme-provider';
import { DEFAULT_ACCENTS, type AccentColor } from './accents';

/**
 * Icon components for the mode toggle, keyed by mode. Each is any component that
 * renders an icon (e.g. a `lucide-react` glyph, a custom SVG). Provide your own
 * so the package never bundles an icon library — when omitted, short text labels
 * ("Light" / "Dark" / "System") are shown instead.
 */
export interface ModeIcons {
  light?: React.ElementType;
  dark?: React.ElementType;
  system?: React.ElementType;
}

export interface ThemeSelectorProps {
  /**
   * `"inline"` — a single row (theme dropdown · mode toggle · accent swatches),
   * matching the Storybook header strip. `"form"` — stacked, labelled fields for
   * a settings panel.
   * @default "inline"
   */
  layout?: 'inline' | 'form';
  /** Show the theme picker. @default true */
  showTheme?: boolean;
  /**
   * How the theme picker renders: `"cards"` shows every theme inline as a
   * selectable card (name + colour preview, like the mode toggle); `"select"`
   * is a compact `RichSelect` dropdown. Defaults to `"cards"` for
   * `layout="form"` and `"select"` for `layout="inline"`.
   */
  themeVariant?: 'cards' | 'select';
  /** Show the light/dark/system segmented toggle. @default true */
  showMode?: boolean;
  /**
   * Icons for the mode toggle, so the package stays icon-library agnostic.
   * Omit to render text labels. e.g. `{ light: Sun, dark: Moon, system: Monitor }`
   * with your own `lucide-react` (or any) glyphs.
   */
  modeIcons?: ModeIcons;
  /** Show the accent swatch picker. @default true */
  showAccent?: boolean;
  /**
   * When the theme changes, clear any accent override so the accent picker snaps
   * back to the newly selected theme's own accent. @default true
   */
  resetAccentOnThemeChange?: boolean;
  /**
   * Themes to offer. Defaults to all themes registered in `@invana/styling`.
   * Pass a subset to limit the list, or your own array to add themes (their
   * `theme-<id>-<mode>` CSS must be registered for the palette to apply).
   */
  themes?: Theme[];
  /** Override the accent palette. @default DEFAULT_ACCENTS */
  accents?: AccentColor[];
  /** Field labels. */
  labels?: { theme?: string; mode?: string; accent?: string };
  className?: string;

  // ── Controlled overrides (optional). Provide value + handler to drive a
  //    field from outside (e.g. react-hook-form). Any field left uncontrolled
  //    binds to a surrounding <ThemeProvider>, or to internal state if none. ──
  theme?: string;
  mode?: ThemeMode;
  /** `null` = the theme's own accent. `undefined` = uncontrolled. */
  accent?: string | null;
  onThemeChange?: (theme: string) => void;
  onModeChange?: (mode: ThemeMode) => void;
  onAccentChange?: (accent: string | null) => void;

  /** Initial values for standalone (no-provider, uncontrolled) use. */
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  defaultAccent?: string | null;
}

/** Tokens previewed in each theme card, in display order. */
const SWATCH_TOKENS = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-muted', 'bg-border'] as const;

/** Dependency-free check glyph for the selected-theme badge. */
function CheckMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * A live colour preview of a theme. Carries the theme's own `theme-<id>-<mode>`
 * class so `bg-primary` / `bg-background` / … resolve to that theme's real
 * tokens — accurate, never hardcoded, and correct even when rendered in the
 * dropdown's body-level portal.
 */
function ThemeSwatches({
  themeId,
  isDark,
  className,
}: {
  themeId: string;
  isDark: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        `theme-${themeId}-${isDark ? 'dark' : 'light'}`,
        'inline-flex shrink-0 items-center gap-1 rounded-md border bg-background p-1',
        className
      )}
    >
      {SWATCH_TOKENS.map((token) => (
        <span key={token} className={cn('h-3 w-3 rounded-full', token)} />
      ))}
    </span>
  );
}

const MODES: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function prefersDark(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Resolve light/dark, following `prefers-color-scheme` for `"system"`. */
function useResolvedDark(mode: ThemeMode, override: boolean | undefined): boolean {
  const [isDark, setIsDark] = useState<boolean>(() =>
    override ?? (mode === 'dark' ? true : mode === 'light' ? false : prefersDark())
  );

  useEffect(() => {
    if (override !== undefined) {
      setIsDark(override);
      return;
    }
    if (mode !== 'system') {
      setIsDark(mode === 'dark');
      return;
    }
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, override]);

  return isDark;
}

/**
 * Theme / mode / accent picker. Drop it in a header (`layout="inline"`) or a
 * settings panel (`layout="form"`).
 *
 * State resolves per-field as **controlled prop › `<ThemeProvider>` › internal**:
 * - Inside a `<ThemeProvider>` it drives the provider (and persists).
 * - Standalone it self-applies theme + mode to the document root; pair it with
 *   `<ThemeScope>` so the chosen accent re-tints your preview.
 * - Pass `theme`/`mode`/`accent` + handlers to control any field externally.
 *
 * @example Header
 * ```tsx
 * <ThemeProvider><ThemeSelector /></ThemeProvider>
 * ```
 * @example Settings form
 * ```tsx
 * <ThemeSelector layout="form" />
 * ```
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  layout = 'inline',
  showTheme = true,
  themeVariant,
  showMode = true,
  showAccent = true,
  resetAccentOnThemeChange = true,
  modeIcons,
  themes: themeList = themes,
  accents = DEFAULT_ACCENTS,
  labels,
  className,
  theme: controlledTheme,
  mode: controlledMode,
  accent: controlledAccent,
  onThemeChange,
  onModeChange,
  onAccentChange,
  defaultTheme = 'default',
  defaultMode = 'system',
  defaultAccent = null,
}) => {
  const ctx = useThemeOptional();
  const hasProvider = !!ctx;

  // Internal fallback state — only authoritative when there's no provider and
  // the field isn't controlled.
  const [iTheme, setITheme] = useState(defaultTheme);
  const [iMode, setIMode] = useState<ThemeMode>(defaultMode);
  const [iAccent, setIAccent] = useState<string | null>(defaultAccent);

  // Effective values: controlled › provider › internal.
  const theme = controlledTheme ?? ctx?.theme ?? iTheme;
  const mode = controlledMode ?? ctx?.mode ?? iMode;
  const accent = controlledAccent !== undefined ? controlledAccent : (ctx?.accent ?? iAccent);

  const isDark = useResolvedDark(mode, hasProvider ? ctx!.isDark : undefined);

  // Standalone: apply theme + mode to the document root ourselves (the provider
  // does this when present).
  useEffect(() => {
    if (hasProvider) return;
    const id = mode === 'system' ? `${theme}-${isDark ? 'dark' : 'light'}` : `${theme}-${mode}`;
    applyTheme(getThemeVariantById(id) ? id : 'default-light');
  }, [hasProvider, theme, mode, isDark]);

  const changeTheme = (next: string) => {
    onThemeChange?.(next);
    if (controlledTheme === undefined) (ctx?.setTheme ?? setITheme)(next);
    // Drop the override so the accent row reflects the new theme's own accent.
    if (resetAccentOnThemeChange && accent !== null) changeAccent(null);
  };
  const changeMode = (next: ThemeMode) => {
    onModeChange?.(next);
    if (controlledMode === undefined) (ctx?.setMode ?? setIMode)(next);
  };
  const changeAccent = (next: string | null) => {
    onAccentChange?.(next);
    if (controlledAccent === undefined) (ctx?.setAccent ?? setIAccent)(next);
  };

  const themeOptions = useMemo(
    () => themeList.map((t) => ({ value: t.id, label: t.name, description: t.description })),
    [themeList]
  );

  const stacked = layout === 'form';

  const themeLabel = labels?.theme ?? 'Theme';
  const modeLabel = labels?.mode ?? 'Mode';
  const accentLabel = labels?.accent ?? 'Accent';

  const currentThemeDescription = themeList.find((t) => t.id === theme)?.description;
  const resolvedThemeVariant = themeVariant ?? (stacked ? 'cards' : 'select');

  // Cards: every theme shown inline as a selectable card (name + colour
  // preview), mirroring the mode toggle.
  const themeCards = (
    <TooltipProvider>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(v: string) => v && changeTheme(v)}
        variant="outline"
        className="flex flex-wrap justify-start gap-2"
      >
        {themeList.map((t) => {
          // Drive the highlight from JS (not the `data-[state]` CSS) so the
          // active card is unmistakable: primary border + tint + check badge.
          const selected = theme === t.id;
          return (
            <Tooltip key={t.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={t.id}
                  aria-label={t.name}
                  className={cn(
                    'relative h-auto min-w-24 flex-col items-start gap-1.5 rounded-md border-2 p-2',
                    selected
                      ? 'border-primary bg-primary/10 text-foreground shadow-sm hover:bg-primary/10'
                      : 'border-border text-foreground hover:border-foreground/40 hover:bg-transparent'
                  )}
                >
                  <ThemeSwatches themeId={t.id} isDark={isDark} />
                  <span className="px-0.5 text-xs font-medium">{t.name}</span>
                  {selected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                      <CheckMark className="h-2.5 w-2.5" />
                    </span>
                  )}
                </ToggleGroupItem>
              </TooltipTrigger>
              {t.description != null && <TooltipContent>{t.description}</TooltipContent>}
            </Tooltip>
          );
        })}
      </ToggleGroup>
    </TooltipProvider>
  );

  // Select: compact dropdown; each option is still a colour-preview card.
  const themeSelect = (
    <RichSelect
      label={themeLabel}
      options={themeOptions}
      value={theme}
      onChange={(v) => changeTheme(v as string)}
      triggerClassName={stacked ? 'w-full' : 'w-56'}
      tooltip={currentThemeDescription}
      renderOption={(option) => (
        <span className="flex w-full items-center gap-3 py-0.5">
          <ThemeSwatches themeId={option.value} isDark={isDark} />
          <span className="flex min-w-0 flex-col">
            <span className="font-medium">{option.label}</span>
            {option.description != null && (
              <span className="line-clamp-1 text-xs text-muted-foreground">{option.description}</span>
            )}
          </span>
        </span>
      )}
      renderValue={(selected) => {
        const only = selected[0];
        if (!only) return themeLabel;
        return (
          <span className="flex min-w-0 items-center gap-2">
            <ThemeSwatches themeId={only.value} isDark={isDark} className="p-0.5" />
            <span className="truncate">{only.label}</span>
          </span>
        );
      }}
    />
  );

  const themeField = showTheme && (
    <Field stacked={stacked} label={stacked ? themeLabel : undefined} inlineLabel={!stacked ? themeLabel : undefined}>
      {resolvedThemeVariant === 'cards' ? themeCards : themeSelect}
    </Field>
  );

  const modeField = showMode && (
    <Field stacked={stacked} label={stacked ? modeLabel : undefined} inlineLabel={!stacked ? modeLabel : undefined}>
      <TooltipProvider>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v: string) => v && changeMode(v as ThemeMode)}
          variant="outline"
          size="sm"
        >
          {MODES.map(({ value, label }) => {
            const Icon = modeIcons?.[value];
            return (
              <Tooltip key={value} delayDuration={0}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value={value} aria-label={label}>
                    {Icon ? <Icon className="h-4 w-4" /> : <span className="px-1 text-xs">{label}</span>}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            );
          })}
        </ToggleGroup>
      </TooltipProvider>
    </Field>
  );

  const accentField = showAccent && (
    <Field stacked={stacked} label={stacked ? accentLabel : undefined} inlineLabel={!stacked ? accentLabel : undefined}>
      <div className="flex flex-wrap items-center gap-2">
        {/* The selected theme's OWN accent — selected by default (no override).
            Carries the theme class so `bg-primary` resolves to its real colour. */}
        <button
          type="button"
          onClick={() => changeAccent(null)}
          className={cn(
            `theme-${theme}-${isDark ? 'dark' : 'light'}`,
            'h-7 w-7 rounded-full border-2 bg-primary transition-all',
            accent === null
              ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20'
              : 'border-border hover:border-foreground/50 hover:scale-105'
          )}
          title="Theme accent"
          aria-label="Use the theme's own accent"
          aria-pressed={accent === null}
        />
        <Separator orientation="vertical" className="h-6" />
        {accents.map((a) => {
          const selected = accent === a.id;
          return (
            <button
              key={a.id}
              type="button"
              // Click the active swatch again to clear back to the theme's own accent.
              onClick={() => changeAccent(selected ? null : a.id)}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition-all',
                selected
                  ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20'
                  : 'border-border hover:border-foreground/50 hover:scale-105'
              )}
              style={{ backgroundColor: a.swatch }}
              title={a.name}
              aria-label={`${a.name} accent`}
              aria-pressed={selected}
            />
          );
        })}
      </div>
    </Field>
  );

  if (stacked) {
    return (
      <div className={cn('flex flex-col gap-5', className)}>
        {themeField}
        {modeField}
        {accentField}
      </div>
    );
  }

  // Inline: row with vertical separators between the present sections.
  const sections = [themeField, modeField, accentField].filter(Boolean);
  return (
    <div className={cn('flex flex-wrap items-center gap-4', className)}>
      {sections.map((section, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Separator orientation="vertical" className="h-6" />}
          {section}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Field chrome: stacked label above (form) or an inline muted label (inline). */
const Field: React.FC<{
  stacked: boolean;
  label?: string;
  inlineLabel?: string;
  children: React.ReactNode;
}> = ({ stacked, label, inlineLabel, children }) => {
  if (stacked) {
    return (
      <div className="flex flex-col gap-2">
        {label && <span className="text-sm font-medium">{label}</span>}
        {children}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      {inlineLabel && <span className="text-sm text-muted-foreground">{inlineLabel}:</span>}
      {children}
    </div>
  );
};
