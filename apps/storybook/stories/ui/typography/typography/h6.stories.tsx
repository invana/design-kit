import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@invana/ui';

const meta: Meta<typeof Typography.H1> = {
  title: 'UI/Typography/Typography',
  component: Typography.H1,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components for consistent text styling across your application.',
      },
    },
  },
  // tags: ['autodocs'],
};


/**
 * Main page heading - largest and most prominent heading.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const H6: Story = {
  render: () => (
    <Typography.H6>
      A New Beginning
    </Typography.H6>
  ),
};

/**
 * Standard paragraph text with proper spacing.
 */
