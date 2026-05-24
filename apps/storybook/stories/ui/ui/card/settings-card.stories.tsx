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

export const SettingsCard: Story = {
  args: {
    className: 'w-[400px]',
    children: (
      <>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage how you receive email notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium ">Marketing emails</div>
              <div className="text-xs text-muted-foreground">Receive emails about new features</div>
            </div>
            <input type="checkbox" className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium ">Security alerts</div>
              <div className="text-xs text-muted-foreground">Get notified about account activity</div>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium ">Weekly digest</div>
              <div className="text-xs text-muted-foreground">Summary of your weekly activity</div>
            </div>
            <input type="checkbox" className="w-4 h-4" />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1">Cancel</Button>
          <Button className="flex-1">Save Changes</Button>
        </CardFooter>
      </>
    ),
  },
};

/**
 * Pricing card for subscription plans.
 * Use this in pricing pages or upgrade prompts.
 */
