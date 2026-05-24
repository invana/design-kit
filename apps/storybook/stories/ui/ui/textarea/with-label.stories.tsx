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

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here..." />
    </div>
  ),
};

/**
 * Disabled textarea.
 */
