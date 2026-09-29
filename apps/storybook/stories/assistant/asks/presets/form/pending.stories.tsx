import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConversationTurn, resolveRegistry, type AskTurn } from '@invana/assistant';

const meta: Meta<typeof ConversationTurn> = {
  title: 'Assistant/Asks/Presets/Form',
  component: ConversationTurn,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AskTurn = {
  id: 't5',
  role: 'assistant',
  kind: 'ask',
  stage: 'analyse',
  state: 'pending',
  ask: {
    preset: 'form',
    question: 'Scenario inputs',
    fields: [
      { name: 'share', label: 'Share moved', type: 'number', unit: '%', default: 30 },
      { name: 'leadTime', label: 'Brightline lead time', type: 'number', unit: 'd', default: 17, aside: 'quoted 14 d' },
      { name: 'unitCost', label: 'Unit cost', type: 'number', unit: '%', default: 4.5 },
      { name: 'start', label: 'Starting', type: 'date', default: '1 Nov 2026' },
    ],
    submit: 'Compare 0%, 30% and 50%',
    hint: 'Observed lead time is from 38 Brightline POs · prefilled as the safer choice',
  },
};

/** Waiting: the scenario's inputs as one form, labels on the left and each unit or note at the end of its input. The button sends a `reply` keyed by field name (see the Actions panel). */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
