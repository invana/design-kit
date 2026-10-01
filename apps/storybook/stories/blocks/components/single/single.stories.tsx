import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SingleAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.single;
const OTHER = 'With an “Other…” answer';

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Single',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SingleAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// Picking an option is the `reply`. Settle the ask with it.\nconst onAction = (action, value) => { /* "reply", "gross" */ };',
              call: jsx('SingleAsk', {
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
 * One choice from a list; picking it is the `reply` — the Single choice board of the Design Kit
 * Spec. Answered, it settles into one label/value pair.
 */
export const Single: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={SingleAsk} variant={v} onAction={onAction} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Plain · source on the right');
    await step('Pick Gross margin', async () => {
      await userEvent.click(c.getByText('Gross margin'));
      await expect(args.onAction).toHaveBeenCalledWith('reply', 'gross');
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["reply", "gross"]');
    });
    await step('The Other… variant is a state the analyst reaches: pick Other…, then type', async () => {
      await userEvent.click(cell(OTHER).getByText('Other…'));
      await userEvent.type(cell(OTHER).getByRole('textbox', { name: 'Your answer' }), 'Net margin after supplier rebates');
    });
  },
};
