import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle, CardWithHeader, Button } from '@invana/ui';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export

const meta: Meta<typeof Card> = {
  title: 'UI/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


// ===== BASIC CARD EXAMPLES =====

/**
 * Basic card with header and content.
 * Use this as the foundation for any card-based UI.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Primary Header Card"
      description={<span className="text-primary-foreground/80">Card with primary colored header</span>}
      headerClassName="bg-primary text-primary-foreground"
      contentClassName=""
      footer={<Button variant="outline" className="w-full">Action</Button>}
    >
      <p>This card has a primary colored header, similar to Bootstrap's card-header styles.</p>
    </CardWithHeader>
  ),
};

/**
 * Card with success colored header.
 * Use this for positive actions or successful states.
 */
