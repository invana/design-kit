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

export const UserProfile: Story = {
  args: {
    className: 'w-[350px]',
    children: (
      <>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <CardTitle>Sarah Johnson</CardTitle>
              <CardDescription>Product Designer</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 ">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>sarah.j@company.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>San Francisco, CA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined:</span>
              <span>Jan 2023</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">View Profile</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Product card for e-commerce.
 * Use this in product catalogs, shopping carts, or marketplace listings.
 */
