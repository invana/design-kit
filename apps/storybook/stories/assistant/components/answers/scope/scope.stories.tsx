import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { ConversationEvent } from '@invana/assistant';

import { BLOCK_VARIANTS } from '../../../../../fixtures/blocks';
import { answerTurn, LiveTurn } from '../../../../_story/live-turn';
import { jsx, snippets, sourceFor, variantArg } from '../../../../_story/source';
import { VariantGrid } from '../../../../_story/variant-grid';

const VARIANTS = BLOCK_VARIANTS.scope;

interface Args {
  variant: string;
  onEvent: (event: ConversationEvent) => void;
}

const meta = {
  title: 'Assistant/Components/Answers/Scope',
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
              data: { turn: answerTurn('scope', v) },
              setup: '// What the reader does arrives as { type: "scope", turn, part, value }.\nconst onEvent = (event) => api.send(event);',
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
 * Period, comparison, filters, population and freshness, as the query applied them. A part is
 * changed where it is read — typed, or picked from its choices — and sent as a `scope` event. A
 * part carried from an earlier question and changed since is marked, as is one resting on late
 * data.
 */
export const Scope: Story = {
  render: ({ variant, onEvent }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <LiveTurn turn={answerTurn('scope', v)} now={v.now} onEvent={onEvent} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = (caption: string) => within(within(canvasElement).getByRole('group', { name: caption }));
    const c = cell('Editable in place');
    await step('Change the period in place', async () => {
      await userEvent.click(c.getByRole('button', { name: 'Q3 2026' }));
      const input = c.getByRole('textbox', { name: 'Change Q3 2026' });
      await userEvent.clear(input);
      await userEvent.type(input, 'Q4 2026{Enter}');
      await expect(args.onEvent).toHaveBeenCalledWith({ type: 'scope', turn: 'editable', part: 0, value: 'Q4 2026' });
    });
  },
};
