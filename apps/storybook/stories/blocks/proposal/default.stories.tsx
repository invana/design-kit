import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProposalBlock } from '@invana/blocks';

const meta: Meta<typeof ProposalBlock> = {
  title: 'Blocks/Proposal',
  component: ProposalBlock,
  parameters: { layout: 'padded' },
  // The chat's middle width; a block fills whatever its shell gives it.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Something to write and what writing it does, with its actions, each sent as its id. Bare: a
 * conversation draws it in its own card, a dashboard in a panel.
 */
export const Default: Story = {
  args: {
    spec: {
      title: 'from this answer',
      rows: [
        {
          label: 'Alert',
          value: 'Refunds > 2σ by store',
        },
        {
          label: 'Checks',
          value: 'Daily, 07:00',
        },
        {
          label: 'Notify',
          value: 'Store managers',
        },
      ],
      consequence: 'Creates one alert rule. It would have fired 3 times in September.',
      actions: [
        {
          id: 'create',
          label: 'Create alert',
          variant: 'primary',
        },
        {
          id: 'edit',
          label: 'Edit',
        },
      ],
    },
    onAction: fn(),
  },
};
