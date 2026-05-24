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

export const PricingCard: Story = {
  args: {
    className: 'w-[300px]',
    children: (
      <>
        <CardHeader>
          <div className="text-center">
            <CardTitle className="text-xl">Professional</CardTitle>
            <CardDescription className="mt-2">For growing teams</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 ">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Unlimited projects
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Advanced analytics
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              Custom integrations
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <span>✗</span>
              White-label options
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Interactive hover card.
 * Use this for cards that need hover effects or clickable areas.
 */
