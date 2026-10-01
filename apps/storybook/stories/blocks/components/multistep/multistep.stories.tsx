import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { MultistepAsk } from '@invana/blocks';

import { BLOCK_VARIANTS } from '../../../../fixtures/blocks';
import { LiveBlock, type BlockAction } from '../../../_story/live-block';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.multistep;
const STEP_2 = 'Step 2 · number with a unit';
const STEP_3 = 'Step 3 · multiple choice';
const REVIEW = 'Review before submit';
const NARROW = 'At 280px';

interface Args {
  variant: string;
  onAction: BlockAction;
}

const meta = {
  title: 'Blocks/Components/Multistep',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { MultistepAsk } from '@invana/blocks';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { spec: v.spec },
              setup: v.state === 'answered' ? undefined : '// `reply` carries the answers keyed by step id. Settle the ask with it.\nconst onAction = (action, value) => { /* "reply", { environment: "semi-arid", … } */ };',
              call: jsx('MultistepAsk', {
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
 * Several asks in one card, a step at a time; the answers go as one `reply` keyed by step id — the
 * Multi-step board of the Design Kit Spec. Steps 2, 3 and the review are states the analyst
 * reaches; the play walks each cell there.
 */
export const Multistep: Story = {
  render: ({ variant, onAction }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveBlock component={MultistepAsk} variant={v} onAction={onAction} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Default');
    await step('Answer both steps, review, and send', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Next' }));
      await userEvent.click(c.getByText('Rust resistance'));
      await userEvent.click(c.getByRole('button', { name: 'Review' }));
      await userEvent.click(c.getByRole('button', { name: 'Submit 2 answers' }));
      await expect(args.onAction).toHaveBeenCalledWith('reply', { environment: 'semi-arid', traits: ['rust'] });
    });
    await step('Steps 2, 3 and the review are places the analyst reaches: walk each cell there', async () => {
      const next = async (caption: string, times: number) => {
        for (let i = 0; i < times; i += 1) await userEvent.click(cell(caption).getByRole('button', { name: 'Next' }));
      };
      await next(STEP_2, 1);
      await next(STEP_3, 2);
      await next(REVIEW, 2);
      await userEvent.click(cell(REVIEW).getByRole('button', { name: 'Review' }));
      await next(NARROW, 1);
    });
  },
};
