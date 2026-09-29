import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Multistep',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't8',
  role: 'assistant',
  kind: 'ask',
  stage: 'monitor',
  state: 'pending',
  ask: {
    preset: 'multistep',
    steps: [
      {
        id: 'report',
        preset: 'single',
        question: 'When should the report go out?',
        options: [
          { value: 'mon-0800', label: 'Mondays, 08:00' },
          { value: 'daily-0700', label: 'Daily, 07:00' },
        ],
        default: 'mon-0800',
      },
      {
        id: 'to',
        preset: 'multi',
        question: 'Who should receive it?',
        options: [
          { value: 'me', label: 'You' },
          { value: 'procurement-lead', label: 'Procurement lead' },
        ],
        default: ['me', 'procurement-lead'],
      },
      { id: 'alert', preset: 'number', question: 'Alert when Apex on time falls below', unit: '%', default: 55 },
      {
        id: 'until',
        preset: 'single',
        question: 'Until when?',
        options: [
          { value: 'q1-2027', label: 'End of Q1 2027' },
          { value: 'cancelled', label: 'Until I stop it' },
        ],
        default: 'q1-2027',
      },
    ],
  },
};

/** Waiting: one step at a time, with Skip, Next and Previous. Submit on the last step sends a `reply` keyed by step id (see the Actions panel). */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
