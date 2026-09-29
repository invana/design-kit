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
  state: 'answered',
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
  value: { share: 30, leadTime: 17, unitCost: 4.5, start: '1 Nov 2026' },
};

/** Answered: the inputs settle into their values. "Change answers" reopens the form, and sending again is a `change` (see the Actions panel). */
export const Answered: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
