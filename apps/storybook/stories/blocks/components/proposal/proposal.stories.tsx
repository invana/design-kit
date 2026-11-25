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
 * Something to write and what writing it does, with its actions, each sent as its id. A proposal of
 * several changes lists them as steps, each accepted or rejected on its own (`accept` / `reject`
 * with the step's id), with `Accept all` while more than one is open; a stale step says why, an
 * issue sits under its step. Bare: a conversation draws it in its own card, a board in a panel.
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
    const steps = cell('Steps, each decided');
    await step('Accept and reject a step, by its id', async () => {
      await userEvent.click(steps.getByRole('button', { name: 'Accept AirRoutes.Terminal' }));
      await expect(args.onAction).toHaveBeenCalledWith('accept', '1');
      await userEvent.click(steps.getByRole('button', { name: 'Reject airport.terminals: int' }));
      await expect(args.onAction).toHaveBeenCalledWith('reject', '3');
    });
    await step('Accept all, while more than one is open', async () => {
      await userEvent.click(steps.getByRole('button', { name: 'Accept all 3' }));
      await expect(args.onAction).toHaveBeenCalledWith('accept-all', undefined);
      await expect(cell('Steps, partly decided').queryByRole('button', { name: /Accept all/ })).toBeNull();
    });
  },
};
