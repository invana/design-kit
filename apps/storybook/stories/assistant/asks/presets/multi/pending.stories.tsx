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
  id: 't6',
  role: 'assistant',
  kind: 'ask',
  stage: 'analyse',
  state: 'pending',
  ask: {
    preset: 'multi',
    question: 'Adjust for',
    options: [
      { value: 'age-sex', label: 'Age and sex' },
      { value: 'asa', label: 'ASA grade' },
      { value: 'charlson', label: 'Charlson comorbidity index' },
      { value: 'deprivation', label: 'Deprivation decile' },
      { value: 'los', label: 'Length of stay', note: 'on the causal path' },
    ],
    default: ['age-sex', 'asa', 'charlson', 'deprivation'],
  },
};

/** Waiting on the analyst. The defaults arrive ticked; the option left off says why on the right. Submit sends the ticked values. */
export const Pending: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
