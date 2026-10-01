import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Page } from '@invana/blocks';
import { answerToPage, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof Page> = {
  title: 'Blocks/Page',
  component: Page,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const answer: AnswerTurn = {
  id: 'a1',
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'answer',
  title: 'Margin by plant, Q3',
  blocks: [
    { kind: 'narrative', text: 'Plant C has the lowest margin at **11.4%**, ▼ 2.1 pts on Q2.', cites: [1] },
    {
      kind: 'bars',
      groups: ['A', 'B', 'C', 'D'],
      series: [
        { name: 'Q3', values: [17.2, 13.1, 11.4, 14.8] },
        { name: 'Q2', values: [16.4, 13.9, 13.5, 14.2], muted: true },
      ],
      target: { value: 16, label: 'target 16%' },
      unit: '%',
    },
    { kind: 'citations', sources: [{ label: 'General ledger, Q3', detail: 'table · loaded 28 Sep' }] },
  ],
};

/**
 * A long answer opened in full: `answerToPage` keeps the blocks a page draws,
 * in order, under the answer's title. The citations stay in the conversation.
 */
export const FromAnAnswer: Story = {
  name: 'From an answer',
  args: { spec: answerToPage(answer), onAction: fn(), style: { maxWidth: 720 } },
};
