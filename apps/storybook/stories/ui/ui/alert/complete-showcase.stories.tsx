import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, AlertDescription, AlertTitle, TypographyH5 } from '@invana/ui';

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

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="flex flex-col gap-8 p-6 max-w-3xl">
      <div>
        <TypographyH5 className="mb-4">All Variants</TypographyH5>
        <div className="flex flex-col gap-4">
          <Alert>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              Use this for general information, tips, or neutral notifications.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Destructive Alert</AlertTitle>
            <AlertDescription>
              Use this for errors, failures, or critical warnings that need immediate attention.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">Different Content Structures</TypographyH5>
        <div className="flex flex-col gap-4">
          <Alert>
            <AlertTitle>Title Only</AlertTitle>
          </Alert>
          <Alert>
            <AlertDescription>
              Description only - useful for simple messages.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Title with Long Description</AlertTitle>
            <AlertDescription>
              This alert contains a longer description that spans multiple lines.
              It demonstrates how the alert component handles more extensive content
              and maintains proper spacing and readability.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div>
        <TypographyH5 className="mb-4">Common Use Cases</TypographyH5>
        <div className="flex flex-col gap-4">
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your changes have been saved successfully.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to connect to the database. Please check your connection settings.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This action cannot be undone. Make sure you have a backup before proceeding.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Your session will expire in 5 minutes. Please save your work.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  ),
};
