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

export const WithFooter: Story = {
  args: {
    className: 'w-[350px]',
    children: (
      <>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>With all card sections</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card demonstrates the header, content, and footer sections.</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </CardFooter>
      </>
    ),
  },
};

// ===== REAL-WORLD USE CASES =====

/**
 * User profile card.
 * Use this for displaying user information in dashboards or directories.
 */
