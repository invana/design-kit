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

export const AccentHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Premium Feature"
      description={<span className="text-accent-foreground/80">Unlock advanced capabilities</span>}
      headerClassName="bg-accent text-accent-foreground"
      contentClassName=""
      footer={<Button className="w-full">Upgrade to Premium</Button>}
    >
      <ul className="space-y-2 ">
        <li className="flex items-center gap-2">
          <span>✨</span> Advanced analytics
        </li>
        <li className="flex items-center gap-2">
          <span>✨</span> Priority support
        </li>
        <li className="flex items-center gap-2">
          <span>✨</span> Custom integrations
        </li>
      </ul>
    </CardWithHeader>
  ),
};

/**
 * Card with gradient colored header.
 * Modern card with gradient header for eye-catching designs.
 */
