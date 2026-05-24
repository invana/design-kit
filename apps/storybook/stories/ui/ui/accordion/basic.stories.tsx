import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';

const meta: Meta<typeof Accordion> = {
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

export const Basic: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is this component?</AccordionTrigger>
        <AccordionContent>
          This is an accordion component built with Radix UI. It allows you to show and hide content in collapsible sections.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I use it?</AccordionTrigger>
        <AccordionContent>
          Simply import the Accordion, AccordionItem, AccordionTrigger, and AccordionContent components and compose them together.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes! It's built with Radix UI primitives, which follow WAI-ARIA design patterns for accessibility.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Multiple items open at once.
 * Set type="multiple" to allow multiple accordion items to be open simultaneously.
 */
