import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CaveatBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.caveat;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Caveat',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { CaveatBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// A caveat\'s link sends its action\'s id.\nconst onAction = (action) => { /* "show-excluded" */ };',
              call: jsx('CaveatBlock', {
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
 * What was excluded, imputed or assumed, labelled with its kind. A caveat with rows behind it
 * links to them, sent as its action's id; `info` says what was filled in, `bad` what is wrong with
 * the data; several fold behind one line.
 */
export const Caveat: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={CaveatBlock} variant={v} onAction={onAction} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('With the excluded rows');
    await step('Open the excluded rows', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Show the 4 stores' }));
      await expect(args.onAction).toHaveBeenCalledWith('show-excluded', undefined);
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["show-excluded"]');
    });
  },
};
