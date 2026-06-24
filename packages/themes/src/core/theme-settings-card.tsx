import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Button, cn } from '@invana/ui';
import { ThemeProvider, useTheme, useThemeOptional, type ThemeMode } from './theme-provider';
import { ThemeSelector, type ThemeSelectorProps } from './theme-selector';

/** A theme/mode/accent selection snapshot. */
export interface ThemeSelection {
  theme: string;
  mode: ThemeMode;
  accent: string | null;
}

/**
 * State handed to the `header` / `footer` render-props. Use `save` / `reset` to
 * build your own footer buttons, or drop in `<ThemeSettingsActions state={…} />`.
 */
export interface ThemeSettingsState extends ThemeSelection {
  /** The current selection differs from the saved baseline. */
  isDirty: boolean;
  /** Commit the current selection as the new baseline ("set as default"). */
  save: () => void;
  /** Revert the selection to the last saved baseline (the pre-selection). */
  reset: () => void;
}

/** A slot that is either static content or a render-prop of the live state. */
type Slot = React.ReactNode | ((state: ThemeSettingsState) => React.ReactNode);

function renderSlot(slot: Slot | undefined, state: ThemeSettingsState): React.ReactNode {
  return typeof slot === 'function' ? slot(state) : slot;
}

/** Props for the theme picker, forwarded straight to `<ThemeSelector>`. */
type ForwardedSelectorProps = Pick<
  ThemeSelectorProps,
  'themeVariant' | 'showTheme' | 'showMode' | 'showAccent' | 'modeIcons' | 'themes' | 'accents' | 'labels'
>;

export interface ThemeSettingsCardProps extends ForwardedSelectorProps {
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

interface InnerProps extends ForwardedSelectorProps {
  header?: Slot;
  footer?: Slot;
  className?: string;
  contentClassName?: string;
  onSave?: (selection: ThemeSelection) => void;
  onReset?: (selection: ThemeSelection) => void;
  onChange?: (selection: ThemeSelection) => void;
}

/** Renders the card; assumes a surrounding `<ThemeProvider>` (guaranteed below). */
const ThemeSettingsCardInner: React.FC<InnerProps> = ({
  header,
  footer,
  className,
  contentClassName,
  onSave,
  onReset,
  onChange,
  ...selectorProps
}) => {
  const ctx = useTheme();

  // Baseline = the "saved default" the user can reset back to. Snapshot at mount,
  // re-snapshotted on save.
  const [baseline, setBaseline] = useState<ThemeSelection>(() => ({
    theme: ctx.theme,
    mode: ctx.mode,
    accent: ctx.accent,
  }));

  const current: ThemeSelection = { theme: ctx.theme, mode: ctx.mode, accent: ctx.accent };
  const isDirty =
    current.theme !== baseline.theme ||
    current.mode !== baseline.mode ||
    current.accent !== baseline.accent;

  useEffect(() => {
    onChange?.({ theme: ctx.theme, mode: ctx.mode, accent: ctx.accent });
  }, [ctx.theme, ctx.mode, ctx.accent]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(() => {
    const snapshot: ThemeSelection = { theme: ctx.theme, mode: ctx.mode, accent: ctx.accent };
    // Persist now so the selection survives a reload ("set as default"). With a
    // `persist="manual"` provider, unsaved previews are discarded on refresh.
    ctx.commit();
    setBaseline(snapshot);
    onSave?.(snapshot);
  }, [ctx, onSave]);

  const reset = useCallback(() => {
    ctx.setTheme(baseline.theme);
    ctx.setMode(baseline.mode);
    ctx.setAccent(baseline.accent);
    onReset?.(baseline);
  }, [ctx, baseline, onReset]);

  const state: ThemeSettingsState = { ...current, isDirty, save, reset };

  return (
    <Card className={className}>
      {header != null && <CardHeader>{renderSlot(header, state)}</CardHeader>}
      <CardContent className={cn('space-y-6', contentClassName)}>
        <ThemeSelector layout="form" {...selectorProps} />
      </CardContent>
      {footer != null && <CardFooter>{renderSlot(footer, state)}</CardFooter>}
    </Card>
  );
};

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
export const ThemeSettingsCard: React.FC<ThemeSettingsCardProps> = ({
  defaultTheme,
  defaultMode,
  defaultAccent,
  ...rest
}) => {
  const existing = useThemeOptional();

  if (existing) return <ThemeSettingsCardInner {...rest} />;

  // No surrounding provider — supply our own with save-gated persistence so
  // `save` is meaningful and unsaved previews are dropped on reload.
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      defaultMode={defaultMode}
      defaultAccent={defaultAccent}
      accents={rest.accents}
      persist="manual"
    >
      <ThemeSettingsCardInner {...rest} />
    </ThemeProvider>
  );
};

export interface ThemeSettingsActionsProps {
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
export const ThemeSettingsActions: React.FC<ThemeSettingsActionsProps> = ({
  state,
  saveLabel = 'Save as default',
  resetLabel = 'Reset',
  className,
}) => (
  <div className={cn('flex w-full items-center justify-end gap-2', className)}>
    <Button variant="ghost" size="sm" onClick={state.reset} disabled={!state.isDirty}>
      {resetLabel}
    </Button>
    <Button size="sm" onClick={state.save} disabled={!state.isDirty}>
      {saveLabel}
    </Button>
  </div>
);
