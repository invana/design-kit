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

export const FeatureCard: Story = {
  args: {
    className: 'w-[320px]',
    children: (
      <>
        <CardHeader>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl mb-3">
            ⚡
          </div>
          <CardTitle>Lightning Fast</CardTitle>
          <CardDescription>Optimized for performance</CardDescription>
        </CardHeader>
        <CardContent>
          <p className=" text-muted-foreground">
            Experience blazing fast load times and smooth interactions.
            Our platform is built for speed from the ground up.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="px-0">Learn more →</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Settings card for configuration panels.
 * Use this in settings pages or preference menus.
 */
