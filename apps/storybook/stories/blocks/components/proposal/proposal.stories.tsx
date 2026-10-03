import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ProposalBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.proposal;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Proposal',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ProposalBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: '// Each action sends its id.\nconst onAction = (action) => { /* "create" */ };',
              call: jsx('ProposalBlock', {
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
 * Something to write and what writing it does, with its actions, each sent as its id. Bare: a
 * conversation draws it in its own card, a board in a panel.
 */
export const Proposal: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={ProposalBlock} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('What it writes + consequence');
    await step('Create the alert', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Create alert' }));
      await expect(args.onAction).toHaveBeenCalledWith('action', 'create');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["action", "create"]');
    });
  },
};
