import React from 'react';
import { Theme, ThemeVariant } from '@invana/styling/themes.config';
import { NavHorizontalProps, NavVerticalProps } from '@invana/ui';

/**
 * A selectable accent colour. The accent overrides a theme's signature
 * `--primary` / `--accent` / `--ring` tokens so any preset can be re-tinted
 * without authoring a whole new theme. `light` / `dark` are raw HSL triplets
 * (`"H S% L%"`, no `hsl()` wrapper) so they drop straight into the Tailwind v4
 * token format used across `@invana/styling`.
 */
interface AccentColor {
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
declare const DEFAULT_ACCENTS: AccentColor[];
/** Look an accent up by id in a (possibly custom) palette. */
declare function findAccent(id: string | null | undefined, accents?: AccentColor[]): AccentColor | undefined;
/**
 * Build the CSS custom-property overrides for an accent. Spread the result onto
 * the `style` of whatever subtree should be re-tinted (see `<ThemeScope>`).
 * Returns an empty object when no accent is selected, so the active theme keeps
 * its own signature colour.
 */
declare function accentVars(accent: AccentColor | null | undefined, isDark: boolean): React.CSSProperties;

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
interface ThemeProviderProps {
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
/**
 * Like {@link useTheme}, but returns `null` instead of throwing when there is no
 * surrounding `<ThemeProvider>`. Lets a component bind to the provider when one
 * exists and fall back to its own state otherwise.
 */
declare function useThemeOptional(): ThemeContextValue | null;

interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
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
declare const ThemeScope: React.FC<ThemeScopeProps>;

/**
 * Icon components for the mode toggle, keyed by mode. Each is any component that
 * renders an icon (e.g. a `lucide-react` glyph, a custom SVG). Provide your own
 * so the package never bundles an icon library — when omitted, short text labels
 * ("Light" / "Dark" / "System") are shown instead.
 */
interface ModeIcons {
    light?: React.ElementType;
    dark?: React.ElementType;
    system?: React.ElementType;
}
interface ThemeSelectorProps {
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
    labels?: {
        theme?: string;
        mode?: string;
        accent?: string;
    };
    className?: string;
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
declare const ThemeSelector: React.FC<ThemeSelectorProps>;

/** A theme/mode/accent selection snapshot. */
interface ThemeSelection {
    theme: string;
    mode: ThemeMode;
    accent: string | null;
}
/**
 * State handed to the `header` / `footer` render-props. Use `save` / `reset` to
 * build your own footer buttons, or drop in `<ThemeSettingsActions state={…} />`.
 */
interface ThemeSettingsState extends ThemeSelection {
    /** The current selection differs from the saved baseline. */
    isDirty: boolean;
    /** Commit the current selection as the new baseline ("set as default"). */
    save: () => void;
    /** Revert the selection to the last saved baseline (the pre-selection). */
    reset: () => void;
}
/** A slot that is either static content or a render-prop of the live state. */
type Slot = React.ReactNode | ((state: ThemeSettingsState) => React.ReactNode);
/** Props for the theme picker, forwarded straight to `<ThemeSelector>`. */
type ForwardedSelectorProps = Pick<ThemeSelectorProps, 'themeVariant' | 'showTheme' | 'showMode' | 'showAccent' | 'modeIcons' | 'themes' | 'accents' | 'labels'>;
interface ThemeSettingsCardProps extends ForwardedSelectorProps {
    /** Card header content, or `(state) => …`. Omit for no header. */
    header?: Slot;
    /**
     * Card footer content, or `(state) => …`. Use the state's `save` / `reset` /
     * `isDirty` to wire buttons (or render `<ThemeSettingsActions state={state} />`).
     */
    footer?: Slot;
    className?: string;
    /** Class on the `CardContent` wrapping the fields. */
    contentClassName?: string;
    /** Fired when the current selection is saved as the new baseline ("set as default"). */
    onSave?: (selection: ThemeSelection) => void;
    /** Fired when the selection is reverted to the baseline. */
    onReset?: (selection: ThemeSelection) => void;
    /** Fired whenever the live selection changes. */
    onChange?: (selection: ThemeSelection) => void;
    /** Provider defaults — used only when there is no surrounding `<ThemeProvider>`. */
    defaultTheme?: string;
    defaultMode?: ThemeMode;
    defaultAccent?: string | null;
}
/**
 * A settings panel that wraps `<ThemeSelector>` (theme · mode · accent) in a
 * `Card` with optional `header` / `footer` slots. Changes apply **live**;
 * `save` locks the current selection as the new default and `reset` reverts to
 * the pre-selection — both surfaced to the `footer` render-prop.
 *
 * Drives the surrounding `<ThemeProvider>` when present; otherwise it provides
 * its own with `persist="manual"`. For the save-gating to work with your own
 * surrounding provider (so unsaved previews are dropped on reload, and only
 * `save` persists), give that provider `persist="manual"` too.
 *
 * @example
 * ```tsx
 * <ThemeSettingsCard
 *   header={<CardTitle>Appearance</CardTitle>}
 *   footer={(s) => <ThemeSettingsActions state={s} />}
 *   onSave={(sel) => persist(sel)}
 * />
 * ```
 */
declare const ThemeSettingsCard: React.FC<ThemeSettingsCardProps>;
interface ThemeSettingsActionsProps {
    state: ThemeSettingsState;
    /** @default "Save as default" */
    saveLabel?: React.ReactNode;
    /** @default "Reset" */
    resetLabel?: React.ReactNode;
    className?: string;
}
/**
 * Ready-made Save / Reset buttons for a `ThemeSettingsCard` footer. Both disable
 * when there's nothing to save (selection equals the baseline).
 */
declare const ThemeSettingsActions: React.FC<ThemeSettingsActionsProps>;

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

export { type AccentColor, AppLayoutBase, type AppLayoutBaseProps, AppLayoutV1, type AppLayoutV1Props, AppLayoutV2, type AppLayoutV2Props, DEFAULT_ACCENTS, type MainSectionConfig, type ModeIcons, type SectionConfig, type ThemeContextValue, type ThemeMode, ThemeProvider, type ThemeProviderProps, ThemeScope, type ThemeScopeProps, type ThemeSelection, ThemeSelector, type ThemeSelectorProps, ThemeSettingsActions, type ThemeSettingsActionsProps, ThemeSettingsCard, type ThemeSettingsCardProps, type ThemeSettingsState, accentVars, findAccent, useTheme, useThemeOptional };
