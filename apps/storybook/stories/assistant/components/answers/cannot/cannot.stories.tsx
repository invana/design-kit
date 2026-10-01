import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.cannot;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Cannot',
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
              data: { turn: answerTurn('cannot', v) },
              setup: '// What the reader does arrives as { type: "prompt", text }.\nconst onEvent = (event) => api.send(event);',
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
 * What the data does not hold, in a dashed card, with what would change the answer — then what it
 * can answer instead, each sent as the next prompt. Answered in part, the card says which part is
 * missing, in the info tone.
 */
export const Cannot: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('cannot', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('With what I can answer instead');
    await step('Ask what it can answer instead', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Compare 2023 with 2025' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'prompt', text: 'Compare 2023 with 2025' });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"type": "prompt"');
    });
  },
};
