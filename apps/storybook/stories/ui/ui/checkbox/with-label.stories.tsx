import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from '@invana/forms';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default checkbox.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/**
 * Disabled checkbox.
 */
