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

export const H3: Story = {
  render: () => (
    <Typography.H3>
      The Joke Tax
    </Typography.H3>
  ),
};

/**
 * Minor heading for smaller sections.
 */
