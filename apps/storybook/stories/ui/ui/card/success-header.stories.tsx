import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle, CardWithHeader, Button } from '@invana/ui';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta = {
  title: 'UI/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Card>;


// ===== BASIC CARD EXAMPLES =====

/**
 * Basic card with header and content.
 * Use this as the foundation for any card-based UI.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Success State"
      description={<span className="text-white/80">Operation completed successfully</span>}
      headerClassName="bg-green-600 text-white"
      contentClassName=""
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 ">
          <span className="text-2xl">✓</span>
          <span>All items processed</span>
        </div>
        <div className="flex items-center gap-2 ">
          <span className="text-2xl">✓</span>
          <span>Data synchronized</span>
        </div>
        <div className="flex items-center gap-2 ">
          <span className="text-2xl">✓</span>
          <span>Notifications sent</span>
        </div>
      </div>
    </CardWithHeader>
  ),
};

/**
 * Card with destructive/danger colored header.
 * Use this for warnings, errors, or critical information.
 */
