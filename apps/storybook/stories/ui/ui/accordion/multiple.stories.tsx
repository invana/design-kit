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

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[450px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can multiple items be open?</AccordionTrigger>
        <AccordionContent>
          Yes! When you set type="multiple", users can expand multiple accordion items at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Try opening this one too</AccordionTrigger>
        <AccordionContent>
          Notice how both items can remain open. This is useful for comparing content or when users need to reference multiple sections.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>And this one as well</AccordionTrigger>
        <AccordionContent>
          All three items can be open at the same time with type="multiple".
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Default expanded item.
 * Set defaultValue to have an item open by default.
 */
