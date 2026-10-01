import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LayerChip as Component, PropertyList, PropertyRow, type Layer, type LayerPalette } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/layer-chip.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Variant } from '../../../_story/variant-board';

/**
 * The hues are the caller's. `LayerChip` ships none — it takes a `palette` and paints what it is
 * given. These take the data-palette slots `BoundChip` leaves free, so a layer and a bound never
 * share a hue in one row; `llm` deliberately takes the slot the **llm bound** has, and `agent` is
 * absent so the spine draws in the neutral.
 */
const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

interface LayerVariant extends Variant {
  chips: { layer: Layer; count?: number; dim?: boolean; note: string }[];
}

const VARIANTS = VARIANTS_JSON as LayerVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/LayerChip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { LayerChip, PropertyList, PropertyRow } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { palette: PALETTE, layers: v.chips },
              call: [
                '<PropertyList labelWidth={128}>',
                '  {layers.map(({ layer, count, dim, note }) => (',
                '    <PropertyRow key={layer} label={<LayerChip layer={layer} count={count} dim={dim} palette={palette} />}>',
                '      {note}',
                '    </PropertyRow>',
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
 * Six layers, one hue each — and the hues come from the caller's `palette`, never from the chip.
 * Colour follows the layer, never its position in a list.
 *
 * The **name is always there** — six hues cannot be told apart reliably, and a colour-blind reader
 * gets nothing from any of them.
 *
 * `count={0}` is printed rather than hidden: *nothing is configured* and *nothing matched* are
 * different answers, and the third-party row is where a reader most needs to tell them apart.
 * `dim` is a layer out of view for this lens, which is *not in play*, never *not there*.
 */
export const LayerChip: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <PropertyList labelWidth={128}>
          {v.chips.map(({ layer, count, dim, note }) => (
            <PropertyRow key={layer} label={<Component layer={layer} count={count} dim={dim} palette={PALETTE} />}>
              {note}
            </PropertyRow>
          ))}
        </PropertyList>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      for (const c of v.chips) await expect(cell.getByText(c.note)).toBeInTheDocument();
    }
  },
};
