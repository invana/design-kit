import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ActivityBlock } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.activity;

interface Args {
  variant: string;
  onAction: (action: string, value?: unknown) => void;
}

const meta = {
  title: 'Blocks/Components/Activity',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ActivityBlock } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: "// 'pin' with { lane, at } when a cell is pinned; 'action' with an action's id.\nconst onAction = (action, value) => {};",
              call: jsx('ActivityBlock', {
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
 * Which layers a run kept busy, and when — the Layer activity board of the Design Kit Spec. One
 * lane per layer over a shared axis, brighter where busier, the rate at the right and the steps
 * banded above. Open a layer into its parts; pin a lit cell for the operation behind it. A
 * refusal and a crossing of the boundary are marked in their cell; with no signal the lanes dim.
 */
export const Activity: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <ActivityBlock spec={v.spec} onAction={(action, value) => { onAction(action, value); log('onAction', { action, value }); }} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeVisible();
    });
    await step('The pinned cell shows the operation behind it, and opens the trace', async () => {
      const cell = within(canvas.getByRole('group', { name: 'One layer opened · a window pinned' }));
      await expect(cell.getByText('SET c.revenue_q3 = $value · 512 rows')).toBeInTheDocument();
      await userEvent.click(cell.getByRole('button', { name: 'Open in the trace' }));
      await expect(args.onAction).toHaveBeenCalledWith('action', 'open-trace');
    });
    await step('Closing a layer hides its parts', async () => {
      const cell = within(canvas.getByRole('group', { name: 'One layer opened · a window pinned' }));
      await userEvent.click(cell.getByRole('button', { name: 'Graph', expanded: true }));
      await expect(cell.queryByText('OWNS')).not.toBeInTheDocument();
    });
    await step('Pinning a lit cell sends where it is', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Settled · the whole run' }));
      await userEvent.click(cell.getAllByRole('button', { name: /^Graph · cell 20 / })[0]!);
      await expect(args.onAction).toHaveBeenCalledWith('pin', { lane: 'graph', at: 19 });
    });
  },
};
