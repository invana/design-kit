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

export const Pre: Story = {
  render: () => (
    <Typography.Pre>
      <code>{`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));`}</code>
    </Typography.Pre>
  ),
};

/**
 * Complete example showing all typography components together.
 */
