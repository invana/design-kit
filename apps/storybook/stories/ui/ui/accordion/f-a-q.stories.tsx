import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';

const meta = {
  title: 'UI/UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;


// ===== BASIC ACCORDION EXAMPLES =====

/**
 * Basic single accordion.
 * Only one item can be open at a time (default behavior).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[600px]">
      <AccordionItem value="shipping">
        <AccordionTrigger>What are the shipping options?</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2">We offer several shipping options:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Standard Shipping (5-7 business days) - Free</li>
            <li>Express Shipping (2-3 business days) - $9.99</li>
            <li>Overnight Shipping (1 business day) - $24.99</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          We accept returns within 30 days of purchase. Items must be unused and in original packaging. 
          Refunds are processed within 5-7 business days after we receive your return. 
          Original shipping costs are non-refundable.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="payment">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards (Visa, MasterCard, American Express, Discover), 
          PayPal, Apple Pay, Google Pay, and Shop Pay. We also offer buy now, pay later options through Affirm and Klarna.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty">
        <AccordionTrigger>Do you offer warranties?</AccordionTrigger>
        <AccordionContent>
          Yes! All products come with a 1-year manufacturer's warranty covering defects in materials and workmanship. 
          Extended warranty options are available at checkout for up to 3 additional years.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Product Specifications.
 * Use for displaying detailed product information.
 */
