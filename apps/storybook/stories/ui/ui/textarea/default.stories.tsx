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

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
};

/**
 * Textarea with label.
 */
