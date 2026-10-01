import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  ThemeProvider,
  ThemeScope,
  ThemeSelector as Selector,
  ThemeSettingsActions,
  ThemeSettingsCard,
  type ThemeMode,
  type ThemeSelection,
} from '@invana/themes';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Link,
  NavHorizontal,
  Separator,
  Typography,
} from '@invana/ui';
import { Monitor, Moon, Sun } from 'lucide-react';

import data from '../../../fixtures/themes/theme-selector.json';
import { jsx, snippets, sourceFor, variantArg } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost';

interface Preview {
  title: string;
  description: string;
  buttons: { variant: ButtonVariant; label: string }[];
  badges: { variant: 'default' | 'secondary' | 'outline'; label: string }[];
  link: string;
  footer?: string;
}

interface SelectorVariant extends Variant {
  brand?: string;
  form?: { title: string; description: string; pickers: { themeVariant: 'cards' | 'select'; label: string }[] };
  card?: { title: string; description: string; dirty: string; clean: string };
  preview: Preview;
  note?: string;
}

const VARIANTS = data as SelectorVariant[];

/** Icons are injected — the package never bundles an icon library. */
const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };

interface Args {
  variant: string;
  onThemeChange: (theme: string) => void;
  onModeChange: (mode: ThemeMode) => void;
  onAccentChange: (accent: string | null) => void;
  onSave: (selection: ThemeSelection) => void;
  onReset: (selection: ThemeSelection) => void;
}

