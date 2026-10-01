import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CannotBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.cannot;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Cannot',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { CannotBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// `prompt` carries the words of the question it can answer instead.\nconst onAction = (action, value) => { /* "prompt", "Compare 2023 with 2025" */ };',
              call: jsx('CannotBlock', {
                spec: 'spec',
                onAction: 'onAction',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * What the data does not hold and what would change it, then nearby questions it can answer; each
 * is sent as the `prompt` action with its words.
 */
export const Cannot: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={CannotBlock} variant={v} onAction={onAction} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('With what I can answer instead');
    await step('Ask what it can answer instead', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Compare 2023 with 2025' }));
      await expect(args.onAction).toHaveBeenCalledWith('prompt', 'Compare 2023 with 2025');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["prompt", "Compare 2023 with 2025"]');
    });
  },
};
