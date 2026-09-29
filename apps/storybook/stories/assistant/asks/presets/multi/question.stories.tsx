import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Multi',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't9',
  role: 'assistant',
  kind: 'ask',
  stage: 'act',
  state: 'pending',
  ask: {
    preset: 'multi',
    question: 'Which channels should I include?',
    options: [
      { value: 'stores', label: 'Stores', detail: '188' },
      { value: 'online', label: 'Online', detail: '1' },
      { value: 'wholesale', label: 'Wholesale', detail: '25' },
    ],
    default: ['stores', 'online'],
  },
};

/** A prompt that is a question is not a verb, so the button says what it sends: `Use 2 selected`. */
export const Question: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
