import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { askTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.suggestions;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Asks/Suggestions',
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
              data: { turn: askTurn('suggestions', v) },
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
 * Follow-ups after an answer, each reusing the current scope. Picking one is the ask's `reply`,
 * which the API sends on as the next prompt. They run along a line, stack one per line, or sit
 * under headings; answered, the one picked stays, dimmed.
 */
export const Suggestions: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={askTurn('suggestions', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Chips');
    await step('Pick a follow-up', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Compare with Q3 last year' }));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'reply', turn: 'chips', value: 'Compare with Q3 last year' });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"op": "set-state"');
    });
  },
};
