import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConfirmCard } from '@invana/assistant';
import { Button } from '@invana/ui';

const meta: Meta<typeof ConfirmCard> = {
  title: 'Assistant/Asks/ConfirmCard',
  component: ConfirmCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Yes or no, with what yes costs as figures before the buttons. Records written are
 * inked in the warning colour, because they are the cost that changes something.
 */
export const Default: Story = {
  args: {
    question: 'Rebuild the Q3 margin table as asked?',
    cost: [
      { label: 'rows scanned', value: '2.3B' },
      { label: 'to run', value: 'about 40 s' },
      { label: 'records written', value: '12,408', tone: 'warning' },
    ],
    hint: 'Default: narrow to Q3 first',
    children: [
      <Button key="no" size="xs" onClick={fn()}>Narrow to Q3 first</Button>,
      <Button key="yes" size="xs" variant="outline" onClick={fn()}>Run it</Button>,
    ],
  },
};
