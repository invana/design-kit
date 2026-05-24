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

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/**
 * Large avatar.
 */
