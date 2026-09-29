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
  state: 'pending',
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
};

/** Waiting on the analyst. A few short options in one row; picking one is the reply. */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
