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

export const GradientHeader: Story = {
  render: () => (
    <CardWithHeader
      className="w-[350px]"
      title="Gradient Header"
      description={<span className="text-white/90">Modern gradient design</span>}
      headerClassName="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      contentClassName=""
      footer={<Button className="w-full">Explore</Button>}
    >
      <p className="">This card features a beautiful gradient header that draws attention and adds visual interest.</p>
      <div className="mt-4 flex gap-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Feature</span>
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">New</span>
      </div>
    </CardWithHeader>
  ),
};

/**
 * Multiple cards with different colored headers using CardWithHeader.
 * Demonstrates how colored headers can be used together in a layout.
 */
