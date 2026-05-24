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

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="max-w-lg">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Something went wrong! Please check your input and try again.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Alert with only a title.
 */
