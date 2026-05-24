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

export const MutedHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Settings"
      description="Manage your preferences"
      headerClassName="bg-muted text-foreground"
      contentClassName=""
      footer={<Button className="w-full">Save Changes</Button>}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="">Notifications</span>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <span className="">Auto-save</span>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <span className="">Dark mode</span>
          <input type="checkbox" className="h-4 w-4" />
        </div>
      </div>
    </CardWithHeader>
  ),
};

/**
 * Card with accent colored header.
 * Use this to highlight special features or premium content.
 */
