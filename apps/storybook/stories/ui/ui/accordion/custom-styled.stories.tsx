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

export const CustomStyled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[500px]">
      <AccordionItem value="item-1" className="border border-border rounded-lg mb-2 px-4">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <span>Custom Styled Item</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          This accordion item has custom styling with rounded borders and padding.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border border-border rounded-lg mb-2 px-4 bg-primary/5">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span>With Background Color</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          This item has a subtle background color to make it stand out.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border border-primary rounded-lg px-4">
        <AccordionTrigger className="hover:no-underline text-primary">
          <span className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <span>Highlighted Item</span>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          This item uses primary color styling to draw attention.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
