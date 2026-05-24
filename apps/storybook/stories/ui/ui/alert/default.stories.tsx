import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertTitle, AlertDescription } from '@invana/ui';

const meta = {
  title: 'UI/UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Alert>;


/**
 * Default alert for general information.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="max-w-lg">
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert displaying important information to the user.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Destructive alert for errors or critical warnings.
 */
