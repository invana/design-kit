import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent, Button } from '@invana/ui';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A card-based panel shell with a titled header (optional close button),
 * a scrollable body, and an optional footer.
 */
export const Default: Story = {
  render: () => (
    <div className="h-[320px] w-[360px] rounded-md border">
      <PanelContent
        titleText="Panel title"
        showClose
        onClose={() => {}}
        footerContent={
          <div className="flex w-full justify-end gap-2">
            <Button variant="ghost" size="sm">Cancel</Button>
            <Button size="sm">Save</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          Panel body content goes here. The body scrolls independently while the
          header and footer stay fixed.
        </p>
      </PanelContent>
    </div>
  ),
};
