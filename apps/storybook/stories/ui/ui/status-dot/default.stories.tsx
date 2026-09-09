import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '@invana/ui';

const meta: Meta<typeof StatusDot> = {
  title: 'UI/UI/StatusDot',
  component: StatusDot,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** A single dot. `label` is what a screen reader hears when nothing beside it says the state. */
export const Default: Story = {
  args: { tone: 'running', size: 'sm', label: 'Running' },
};
