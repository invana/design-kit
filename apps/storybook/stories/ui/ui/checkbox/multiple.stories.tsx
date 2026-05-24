import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;


/**
 * Default checkbox.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" defaultChecked />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </div>
  ),
};

/**
 * Comprehensive showcase of all checkbox states and use cases.
 */
