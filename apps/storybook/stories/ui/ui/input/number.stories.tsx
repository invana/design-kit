import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Label } from '@invana/forms';

const meta: Meta<typeof Input> = {
  title: 'UI/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default text input.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Number: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="age">Age</Label>
      <Input id="age" type="number" placeholder="25" />
    </div>
  ),
};

/**
 * Search input.
 */
