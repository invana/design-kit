import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn, turnScript } from '../../../../_story/live-turn';
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
            picked.some((v) => v.stream)
              ? ["import { ChatSession, ChatSessionTurn, playScript } from '@invana/assistant';"]
              : ["import { ChatSessionTurn } from '@invana/assistant';"],
            picked.map((v) =>
              v.stream
                ? {
                    comment: v.caption,
                    data: { spec: { id: 'c1', turns: [answerTurn('gantt', v)] }, stream: turnScript(v.turn.id, v.stream).slice(0, 3) },
                    setup: [
                      `// …and ${v.stream.length - 1} more: the block's own stream, each step a \`patch-block\` on the turn.`,
                      '// Live, the source is the API: fromNdjson(await fetch(url)), or fromEventSource(…).',
                      'const play = React.useCallback((signal) => playScript(stream, { signal }), []);',
                    ].join('\n'),
                    call: jsx('ChatSession', { spec: 'spec', stream: 'play' }),
                  }
                : {
                    comment: v.caption,
                    data: { turn: answerTurn('gantt', v) },
                    setup: '// Anything the reader does in the turn arrives as a ConversationEvent.\nconst onEvent = (event) => api.send(event);',
                    call: jsx('ChatSessionTurn', {
                      turn: 'turn',
                      onEvent: 'onEvent',
                    }),
                  },
            ),
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
 * `Blocks/Components/Gantt/Run Progress` and `…/Layer Access`, as an answer turn. A live variant
 * streams the block's own patches as `patch-block` on the turn, the answer running until the
 * last one settles it.
 */
export const Gantt: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('gantt', v)} now={v.now} stream={v.stream} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(within(canvasElement).getByRole('group', { name: v.caption })).toBeVisible();
    });
  },
};
