import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClarifyCard } from '@invana/assistant';

const meta: Meta<typeof ClarifyCard> = {
  title: 'Assistant/Asks/ClarifyCard',
  component: ClarifyCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Settled: the header says so, and the choice stays drawn with the options not taken. */
export const Answered: Story = {
  args: {
    state: 'answered',
    step: 'check data',
    question: '“Apex” matches two suppliers. Which one?',
    value: 'apex-components',

    options: [
      { value: 'apex-components', label: 'Apex Components, Shenzhen', detail: '142 open POs' },
      { value: 'apex-metals', label: 'Apex Metals, Pune', detail: '9 open POs' },
    ],

    actionsAlign: "end"
  },
};
