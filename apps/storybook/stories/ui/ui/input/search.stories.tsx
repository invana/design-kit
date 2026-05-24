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

export const Search: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="search">Search</Label>
      <Input id="search" type="search" placeholder="Search..." />
    </div>
  ),
};

/**
 * Input with default value.
 */
