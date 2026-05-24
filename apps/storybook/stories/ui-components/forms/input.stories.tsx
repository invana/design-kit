import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Label } from '@invana/forms';

const meta = {
  title: 'ui-kit/form-inputs/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input.
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
};

/**
 * Input with label.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

/**
 * Disabled input.
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

/**
 * Password input.
 */
export const Password: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter password" />
    </div>
  ),
};

/**
 * Number input.
 */
export const Number: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="age">Age</Label>
      <Input id="age" type="number" placeholder="25" />
    </div>
  ),
};

/**
 * Search input.
 */
export const Search: Story = {
  render: () => (
    <div className="space-y-2 w-64">
      <Label htmlFor="search">Search</Label>
      <Input id="search" type="search" placeholder="Search..." />
    </div>
  ),
};

/**
 * Input with default value.
 */
export const WithValue: Story = {
  args: {
    defaultValue: 'Pre-filled value',
  },
};

/**
 * Comprehensive showcase of all input types and states.
 */
export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Input Types</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Input id="text-input" type="text" placeholder="Enter text..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-input">Email</Label>
            <Input id="email-input" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-input">Password</Label>
            <Input id="password-input" type="password" placeholder="Enter password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number-input">Number</Label>
            <Input id="number-input" type="number" placeholder="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tel-input">Telephone</Label>
            <Input id="tel-input" type="tel" placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url-input">URL</Label>
            <Input id="url-input" type="url" placeholder="https://example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search-input">Search</Label>
            <Input id="search-input" type="search" placeholder="Search..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-input">Date</Label>
            <Input id="date-input" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-input">Time</Label>
            <Input id="time-input" type="time" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="datetime-input">DateTime</Label>
            <Input id="datetime-input" type="datetime-local" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="normal">Normal</Label>
            <Input id="normal" placeholder="Normal input" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-value">With Value</Label>
            <Input id="with-value" defaultValue="Some value" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" placeholder="Disabled input" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled-value">Disabled with Value</Label>
            <Input id="disabled-value" defaultValue="Disabled value" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readonly">Read-only</Label>
            <Input id="readonly" defaultValue="Read-only value" readOnly />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes & Widths</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Width</Label>
            <Input placeholder="Full width input" className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>Medium Width</Label>
            <Input placeholder="Medium width" className="w-96" />
          </div>
          <div className="space-y-2">
            <Label>Small Width</Label>
            <Input placeholder="Small" className="w-48" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">With Helper Text</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="with-help">Email Address</Label>
            <Input id="with-help" type="email" placeholder="you@example.com" />
            <p className="text-sm text-muted-foreground">We'll never share your email.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-error">Password</Label>
            <Input id="with-error" type="password" placeholder="Enter password" className="border-destructive" />
            <p className="text-sm text-destructive">Password must be at least 8 characters.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="with-success">Username</Label>
            <Input id="with-success" defaultValue="johndoe" className="border-green-500" />
            <p className="text-sm text-green-600">Username is available!</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
