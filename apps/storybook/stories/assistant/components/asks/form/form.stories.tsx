import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { askTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantBoard } from '../../../../_story/variant-board';

const VARIANTS = BLOCK_VARIANTS.form;
const ERROR = 'A field in error';

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Asks/Form',
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
              data: { turn: askTurn('form', v) },
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
 * The Form board of the Design Kit Spec in the conversation — the same JSON as
 * `Blocks/Components/Form`, as an ask turn. Submitting goes out as a `reply` event; the story
 * answers with the API's `set-state` patch.
 */
export const Form: Story = {
  render: ({ variant, onEvent }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={askTurn('form', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Labels left');
    await step('Submit the scenario', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Run scenario' }));
      await expect(args.onEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'reply', turn: 'side', value: expect.objectContaining({ price: -5 }) }),
      );
      await expect(c.getByRole('list', { name: 'Events' })).toHaveTextContent('"op": "set-state"');
    });
    await step('An elasticity of 0 is below its bound: the field shows its error', async () => {
      const input = cell(ERROR).getByRole('spinbutton', { name: 'Elasticity' });
      await userEvent.tripleClick(input);
      await userEvent.keyboard('0');
      input.blur();
    });
  },
};
