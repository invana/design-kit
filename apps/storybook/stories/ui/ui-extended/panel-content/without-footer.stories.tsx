import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';
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
 * With no `footerContent`, the body takes the full remaining height — nothing
 * reserves space for a footer that isn't there.
 */
export const WithoutFooter: Story = {
  render: () => (
    <div className="h-[240px] w-[340px] rounded-md border">
      <PanelContent
        titleText="Notes"
        headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
      >
        <p className="text-muted-foreground">
          A panel without a footer. The body runs all the way to the bottom edge
          of the card.
        </p>
      </PanelContent>
    </div>
  ),
};
