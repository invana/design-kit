import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@invana/ui';

const meta = {
  title: 'UI/UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Separator>;


/**
 * Horizontal separator (default).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <div className="text-sm">Item 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Item 3</div>
    </div>
  ),
};

/**
 * Separator in a menu context.
 */
