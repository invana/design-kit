import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantGrid } from '../../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.gantt;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Gantt',
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
              data: { turn: answerTurn('gantt', v) },
              setup: '// Anything the reader does in the turn arrives as a ConversationEvent.\nconst onEvent = (event) => api.send(event);',
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
 * The Gantt block in the conversation — the same JSON as
 * `Blocks/Components/Gantt/Run Progress` and `…/Layer Access`, as an answer turn.
 */
export const Gantt: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('gantt', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
