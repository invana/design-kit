import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Bars',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't4',
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'chart',
  title: '30-day readmission by discharge day',
  blocks: [
    {
      preset: 'bars',
      unit: '%',
      highlight: 'F',
      groups: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [{ name: '30-day readmission', values: [6.1, 5.8, 6.0, 6.4, 8.2, 7.9, 7.1] }],
      target: { value: 6.1, label: 'avg' },
    },
  ],
};

/** One series against its average: the highlighted day in primary, the rest muted, every value on its cap. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
