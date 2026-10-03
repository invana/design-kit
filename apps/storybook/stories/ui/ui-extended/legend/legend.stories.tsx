import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Legend as Component, LegendItem, type LegendProps, type LegendSwatchKind } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/legend.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface LegendVariant extends Variant {
  orientation?: LegendProps['orientation'];
  items: { label: string; kind?: LegendSwatchKind; color?: string; count?: string }[];
}

const VARIANTS = VARIANTS_JSON as LegendVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/Legend',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Legend, LegendItem } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items },
              call: [
                v.orientation ? `<Legend orientation="${v.orientation}">` : '<Legend>',
                '  {items.map((item) => <LegendItem key={item.label} {...item} />)}',
                '</Legend>',
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
 * Node types, coloured from the data palette — the label is what identifies them, the colour only
 * speeds the eye. A legend also has to draw what the canvas draws: a dependency rendered as a
 * dashed arrow needs a dashed arrow here, or the legend describes a different picture — hence the
 * swatch kinds, stacked in a `column` as a panel holds them.
 */
export const Legend: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (
        <Component orientation={v.orientation}>
          {v.items.map((item) => (
            <LegendItem key={item.label} {...item} />
          ))}
        </Component>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      const cell = within(canvas.getByRole('group', { name: v.caption }));
      for (const item of v.items) await expect(cell.getByText(item.label)).toBeInTheDocument();
    }
  },
};
