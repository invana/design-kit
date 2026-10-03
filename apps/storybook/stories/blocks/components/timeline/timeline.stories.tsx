import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TimelineBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.timeline;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/Timeline',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { TimelineBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('TimelineBlock', {
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
 * A few dated events in order, each marked by what it did to the figure — the Timeline page of
 * the Design Kit Spec. An event with `children` opens into them (`open` draws it open), so a
 * three-day hold reads step by step.
 */
export const Timeline: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => <TimelineBlock spec={v.spec} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
    const nested = within(within(canvasElement).getByRole('group', { name: 'Nested · a hold opened into its steps' }));
    await step('Felixstowe opens into its two steps', async () => {
      await expect(nested.queryByText('Gate-out 16:40')).toBeNull();
      await userEvent.click(nested.getByRole('button', { name: 'Open Arrived Felixstowe' }));
      await expect(nested.getByText('Gate-out 16:40')).toBeInTheDocument();
    });
  },
};
