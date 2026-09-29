import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Confirm',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't3',
  role: 'assistant',
  kind: 'ask',
  stage: 'check',
  state: 'pending',
  ask: {
    preset: 'confirm',
    question: 'This scans every store and every day since 2019. Run it as asked?',
    cost: { rows: '2.3B', time: 'about 40 s', writes: 0 },
    yes: 'Run it',
    no: 'Narrow to Q3 first',
    default: false,
    hint: 'Default: narrow first',
  },
};

/** With a cost: rows scanned, time and records written as figures before the buttons. The default, here no, is the primary and leads. */
export const WithCost: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
