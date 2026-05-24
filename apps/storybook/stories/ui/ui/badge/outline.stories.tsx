import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@invana/ui';

const meta: Meta<typeof Badge> = {
  title: 'UI/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default badge with primary styling.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

/**
 * Example showing multiple badges together.
 */
