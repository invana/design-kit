import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Select>;


/**
 * Basic select dropdown.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Comprehensive showcase of all select variations and use cases.
 */
