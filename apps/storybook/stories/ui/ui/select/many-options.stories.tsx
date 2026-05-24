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

export const ManyOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Choose a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="date">Date</SelectItem>
        <SelectItem value="elderberry">Elderberry</SelectItem>
        <SelectItem value="fig">Fig</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="honeydew">Honeydew</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/**
 * Disabled select.
 */
