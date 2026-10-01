import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { NarrativeBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.narrative;

interface Args {
  variant: string;
}

const meta = {
  title: 'Blocks/Components/Narrative',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { NarrativeBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              call: jsx('NarrativeBlock', {
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
 * The answer in words, leading with the number. `**…**` marks a figure; `[n]` places a source's
 * marker where its clause ends. The conversation adds cite focus and the streaming caret.
 */
export const Narrative: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <NarrativeBlock spec={v.spec} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
