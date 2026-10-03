import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantGrid } from '../../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.caveat;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Caveat',
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
              data: { turn: answerTurn('caveat', v) },
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
 * What was excluded, imputed or assumed, labelled with its kind. A caveat about rows links to
 * them; `info` says what was filled in, `bad` what is wrong with the data; several fold behind one
 * line. An answer's envelope caveats draw with this same block, under the figures.
 */
export const Caveat: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('caveat', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('With the excluded rows');
    await step('Open the excluded rows', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Show the 4 stores' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'action', turn: 'excluded', action: 'show-excluded' });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"action": "show-excluded"');
    });
  },
};
