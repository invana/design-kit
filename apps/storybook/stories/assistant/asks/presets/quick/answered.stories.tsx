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
  id: 't7',
  role: 'assistant',
  kind: 'ask',
  stage: 'analyse',
  state: 'answered',
  ask: {
    preset: 'quick',
    question: 'Confidence level',
    options: [
      { value: '90', label: '90%' },
      { value: '95', label: '95%' },
      { value: '99', label: '99%' },
    ],
    default: '95',
  },
  value: '95',
};

/** Answered: the row stays, read-only, with the pick filled. */
export const Answered: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
