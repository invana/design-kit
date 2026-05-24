import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch, Label } from '@invana/forms';

const meta: Meta<typeof Switch> = {
  title: 'UI/UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default switch.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultChecked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

/**
 * Multiple switches.
 */
