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

export const H1: Story = {
  render: () => (
    <Typography.H1>
      Taxing Laughter: The Joke Tax Chronicles
    </Typography.H1>
  ),
};

/**
 * Section heading with bottom border.
 */