/** A block that reacts to the active theme and (scoped) accent. */
function PreviewCard({ preview }: { preview: Preview }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{preview.title}</CardTitle>
        <CardDescription>{preview.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Unstyled wrappers: inline controls flow side by side, a space apart. */}
        <div>
          {preview.buttons.map((b, i) => (
            <React.Fragment key={b.label}>
              {i > 0 ? ' ' : null}
              <Button size="sm" variant={b.variant}>
                {b.label}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div>
          {preview.badges.map((b) => (
            <React.Fragment key={b.label}>
              <Badge variant={b.variant}>{b.label}</Badge>{' '}
            </React.Fragment>
          ))}
          <Link href="#" variant="underlined">
            {preview.link}
          </Link>
        </div>
      </CardContent>
      {preview.footer ? (
        <CardFooter>
          <Typography.Muted>{preview.footer}</Typography.Muted>
        </CardFooter>
      ) : null}
    </Card>
  );
}

/** Every callback goes to the Actions panel and the cell's log. */
function handlers(args: Args, log: Log) {
  const wire =
    <T,>(name: keyof Args, cb: (v: T) => void) =>
    (v: T) => {
      cb(v);
      log(name, v);
    };
  return {
    onThemeChange: wire('onThemeChange', args.onThemeChange),
    onModeChange: wire('onModeChange', args.onModeChange),
    onAccentChange: wire('onAccentChange', args.onAccentChange),
    onSave: wire('onSave', args.onSave),
    onReset: wire('onReset', args.onReset),
  };
}

function Draw({ v, args, log }: { v: SelectorVariant; args: Args; log: Log }) {
  const on = handlers(args, log);
  if (v.card) {
    const card = v.card;
    // One provider shared by the settings card and the preview, so live edits recolour it.
    return (
      <ThemeProvider persist="manual">
        <ThemeSettingsCard
          modeIcons={MODE_ICONS}
          onSave={on.onSave}
          onReset={on.onReset}
          header={
            <>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </>
          }
          // Render-prop footer: the live state, with the ready-made Save / Reset actions.
          footer={(state) => (
            <>
              <Typography.Muted>{state.isDirty ? card.dirty : card.clean}</Typography.Muted>
              <ThemeSettingsActions state={state} />
            </>
          )}
        />
        <ThemeScope>
          <PreviewCard preview={v.preview} />
        </ThemeScope>
      </ThemeProvider>
    );
  }
  const form = v.form!;
  const selector = { onThemeChange: on.onThemeChange, onModeChange: on.onModeChange, onAccentChange: on.onAccentChange };
  return (
    <ThemeProvider persist="manual">
      <NavHorizontal
        leftNavItems={[{ name: v.brand!, label: v.brand }]}
        right={<Selector layout="inline" modeIcons={MODE_ICONS} {...selector} />}
      />
      <Card>
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {form.pickers.map((p) => (
            <React.Fragment key={p.themeVariant}>
              <Selector
                layout="form"
                themeVariant={p.themeVariant}
                showMode={false}
                showAccent={false}
                labels={{ theme: p.label }}
                {...selector}
              />
              <Separator />
            </React.Fragment>
          ))}
          {/* Mode + accent shown once, shared across the pickers above. */}
          <Selector layout="form" showTheme={false} modeIcons={MODE_ICONS} {...selector} />
        </CardContent>
      </Card>
      {/* Only this subtree picks up the accent override. */}
      <ThemeScope>
        <PreviewCard preview={v.preview} />
      </ThemeScope>
      <Typography.Muted>{v.note}</Typography.Muted>
    </ThemeProvider>
  );
}

const meta = {
  title: 'Themes/ThemeSelector',
  parameters: {
    layout: 'padded',
    // Each cell owns its theme via <ThemeProvider> — opt out of the toolbar decorator.
    selfThemed: true,
    docs: {
      description: {
        component:
          'A reusable `ThemeSelector` (theme picker · light/dark/system toggle · accent swatches) and ' +
          '`ThemeSettingsCard` (the same fields in a `Card`, with Save / Reset) from `@invana/themes`. ' +
          'Use `layout="inline"` in a header or `layout="form"` in a settings panel. Inside a ' +
          '`<ThemeProvider>` it drives the theme; the accent is scoped — wrap any subtree in ' +
          '`<ThemeScope>` to re-tint only that section. One cell at a time: each owns a provider.',
      },
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { ThemeProvider, ThemeScope, ThemeSelector, ThemeSettingsCard, ThemeSettingsActions } from '@invana/themes';",
              "import { Sun, Moon, Monitor } from 'lucide-react';",
            ],
            picked.map((v) =>
              v.card
                ? {
                    comment: v.caption,
                    setup: '// onSave / onReset receive { theme, mode, accent }.\nconst modeIcons = { light: Sun, dark: Moon, system: Monitor };',
                    call: [
                      '<ThemeProvider persist="manual">',
                      '  <ThemeSettingsCard',
                      '    modeIcons={modeIcons}',
                      '    onSave={onSave}',
                      '    onReset={onReset}',
                      `    header={<><CardTitle>${v.card.title}</CardTitle><CardDescription>${v.card.description}</CardDescription></>}`,
                      '    footer={(state) => <ThemeSettingsActions state={state} />}',
                      '  />',
                      '  <ThemeScope>{/* the part the accent re-tints */}</ThemeScope>',
                      '</ThemeProvider>',
                    ].join('\n'),
                  }
                : {
                    comment: v.caption,
                    setup:
                      '// onThemeChange receives the theme id, onModeChange "light" | "dark" | "system",\n// onAccentChange the accent id or null (the theme\'s own).',
                    call: [
                      '<ThemeProvider persist="manual">',
                      `  ${jsx('ThemeSelector', { layout: { literal: 'inline' }, modeIcons: 'modeIcons', onThemeChange: 'onThemeChange', onModeChange: 'onModeChange', onAccentChange: 'onAccentChange' }).replace(/\n/g, '\n  ')}`,
                      ...v.form!.pickers.map(
                        (p) =>
                          `  <ThemeSelector layout="form" themeVariant="${p.themeVariant}" showMode={false} showAccent={false} />`,
                      ),
                      '  <ThemeSelector layout="form" showTheme={false} modeIcons={modeIcons} />',
                      '  <ThemeScope>{/* the part the accent re-tints */}</ThemeScope>',
                      '</ThemeProvider>',
                    ].join('\n'),
                  },
            ),
          ),
        ),
      },
    },
  },
  args: {
    variant: VARIANTS[0].caption,
    onThemeChange: fn(),
    onModeChange: fn(),
    onAccentChange: fn(),
    onSave: fn(),
    onReset: fn(),
  },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The theme picker in a header and in a settings form, and the settings card with Save / Reset —
 * from `fixtures/themes/theme-selector.json`. Pick a theme, mode or accent: the page recolours
 * live and the callback is written under the cell.
 */
export const ThemeSelector: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Draw v={v} args={args} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Theme selector' }));
    await step('Switch the header selector to dark', async () => {
      await userEvent.click(cell.getAllByRole('radio', { name: 'Dark' })[0]);
      await expect(args.onModeChange).toHaveBeenCalledWith('dark');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onModeChange"dark"');
    });
    await step('Back to light', async () => {
      await userEvent.click(cell.getAllByRole('radio', { name: 'Light' })[0]);
      await expect(args.onModeChange).toHaveBeenCalledWith('light');
    });
  },
};
