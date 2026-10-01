import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LensRow as Component, type LayerPalette, type LensUsage, type Narrowing } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/lens-row.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

/** The hues are the caller's — these components ship none. */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

interface LensRowVariant extends Variant {
  /** The world picked when the drawer opens. */
  selected?: string;
  rows: { name: string; narrows?: Narrowing[]; usage?: LensUsage }[];
}

const VARIANTS = VARIANTS_JSON as LensRowVariant[];

interface Args {
  variant: string;
  onSelect: (name: string) => void;
}

const meta = {
  title: 'UI/UI Extended/LensRow',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LensRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { palette: PALETTE, worlds: v.rows },
              setup: `// onSelect receives the world's name — "Price-blind".\nconst [selected, onSelect] = React.useState(${JSON.stringify(v.selected ?? null)});`,
              call: [
                'worlds.map((world) => (',
                '  <LensRow key={world.name} {...world} palette={palette} selected={selected === world.name} onSelect={onSelect} />',
                '))',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Drawer({ v, onSelect, log }: { v: LensRowVariant; onSelect: Args['onSelect']; log: Log }) {
  const [selected, setSelected] = React.useState(v.selected);
  return v.rows.map((row) => (
    <Component
      key={row.name}
      {...row}
      palette={PALETTE}
      selected={selected === row.name}
      onSelect={(name) => {
        onSelect(name);
        log('onSelect', name);
        setSelected(name);
      }}
    />
  ));
}

/**
 * The Worlds drawer: four worlds, compared by what each narrows.
 *
 * **What it narrows is chips, not prose.** A world is picked by comparing it with the ones above
 * it, and four sentences do not compare — six fixed kinds of narrowing do. `closes` renders its
 * layers as `LayerChip`s because *which* layer is closed is the part being compared.
 *
 * **A world that narrows nothing says so in words.** `Everything` is a real world and the default
 * one, still inside the guardrails. **Usage never sorts the list** — a world used once may be the
 * one that matters. Pick a row and the selection moves to it.
 */
export const LensRow: Story = {
  render: ({ variant, onSelect }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Drawer v={v} onSelect={onSelect} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'The Worlds drawer' }));
    await step('Pick Price-blind', async () => {
      const row = cell.getByRole('button', { name: /Price-blind/ });
      await userEvent.click(row);
      await expect(args.onSelect).toHaveBeenCalledWith('Price-blind');
      await expect(row).toHaveAttribute('aria-pressed', 'true');
      await expect(cell.getByRole('button', { name: /EU · H1 2026/ })).toHaveAttribute('aria-pressed', 'false');
    });
  },
};
