import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from '@invana/ui';

const meta: Meta<typeof Accordion> = {
  title: 'UI/UI/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A settings group with a field count and a saved state.
 *
 * No new API was needed: `AccordionTrigger` is `justify-between` with the
 * chevron last, so a flex span of children lands on the left and stays there.
 * Worth a story precisely so the next person does not add a `count` prop.
 */
export const SectionCounts: Story = {
  render: () => (
    <div className="w-[480px] border border-border bg-card px-3">
      <Accordion type="single" collapsible defaultValue="connection">
        <AccordionItem value="info">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Info
              <Badge variant="outline" size="xs" tone="muted">3</Badge>
              <Badge variant="soft" size="xs" tone="success">saved</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>Name, owner and description.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="connection">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Connection
              <Badge variant="outline" size="xs" tone="muted">5</Badge>
              <Badge variant="soft" size="xs" tone="success">tested</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>Connector, URI, database, credentials.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
