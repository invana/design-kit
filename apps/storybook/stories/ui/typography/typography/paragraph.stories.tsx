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

export const Paragraph: Story = {
  render: () => (
    <Typography.P>
      The king, seeing how much happier his subjects were, realized the error of
      his ways and repealed the joke tax.
    </Typography.P>
  ),
};

/**
 * Blockquote for highlighting quotes or important text.
 */
