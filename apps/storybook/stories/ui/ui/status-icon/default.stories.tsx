import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIcon } from '@invana/ui';

const meta: Meta<typeof StatusIcon> = {
  title: 'UI/UI/StatusIcon',
  component: StatusIcon,
  parameters: { layout: 'centered' },
  argTypes: {
    state: {
      control: 'select',
      options: ['success', 'error', 'running', 'queued', 'waiting', 'question', 'alert', 'cancelled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One glyph. It stands in for the word, so `label` is the accessible name and
 * the tooltip — pick a `state` to see each: a check for succeeded, a cross for
 * failed, a spinning loader while running, a pause while it waits on approval.
 */
export const Default: Story = {
  args: { state: 'waiting', label: 'awaiting_approval' },
};
