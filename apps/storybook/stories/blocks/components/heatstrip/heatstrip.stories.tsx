import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { HeatStripBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.heatstrip;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/HeatStrip',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { HeatStripBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('HeatStripBlock', { spec: 'spec' }),
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
 * A run of firings, one square each, in time order — `HeatStrip` drawn from a JSON spec. One
 * strip is a schedule's day; `rows` are several strips over one axis, and a row opens into its
 * `children` (`open` draws it open), so the one red square is followed down to the job that went
 * red. A state's `tone` colours it; the legend is always drawn.
 */
export const HeatStrip: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <HeatStripBlock spec={v.spec} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeVisible();
    });
    const rows = within(canvas.getByRole('group', { name: 'Rows · a schedule opened into its jobs' }));
    await step('Send opens into its two recipients', async () => {
      await expect(rows.queryByText('to the procurement lead')).toBeNull();
      await userEvent.click(rows.getByRole('button', { name: 'Open Send' }));
      await expect(rows.getByText('to the procurement lead')).toBeInTheDocument();
    });
    await step('Closing the report hides its jobs', async () => {
      await userEvent.click(rows.getByRole('button', { name: 'Close Monday report' }));
      await expect(rows.queryByText('Refresh lead times')).toBeNull();
    });
  },
};
