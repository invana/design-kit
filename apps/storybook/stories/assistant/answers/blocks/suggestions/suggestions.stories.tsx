import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Suggestions',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const next = (id: string, block: BlockSpec): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'next',
  blocks: [block],
});

const items = ['Break freight down by carrier', 'Compare with Q3 last year', 'Alert me if it gets worse'];

/**
 * Follow-ups that reuse the current scope. Picking one sends a `suggestion` event, which the API
 * sends on as the next prompt (see the Actions panel). They run along a line, stack one per line,
 * or sit under headings; one already sent stays, dimmed.
 */
export const Suggestions: Story = {
  name: 'Suggestions',
  args: {
    onEvent: fn(),
    variants: [
      { caption: 'Chips', turn: next('chips', { preset: 'suggestions', items }) },
      { caption: 'Stacked · for narrow widths', turn: next('stacked', { preset: 'suggestions', items, layout: 'stack' }) },
      {
        caption: 'Grouped',
        turn: next('grouped', {
          preset: 'suggestions',
          groups: [
            { label: 'Go deeper', items: ['Break freight down by carrier', 'Which stores drove it?'] },
            { label: 'Act', items: ['Alert me if it gets worse', 'Send this to the North team'] },
          ],
        }),
      },
      {
        caption: 'One already sent',
        turn: next('sent', { preset: 'suggestions', items, sent: ['Break freight down by carrier'] }),
      },
    ],
  },
};
