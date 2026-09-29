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
  state: 'pending',
  ask: {
    preset: 'single',
    question: '“Apex” matches two suppliers. Which one?',
    options: [
      { value: 'apex-components', label: 'Apex Components, Shenzhen', detail: '142 open POs' },
      { value: 'apex-metals', label: 'Apex Metals, Pune', detail: '9 open POs' },
    ],
    default: 'apex-components',
  },
};

/** Waiting on the analyst. Picking an option is the reply; the default is preselected. */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
