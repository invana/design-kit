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

export const Multiple: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="s1">Email notifications</Label>
        <Switch id="s1" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="s2">Push notifications</Label>
        <Switch id="s2" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="s3">SMS notifications</Label>
        <Switch id="s3" />
      </div>
    </div>
  ),
};

/**
 * Comprehensive showcase of all switch states and use cases.
 */
