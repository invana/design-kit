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
 * `costAs="strip"` with `seamless`: the cost cells divided by rules only, the
 * outer cells flush with the question — as the confirm ask draws it.
 */
export const Seamless: Story = {
  args: {
    question: 'Run the full backtest?',
    description: 'Replays every fill since 2019 through factor model v4.',
    heading: true,
    cost: [
      { label: 'Rows', value: '2.3B' },
      { label: 'Time', value: '~40 s' },
      { label: 'Writes', value: '0' },
    ],
    costAs: 'strip',
    seamless: true,
    children: [
      <Button key="no" size="xs" variant="outline" onClick={fn()}>Narrow to Q3 first</Button>,
      <Button key="yes" size="xs" onClick={fn()}>Run it</Button>,
    ],
  },
};
