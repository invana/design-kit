import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TimeseriesBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.timeseries;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/Timeseries',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { TimeseriesBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('TimeseriesBlock', {
                spec: 'spec',
              }),
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
 * A measure over time: the line, its forecast from `forecastFrom`, the range it is judged against,
 * and the periods that stand out ringed in their tone. The Time series page's other variants (two
 * series, a threshold, a gap) are gaps in the renderer.
 */
export const Timeseries: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <TimeseriesBlock spec={v.spec} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
