import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { askTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.confirm;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Asks/Blocks/Confirm',
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
              data: { turn: askTurn('confirm', v) },
              setup:
                v.state === 'answered'
                  ? undefined
                  : [
                      '// The click arrives as { type: "reply", turn: "' + v.turn.id + '", value: true }.',
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
 * The Confirm board of the Design Kit Spec in the conversation — the same JSON as
 * `Blocks/Confirm`, as an ask turn. A click goes out as a `ConversationEvent`; the story
 * answers with the API's `set-state` patch, and the cell's log shows both.
 */
export const Confirm: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={askTurn('confirm', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Minimal yes / no' }));
    await step('Answer yes', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Yes' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'reply', turn: 'minimal', value: true });
    });
    await step('The API patch settles the turn', async () => {
      await expect(cell.queryByRole('button', { name: 'No' })).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"op": "set-state"');
    });
  },
};
