import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '@invana/ui';
import { Bold } from 'lucide-react';

const meta: Meta<typeof Toggle> = {
  title: 'UI/UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold />
      Bold
    </Toggle>
  ),
};
