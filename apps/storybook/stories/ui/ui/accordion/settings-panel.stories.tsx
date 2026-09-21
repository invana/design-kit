import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';

const meta: Meta = {
  title: 'UI/UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


// ===== BASIC ACCORDION EXAMPLES =====

/**
 * Basic single accordion.
 * Only one item can be open at a time (default behavior).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const SettingsPanel: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="account">
        <AccordionTrigger>Account Settings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div>
              <label className="text-base font-medium">Email Address</label>
              <input type="email" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="user@example.com" />
            </div>
            <div>
              <label className="text-base font-medium">Username</label>
              <input type="text" className="w-full mt-1 px-3 py-2 border rounded-md" defaultValue="johndoe" />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-base">Save Changes</button>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="notifications">
        <AccordionTrigger>Notification Preferences</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-base">Email notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-base">Push notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-base">SMS notifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-base">Weekly digest</span>
            </label>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="privacy">
        <AccordionTrigger>Privacy & Security</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-base">Make profile public</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-base">Two-factor authentication</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-base">Share activity status</span>
            </label>
            <button className="text-base text-destructive hover:underline">Delete Account</button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Documentation/Help Section.
 * Use for organizing documentation or help content.
 */
