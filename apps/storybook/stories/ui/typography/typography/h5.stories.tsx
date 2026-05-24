import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@invana/ui';

const meta = {
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
} satisfies Meta<typeof Typography.H1>;


/**
 * Main page heading - largest and most prominent heading.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const H5: Story = {
  render: () => (
    <Typography.H5>
      The Jester's Plan
    </Typography.H5>
  ),
};

/**
 * Smallest heading for minor details.
 */
