import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;


/**
 * Default textarea.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="disabled">Disabled</Label>
      <Textarea id="disabled" placeholder="This textarea is disabled" disabled />
    </div>
  ),
};

/**
 * Textarea with default value.
 */
