import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TimelineBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

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
 * A few dated events in order, each marked by what it did to the figure — the Timeline board of
 * the Design Kit Spec.
 */
export const Timeline: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <TimelineBlock spec={v.spec} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
