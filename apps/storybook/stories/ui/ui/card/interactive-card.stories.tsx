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

export const InteractiveCard: Story = {
  args: {
    className: 'w-[350px] cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
    children: (
      <>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Hover to see the effect</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" text-muted-foreground">
            This card responds to hover with a subtle lift animation and enhanced shadow.
            Perfect for clickable cards in grids or lists.
          </p>
        </CardContent>
      </>
    ),
  },
};

// ===== LAYOUT EXAMPLES =====

/**
 * Multiple cards in a grid layout.
 * Common pattern for dashboards and data displays.
 */
