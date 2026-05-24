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

export const Small: Story = {
  render: () => (
    <Avatar className="h-8 w-8">
      <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
      <AvatarFallback>SM</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Multiple avatars in a row.
 */
