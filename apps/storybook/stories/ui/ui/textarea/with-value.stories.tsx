import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea, Label } from '@invana/forms';

const meta: Meta<typeof Textarea> = {
  title: 'UI/UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default textarea.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValue: Story = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        defaultValue="I'm a software developer passionate about building great products and helping teams succeed."
      />
    </div>
  ),
};

/**
 * Large textarea.
 */
