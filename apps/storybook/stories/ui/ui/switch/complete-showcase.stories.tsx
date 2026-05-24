import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Switch>;


/**
 * Default switch.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">All States</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch id="off" />
            <Label htmlFor="off">Off</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="on" defaultChecked />
            <Label htmlFor="on">On</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="disabled-off" disabled />
            <Label htmlFor="disabled-off" className="text-muted-foreground">Disabled (Off)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="disabled-on" disabled defaultChecked />
            <Label htmlFor="disabled-on" className="text-muted-foreground">Disabled (On)</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Settings Panel</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing" className="font-medium">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive marketing updates</p>
            </div>
            <Switch id="marketing" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security" className="font-medium">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of security events</p>
            </div>
            <Switch id="security" defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Feature Toggles</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">🌙 Dark Mode</Label>
            <Switch id="dark-mode" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="beta">🖼 Beta Features</Label>
            <Switch id="beta" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics">📊 Analytics</Label>
            <Switch id="analytics" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa">🔒 Two-Factor Auth</Label>
            <Switch id="2fa" defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-public" className="font-medium">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
            </div>
            <Switch id="profile-public" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-email" className="font-medium">Show Email</Label>
              <p className="text-sm text-muted-foreground">Display email on your profile</p>
            </div>
            <Switch id="show-email" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activity" className="font-medium">Activity Status</Label>
              <p className="text-sm text-muted-foreground">Show when you're online</p>
            </div>
            <Switch id="activity" defaultChecked />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Layout</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="c1" className="text-sm">Option 1</Label>
            <Switch id="c1" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="c2" className="text-sm">Option 2</Label>
            <Switch id="c2" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="c3" className="text-sm">Option 3</Label>
            <Switch id="c3" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  ),
};
