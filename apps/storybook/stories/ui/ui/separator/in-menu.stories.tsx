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

export const InMenu: Story = {
  render: () => (
    <div className="w-[200px] border rounded-md p-2">
      <div className="px-2 py-1.5 text-sm hover:bg-accent cursor-pointer rounded">Profile</div>
      <div className="px-2 py-1.5 text-sm hover:bg-accent cursor-pointer rounded">Settings</div>
      <Separator className="my-1" />
      <div className="px-2 py-1.5 text-sm hover:bg-accent cursor-pointer rounded">Help</div>
      <div className="px-2 py-1.5 text-sm hover:bg-accent cursor-pointer rounded">Logout</div>
    </div>
  ),
};
