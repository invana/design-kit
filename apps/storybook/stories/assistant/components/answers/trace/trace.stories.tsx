import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.trace;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Trace',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { ChatSessionTurn } from '@invana/assistant';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { turn: answerTurn('trace', v) },
              setup: '// What the reader does arrives as { type: "action", turn, action }.\nconst onEvent = (event) => api.send(event);',
              call: jsx('ChatSessionTurn', {
                turn: 'turn',
                onEvent: 'onEvent',
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
 * What the answer is doing, step by step: done steps filled, the running one pulsing, pending ones
 * hollow — while it runs, the trace is the answer's own (`turn.trace`). Done, it folds into one
 * line; a failed step says why, with a retry; a step held on the analyst waits hollow, in the info
 * tone.
 */
export const Trace: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('trace', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('A step failed');
    await step('Retry the failed step', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Retry' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'action', turn: 'failed', action: 'retry' });
    });
  },
};
