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

export const ColoredHeaderVariants: Story = {
  render: () => (
    <div className="w-full max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardWithHeader
          title="Info"
          description={<span className="text-white/80">General information</span>}
          headerClassName="bg-blue-600 text-white"
          contentClassName=""
        >
          <p className="">Blue header for informational content.</p>
        </CardWithHeader>
        
        <CardWithHeader
          title="Success"
          description={<span className="text-white/80">Completed tasks</span>}
          headerClassName="bg-green-600 text-white"
          contentClassName=""
        >
          <p className="">Green header for success states.</p>
        </CardWithHeader>
        
        <CardWithHeader
          title="Warning"
          description={<span className="text-black/70">Needs attention</span>}
          headerClassName="bg-yellow-500 text-black"
          contentClassName=""
        >
          <p className="">Yellow header for warnings.</p>
        </CardWithHeader>
        
        <CardWithHeader
          title="Error"
          description={<span className="text-white/80">Critical issue</span>}
          headerClassName="bg-red-600 text-white"
          contentClassName=""
        >
          <p className="">Red header for errors and alerts.</p>
        </CardWithHeader>
        
        <CardWithHeader
          title="Premium"
          description={<span className="text-white/80">Exclusive content</span>}
          headerClassName="bg-purple-600 text-white"
          contentClassName=""
        >
          <p className="">Purple header for premium features.</p>
        </CardWithHeader>
        
        <CardWithHeader
          title="Dark"
          description={<span className="text-white/80">Dark themed card</span>}
          headerClassName="bg-gray-800 text-white"
          contentClassName=""
        >
          <p className="">Dark header for contrast.</p>
        </CardWithHeader>
      </div>
    </div>
  ),
};
