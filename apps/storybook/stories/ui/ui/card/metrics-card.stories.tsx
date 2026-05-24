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

export const MetricsCard: Story = {
  args: {
    className: 'w-[280px]',
    children: (
      <>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className=" font-medium">Total Revenue</CardTitle>
          <span className="text-2xl">💰</span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600">↑ 20.1%</span> from last month
          </p>
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-primary"></div>
          </div>
        </CardContent>
      </>
    ),
  },
};

/**
 * Notification card.
 * Use this for alerts, messages, or activity feeds.
 */
