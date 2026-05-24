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

export const DefaultChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Checked by default</Label>
    </div>
  ),
};

/**
 * Multiple checkboxes.
 */
