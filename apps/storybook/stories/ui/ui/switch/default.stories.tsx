import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch, Label } from '@invana/forms';

const meta: Meta<typeof Switch> = {
  title: 'UI/UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default switch.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'switch-default',
  },
};

/**
 * Switch with label.
 */
