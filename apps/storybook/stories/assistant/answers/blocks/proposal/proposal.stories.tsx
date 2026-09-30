import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import type { AnswerTurn, BlockSpec } from '@invana/assistant';

import { Board } from '../../../board';

const meta: Meta<typeof Board> = {
  title: 'Assistant/Answers/Blocks/Proposal',
  component: Board,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const proposal = (id: string, block: BlockSpec): AnswerTurn => ({
  id,
  role: 'assistant',
  kind: 'answer',
  state: 'complete',
  blocks: [block],
});

const alert = [
  { label: 'Alert', value: 'Refunds > 2σ by store' },
  { label: 'Checks', value: 'Daily, 07:00' },
  { label: 'Notify', value: 'Store managers' },
];
const consequence = 'Creates one alert rule. It would have fired 3 times in September.';

/**
 * Something the answer proposes to write, as its own card under the answer: the draft, or what
 * writing it does as figures, what it would do in words, and the actions — each an `action` event
 * (see the Actions panel). Once written, a stamp says so and the header says when.
 */
export const Proposal: Story = {
  name: 'Proposal',
  args: {
    onEvent: fn(),
    variants: [
      {
        caption: 'What it writes + consequence',
        turn: proposal('writes', {
          preset: 'proposal',
          title: 'from this answer',
          rows: alert,
          consequence,
          actions: [
            { id: 'create', label: 'Create alert', variant: 'primary' },
            { id: 'edit', label: 'Edit' },
          ],
        }),
      },
      {
        caption: 'Impact as figures',
        turn: proposal('figures', {
          preset: 'proposal',
          title: 'from this answer',
          heading: 'Alert on refunds above 2σ by store',
          figures: [
            { label: 'Rules', value: '1' },
            { label: 'Fired in Sep', value: '3' },
            { label: 'Recipients', value: '214' },
          ],
          actions: [
            { id: 'later', label: 'Not now', variant: 'ghost' },
            { id: 'edit', label: 'Edit', push: true },
            { id: 'create', label: 'Create alert', variant: 'primary' },
          ],
        }),
      },
      {
        caption: 'A scheduled report',
        turn: proposal('schedule', {
          preset: 'proposal',
          title: 'from this thread',
          rows: [
            { label: 'Report', value: 'Q3 margin bridge — North' },
            { label: 'Schedule', value: 'Mondays, 08:00' },
            { label: 'Send to', value: 'You, 6 regional managers' },
          ],
          consequence: 'Sends the answer above each week with fresh data.',
          actions: [
            { id: 'schedule', label: 'Schedule', variant: 'primary' },
            { id: 'edit', label: 'Edit' },
            { id: 'later', label: 'Not now', variant: 'ghost' },
          ],
        }),
      },
      {
        caption: 'Created',
        turn: proposal('created', {
          preset: 'proposal',
          title: 'from this answer',
          done: { label: 'Alert created', at: '14:02' },
          rows: [
            { label: 'Alert', value: 'Refunds > 2σ by store' },
            { label: 'First check', value: 'Tomorrow, 07:00' },
          ],
          actions: [{ id: 'open', label: 'Open alert', variant: 'link' }],
        }),
      },
      {
        caption: 'At 280px',
        narrow: true,
        turn: proposal('narrow', {
          preset: 'proposal',
          rows: alert,
          consequence,
          actions: [
            { id: 'create', label: 'Create alert', variant: 'primary' },
            { id: 'edit', label: 'Edit' },
          ],
        }),
      },
    ],
  },
};
