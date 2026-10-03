import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { AskTurn, ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS, type BlockVariant } from '../../../../../fixtures/blocks';
import { askTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantGrid } from '../../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.single;
const OTHER = 'With an “Other…” answer';

/**
 * The ask turn for a variant. `askTurn` keeps the turn's id, stage and answer time; a turn
 * here may say more — how long it has waited — so the rest of `turn` rides along.
 */
const turnOf = (v: BlockVariant<'single'>): AskTurn => {
  const { id: _id, stage: _stage, answeredAt: _at, ...rest } = v.turn;
  return { ...askTurn('single', v), ...rest };
};

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Asks/Single',
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
              data: { turn: turnOf(v) },
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
 * The Single choice page of the Design Kit Spec in the conversation — the same JSON as
 * `Blocks/Components/Single`, as an ask turn.
 */
export const Single: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={turnOf(v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Plain · source on the right');
    await step('Pick Gross margin', async () => {
      await userEvent.click(c.getByText('Gross margin'));
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'reply', turn: 'plain', value: 'gross' });
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"op": "set-state"');
    });
    await step('The Other… variant is a state the analyst reaches: pick Other…, then type', async () => {
      await userEvent.click(cell(OTHER).getByText('Other…'));
      await userEvent.type(cell(OTHER).getByRole('textbox', { name: 'Your answer' }), 'Net margin after supplier rebates');
    });
  },
};
