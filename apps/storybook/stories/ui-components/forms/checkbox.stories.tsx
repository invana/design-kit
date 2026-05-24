import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Label } from '@invana/forms';

const meta = {
  title: 'ui-kit/form-inputs/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox.
 */
export const Default: Story = {
  args: {
    id: 'checkbox-default',
  },
};

/**
 * Checkbox with label.
 */
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
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <Label htmlFor="disabled">Disabled checkbox</Label>
    </div>
  ),
};

/**
 * Checked by default.
 */
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
            <Checkbox id="unchecked" />
            <Label htmlFor="unchecked">Unchecked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="checked" defaultChecked />
            <Label htmlFor="checked">Checked</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-unchecked" disabled />
            <Label htmlFor="disabled-unchecked" className="text-muted-foreground">Disabled (Unchecked)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled-checked" disabled defaultChecked />
            <Label htmlFor="disabled-checked" className="text-muted-foreground">Disabled (Checked)</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Form Example</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">I agree to the terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="marketing" />
            <Label htmlFor="marketing">Send me marketing emails</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="newsletter" defaultChecked />
            <Label htmlFor="newsletter">Subscribe to newsletter</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Descriptions</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox id="notifications" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="notifications">Enable notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications about updates and activity.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox id="analytics" className="mt-1" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="analytics">Share analytics</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing anonymous usage data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Feature Selection</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="feature1" defaultChecked />
            <Label htmlFor="feature1">✨ Dark Mode</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="feature2" defaultChecked />
            <Label htmlFor="feature2">🔔 Notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="feature3" />
            <Label htmlFor="feature3">📊 Advanced Analytics</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="feature4" />
            <Label htmlFor="feature4">🔒 Two-Factor Authentication</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Task List</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="task1" defaultChecked />
            <Label htmlFor="task1" className="line-through text-muted-foreground">Review pull request</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task2" defaultChecked />
            <Label htmlFor="task2" className="line-through text-muted-foreground">Update documentation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task3" />
            <Label htmlFor="task3">Write unit tests</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="task4" />
            <Label htmlFor="task4">Deploy to production</Label>
          </div>
        </div>
      </div>
    </div>
  ),
};
