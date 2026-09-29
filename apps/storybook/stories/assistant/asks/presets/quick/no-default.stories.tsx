import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Quick',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't4',
  role: 'assistant',
  kind: 'ask',
  stage: 'scope',
  state: 'pending',
  ask: {
    preset: 'quick',
    question: 'Day, week or month?',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};

/** No default: nothing is picked, so the analyst answers rather than accepts. */
export const NoDefault: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
