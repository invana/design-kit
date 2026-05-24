import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, AvatarImage, AvatarFallback } from '@invana/ui';

const meta: Meta<typeof Avatar> = {
  title: 'UI/UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Avatar with an image.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  render: () => (
    <Avatar className="h-20 w-20">
      <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
      <AvatarFallback>LG</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Small avatar.
 */
