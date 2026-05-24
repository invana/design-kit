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

export const ProductCard: Story = {
  args: {
    className: 'w-[300px]',
    children: (
      <>
        <div className="aspect-square bg-muted/20 flex items-center justify-center text-6xl">
          📱
        </div>
        <CardHeader>
          <CardTitle>Wireless Headphones</CardTitle>
          <CardDescription>Premium noise-cancelling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">$299</span>
            <span className=" text-muted-foreground line-through">$399</span>
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">25% OFF</span>
          </div>
          <div className="mt-3 flex gap-1">
            <span>⭐⭐⭐⭐⭐</span>
            <span className=" text-muted-foreground">(128 reviews)</span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1">Add to Cart</Button>
          <Button className="flex-1">Buy Now</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Statistics/metrics card.
 * Use this in dashboards to display KPIs and important metrics.
 */
