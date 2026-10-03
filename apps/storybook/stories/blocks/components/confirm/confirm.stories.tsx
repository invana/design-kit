import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ConfirmAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.confirm;

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Confirm',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ConfirmAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// `reply` carries true or false. Settle the ask with it.\nconst onAction = (action, value) => { /* "reply", true */ };',
              call: jsx('ConfirmAsk', {
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
 * Yes or no, with what yes costs stated before the buttons — the Confirm page of the Design Kit
 * Spec, variant for variant, from `fixtures/blocks/confirm.json`. Click either button: the block
 * sends `reply` with `true` or `false`, and the story settles it as a consumer would.
 */
export const Confirm: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={ConfirmAsk} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Minimal yes / no');
    await step('Answer no', async () => {
      await userEvent.click(c.getByRole('button', { name: 'No' }));
      await expect(args.onAction).toHaveBeenCalledWith('reply', false);
    });
    await step('The ask settles into the decision', async () => {
      await expect(c.queryByRole('button', { name: 'Yes' })).toBeNull();
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('["reply", false]');
    });
  },
};
