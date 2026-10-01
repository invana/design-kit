import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { RankedBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.ranked;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/Ranked',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { RankedBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('RankedBlock', {
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
 * Items in the order they matter, each with its bar and its value; a negative one in the
 * destructive colour — the Ranked list board of the Design Kit Spec.
 */
export const Ranked: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <RankedBlock spec={v.spec} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
