import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertTitle, AlertDescription } from '@invana/ui';

const meta: Meta<typeof Alert> = {
  title: 'UI/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


/**
 * Default alert for general information.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <AlertDescription>
        A simple alert message without a title.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Comprehensive showcase of all alert variants and use cases.
 */
