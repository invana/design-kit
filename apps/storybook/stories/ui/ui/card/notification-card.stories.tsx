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

export const NotificationCard: Story = {
  args: {
    className: 'w-[400px]',
    children: (
      <>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                🔔
              </div>
              <div>
                <CardTitle>New comment on your post</CardTitle>
                <CardDescription>2 minutes ago</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm">✕</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="">
            <span className="font-semibold">John Doe</span> commented: "Great work on this feature!
            Looking forward to seeing it in production."
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" size="sm">Mark as Read</Button>
          <Button size="sm">Reply</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Feature card for landing pages.
 * Use this to showcase product features, benefits, or services.
 */
