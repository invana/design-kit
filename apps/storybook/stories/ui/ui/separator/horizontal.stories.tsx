import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from '@invana/ui';

const meta: Meta<typeof Separator> = {
  title: 'UI/UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Horizontal separator (default).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <h4 className="text-sm font-medium">Section 1</h4>
        <p className="text-sm text-muted-foreground">Content for the first section.</p>
      </div>
      <Separator />
      <div>
        <h4 className="text-sm font-medium">Section 2</h4>
        <p className="text-sm text-muted-foreground">Content for the second section.</p>
      </div>
    </div>
  ),
};

/**
 * Vertical separator.
 */
