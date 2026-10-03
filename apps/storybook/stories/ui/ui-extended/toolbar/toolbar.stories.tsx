import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toolbar, type ToolbarItem } from '@invana/ui';
import { Lock, Maximize } from 'lucide-react';

import TOOLBARS from '../../../../fixtures/ui-extended/toolbar.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** Icons are code, named from the JSON. */
const ICONS: Record<string, React.ReactNode> = { lock: <Lock />, fit: <Maximize /> };

interface JsonItem {
  id?: string;
  label?: string;
  icon?: string;
  pressed?: boolean;
  disabled?: boolean;
  separator?: boolean;
}
interface ToolbarVariant {
  caption: string;
  items: JsonItem[];
}

const VARIANTS = TOOLBARS as ToolbarVariant[];

const toItems = (items: JsonItem[]): ToolbarItem[] =>
  items.map((i) =>
    i.separator ? { separator: true } : { ...i, id: i.id!, label: i.label!, icon: i.icon ? ICONS[i.icon] : undefined },
  );

interface Args {
  variant: string;
  onAction: (id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/Toolbar',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Toolbar } from '@invana/ui';", "import { Lock, Maximize } from 'lucide-react'; // any icon set"],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items },
              setup: [
                '// An icon is yours: swap each `icon` name for the element.',
                `const toolbar = items.map((i) => (i.icon ? { ...i, icon: ICONS[i.icon] } : i));`,
                '// Pressed: onAction("lock"). A toggle stays yours — flip its `pressed`.',
                'const onAction = (id) => {};',
              ].join('\n'),
              call: `<Toolbar items={toolbar} onAction={onAction} />`,
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** A toggle flips as a consumer would flip it; every press is logged. */
function Live({ v, onAction, log }: { v: ToolbarVariant; onAction: Args['onAction']; log: Log }) {
  const [items, setItems] = React.useState(v.items);
  return (
    <Toolbar
      items={toItems(items)}
      onAction={(id) => {
        onAction(id);
        log('onAction', id);
        setItems((all) => all.map((i) => (i.id === id && i.pressed !== undefined ? { ...i, pressed: !i.pressed } : i)));
      }}
    />
  );
}

/**
 * Controls over a canvas or a panel — icon toggles named by their tooltips, words, and rules
 * between groups — from `fixtures/ui-extended/toolbar.json`. Press one: `onAction` gets its id,
 * and a toggle flips.
 */
export const ToolbarStory: Story = {
  name: 'Toolbar',
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Canvas' }));
    await step('Unlock the canvas', async () => {
      const lock = cell.getByRole('button', { name: 'Lock canvas' });
      await expect(lock).toHaveAttribute('aria-pressed', 'true');
      await userEvent.click(lock);
      await expect(args.onAction).toHaveBeenCalledWith('lock');
      await expect(lock).toHaveAttribute('aria-pressed', 'false');
    });
    await step('Open the docs', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Docs' }));
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(json('docs'));
    });
  },
};
