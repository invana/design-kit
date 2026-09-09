import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent, Button } from '@invana/ui';
import { X } from 'lucide-react';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Each region takes its own classes: `className` for the card, plus
 * `headerClassName`, `bodyClassName` and `footerClassName`. Here the header is
 * a taller, tinted bar and the body drops its padding.
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="h-[280px] w-[360px] overflow-hidden rounded-md border">
      <PanelContent
        titleText="Preview"
        headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
        className="rounded-none"
        headerClassName="h-9 bg-muted/60 px-4"
        bodyClassName="p-0"
        footerClassName="justify-end gap-2 bg-muted/40 px-4 py-2"
        footerContent={
          <>
            <Button variant="ghost" size="sm">Reset</Button>
            <Button size="sm">Apply</Button>
          </>
        }
      >
        <div className="divide-y">
          {['Layout', 'Typography', 'Colour', 'Spacing'].map((section) => (
            <div key={section} className="px-4 py-2">
              {section}
            </div>
          ))}
        </div>
      </PanelContent>
    </div>
  ),
};
