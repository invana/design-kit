import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FormAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid } from '../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.form;
const ERROR = 'A field in error';

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Form',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { FormAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// `reply` carries the values keyed by field name. Settle the ask with it.\nconst onAction = (action, value) => { /* "reply", { price: -5, elasticity: 1.3, … } */ };',
              call: jsx('FormAsk', {
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
 * Several fields that only make sense together, sent as one `reply` keyed by field name — the Form
 * page of the Design Kit Spec. "A field in error" is a state the analyst reaches; the play types
 * an elasticity below its bound.
 */
export const Form: Story = {
  render: ({ variant, onAction }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={FormAsk} variant={v} onAction={onAction} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Labels left');
    await step('Submit the scenario', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Run scenario' }));
      await expect(args.onAction).toHaveBeenCalledWith('reply', expect.objectContaining({ price: -5 }));
    });
    await step('The ask settles into its answers', async () => {
      await expect(c.queryByRole('button', { name: 'Run scenario' })).toBeNull();
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"reply"');
    });
    await step('An elasticity of 0 is below its bound: the field shows its error', async () => {
      const input = cell(ERROR).getByRole('spinbutton', { name: 'Elasticity' });
      await userEvent.tripleClick(input);
      await userEvent.keyboard('0');
      input.blur();
    });
  },
};
