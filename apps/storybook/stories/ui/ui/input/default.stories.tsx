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

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
};

/**
 * Input with label.
 */
