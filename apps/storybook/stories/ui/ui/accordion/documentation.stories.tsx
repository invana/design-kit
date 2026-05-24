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

export const Documentation: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[700px]">
      <AccordionItem value="getting-started">
        <AccordionTrigger>Getting Started</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Welcome! Here's how to get started with our platform:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Create your account and verify your email</li>
              <li>Complete your profile with relevant information</li>
              <li>Explore the dashboard and familiarize yourself with the interface</li>
              <li>Check out the tutorials section for detailed guides</li>
              <li>Join our community forum to connect with other users</li>
            </ol>
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm"><strong>Pro Tip:</strong> Start with our interactive tutorial to learn the basics in just 5 minutes!</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="api">
        <AccordionTrigger>API Documentation</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p>Our REST API allows you to integrate our services into your applications.</p>
            <div className="mt-3 p-3 bg-muted rounded-md font-mono text-sm">
              <p className="mb-2"><strong>Base URL:</strong></p>
              <code>https://api.example.com/v1</code>
            </div>
            <div className="mt-3 p-3 bg-muted rounded-md font-mono text-sm">
              <p className="mb-2"><strong>Authentication:</strong></p>
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Visit our <a href="#" className="text-primary hover:underline">full API documentation</a> for detailed endpoint information.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="troubleshooting">
        <AccordionTrigger>Troubleshooting</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">Can't log in?</p>
              <p className="text-sm text-muted-foreground">Try resetting your password or clearing your browser cache.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Features not loading?</p>
              <p className="text-sm text-muted-foreground">Check your internet connection and try refreshing the page.</p>
            </div>
            <div>
              <p className="font-medium mb-1">Need more help?</p>
              <p className="text-sm text-muted-foreground">Contact our support team at support@example.com or use the chat widget.</p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Styled accordion with custom appearance.
 * Demonstrates customization possibilities.
 */
