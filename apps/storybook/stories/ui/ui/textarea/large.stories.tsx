import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, Label } from '@invana/forms';

const meta: Meta<typeof Textarea> = {
  title: 'UI/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default textarea.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  render: () => (
    <div className="space-y-2 w-96">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        placeholder="Enter a detailed description..."
        className="min-h-[150px]"
      />
    </div>
  ),
};

/**
 * Comprehensive showcase of all textarea sizes, states, and use cases.
 */
