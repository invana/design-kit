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

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * Comprehensive showcase of all avatar sizes and states.
 */
