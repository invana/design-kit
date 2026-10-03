import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantGrid } from '../../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.table;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Table',
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
              data: { turn: answerTurn('table', v) },
              setup: '// What the reader does arrives as { type: "open", turn, block } — a picked row as { type: "action", turn, action: "select" }.\nconst onEvent = (event) => api.send(event);',
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
 * The Table preview page of the Design Kit Spec in the conversation — the same JSON as
 * `Blocks/Components/Table`, as an answer turn. `Open all` goes out as an `open` event. A picked
 * row goes out as an `action` event named `select` — without its key: the conversation does not
 * carry it yet (`toEvent` in `answers/shared.tsx` has no `select` case).
 */
export const Table: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('table', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Selectable');
    await step('Pick a row: the event carries its key', async () => {
      await userEvent.click(c.getByRole('cell', { name: 'translate' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'action', turn: 'selectable', action: 'select', value: 'translate' });
    });
    await step('Open every row', async () => {
      await userEvent.click(cell('First rows + open all').getByRole('button', { name: /open all/i }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'open', turn: 't1', block: 0 });
    });
  },
};
