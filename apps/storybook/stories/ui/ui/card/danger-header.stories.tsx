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

export const DangerHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Critical Alert"
      description={<span className="text-destructive-foreground/80">Immediate action required</span>}
      headerClassName="bg-destructive text-destructive-foreground"
      contentClassName=""
      footer={
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1">Dismiss</Button>
          <Button variant="destructive" className="flex-1">Upgrade Now</Button>
        </div>
      }
    >
      <p className="">Your account has exceeded the storage limit. Please upgrade your plan or remove some files.</p>
    </CardWithHeader>
  ),
};

/**
 * Card with muted/secondary colored header.
 * Use this for less prominent information or secondary content.
 */
