import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AnswerTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Answers/Blocks/Metric',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: 't8',
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  label: 'readout',
  title: 'Friday vs Mon–Thu, adjusted',
  blocks: [
    { preset: 'metric', label: 'Adjusted odds ratio', value: '1.29', delta: '95% CI 1.04–1.60 · p = 0.02' },
  ],
};

/** The one figure an answer turns on: its label over it, the comparison in mono under it. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
