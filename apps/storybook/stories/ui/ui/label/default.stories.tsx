import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label, Input } from '@invana/forms';

const meta: Meta<typeof Label> = {
  title: 'UI/UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" type="email" placeholder="you@invana.io" />
    </div>
  ),
};
