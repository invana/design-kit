import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Users, Shield, Bell } from 'lucide-react';
import { MenuItem } from '@invana/ui';

const meta: Meta<typeof MenuItem> = {
  title: 'UI/UI Extended/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single menu row with an icon, label, shortcut and optional nested children
 * that reveal on hover.
 */
export const Default: Story = {
  render: () => (
    <ul className="w-[240px] rounded-md border bg-card p-1 text-card-foreground">
      <MenuItem
        id="settings"
        label="Settings"
        icon={Settings}
        shortcut="⌘,"
        children={[
          { id: 'account', label: 'Account', icon: Users, shortcut: '⌘A' },
          { id: 'security', label: 'Security', icon: Shield, shortcut: '⌘L' },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ]}
      />
    </ul>
  ),
};
