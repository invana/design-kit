import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MultiAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.multi;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Multi',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MultiAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// `reply` carries the ticked values, in the spec\'s order. Settle the ask with it.\nconst onAction = (action, value) => { /* "reply", ["stores", "online"] */ };',
              call: jsx('MultiAsk', {
                spec: 'spec',
                state: v.state ? { literal: v.state } : undefined,
                value: v.value === undefined ? undefined : JSON.stringify(v.value),
                onAction: v.state === 'answered' ? undefined : 'onAction',
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
 * Several choices; the ticked values are sent as one `reply`, in the spec's order — the Multiple
 * choice page of the Design Kit Spec.
 */
export const Multi: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={MultiAsk} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Plain · count on the right');
    await step('Tick Wholesale and send the three', async () => {
      await userEvent.click(c.getByText('Wholesale'));
      await userEvent.click(c.getByRole('button', { name: 'Use 3 selected' }));
      await expect(args.onAction).toHaveBeenCalledWith('reply', ['stores', 'online', 'wholesale']);
    });
    await step('The ask settles into its answer', async () => {
      await expect(c.queryByRole('button', { name: 'Use 3 selected' })).toBeNull();
    });
  },
};
