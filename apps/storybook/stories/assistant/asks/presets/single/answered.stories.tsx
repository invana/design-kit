import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Single',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't2',
  role: 'assistant',
  kind: 'ask',
  stage: 'check',
  state: 'answered',
  ask: {
    preset: 'single',
    question: '“Apex” matches two suppliers. Which one?',
    options: [
      { value: 'apex-components', label: 'Apex Components, Shenzhen', detail: '142 open POs' },
      { value: 'apex-metals', label: 'Apex Metals, Pune', detail: '9 open POs' },
    ],
    default: 'apex-components',
  },
  value: 'apex-components',
};

/** Answered: the choice stays drawn, read-only, beside the option not taken. */
export const Answered: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
