import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { askTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.multistep;
const STEP_2 = 'Step 2 · number with a unit';
const STEP_3 = 'Step 3 · multiple choice';
const REVIEW = 'Review before submit';
const NARROW = 'At 280px';

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Asks/Multistep',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ChatSessionTurn, applyPatch } from '@invana/assistant';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { turn: askTurn('multistep', v) },
              setup: v.state === 'answered'
                  ? undefined
                  : [
                      '// The answer arrives as { type: "reply", turn: "' + v.turn.id + '", value }.',
                      '// The API answers with a patch, and the turn settles:',
                      '//   applyPatch(spec, { op: "set-state", turn, state: "answered", value })',
                      'const onEvent = (event) => api.send(event);',
                    ].join('\n'),
              call: jsx('ChatSessionTurn', {
                turn: 'turn',
                onEvent: v.state === 'answered' ? undefined : 'onEvent',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onEvent: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The Multi-step board of the Design Kit Spec in the conversation — the same JSON as
 * `Blocks/Components/Multistep`, as an ask turn.
 */
export const Multistep: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={askTurn('multistep', v)} now={v.now} onEvent={onEvent} log={log} />}
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
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'reply', turn: 'default', value: { environment: 'semi-arid', traits: ['rust'] } });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"op": "set-state"');
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
