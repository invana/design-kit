import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BoundChip as Component, PropertyList, PropertyRow, type Bound, type BoundPalette } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/bound-chip.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

/**
 * The hues are the caller's — `BoundChip` ships none and draws what it is given, so this palette
 * is also the demonstration of how a surface supplies one. Five spend the status tokens because
 * those already mean the right thing; the other four take data-palette slots, chosen for being
 * distinguishable rather than for meaning anything — which is exactly why the component must not
 * be the one choosing them. `none` is left out and falls through to the neutral.
 */
const PALETTE: BoundPalette = {
  network: 'bg-warning',
  graph_read: 'bg-success',
  graph_write: 'bg-data-2',
  schema_write: 'bg-data-4',
  ingest: 'bg-info',
  llm: 'bg-data-7',
  plan_write: 'bg-data-5',
  work_write: 'bg-destructive',
};

interface BoundVariant extends Variant {
  chips: { bound: Bound; note: string }[];
}

const VARIANTS = VARIANTS_JSON as BoundVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/BoundChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { BoundChip, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { palette: PALETTE, chips: v.chips },
              call: [
                '<PropertyList labelWidth={112}>',
                '  {chips.map(({ bound, note }) => (',
                '    <PropertyRow key={bound} label={<BoundChip bound={bound} palette={palette} />}>{note}</PropertyRow>',
                '  ))}',
                '</PropertyList>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Nine bounds, one hue each — and the hues come from the caller's `palette`, never from the chip.
 * Colour follows the bound, never its position in a list.
 *
 * The **name is always there**. Nine hues cannot be told apart reliably, some pairs sit close, and
 * a colour-blind reader gets nothing from any of them: the swatch speeds up scanning a list you
 * can already read, and carries nothing on its own.
 *
 * Not a `Badge` — a badge carries state and takes a tone from the status palette. A bound is a
 * fixed property of a callable and must not read as "this went well" because it is green.
 */
export const BoundChip: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={112}>
          {v.chips.map(({ bound, note }) => (
            <PropertyRow key={bound} label={<Component bound={bound} palette={PALETTE} />}>
              {note}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0]!.caption }));
    for (const { note } of VARIANTS[0]!.chips) await expect(cell.getByText(note)).toBeInTheDocument();
  },
};
