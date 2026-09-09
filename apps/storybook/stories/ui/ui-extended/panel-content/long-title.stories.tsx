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
 * A title longer than the header truncates instead of pushing the close button
 * out of the panel or growing the header past its fixed height.
 */
export const LongTitle: Story = {
  render: () => (
    <div className="h-[200px] w-[280px] rounded-md border">
      <PanelContent
        titleText="Customer lifetime value by acquisition cohort"
        headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
      >
        <p className="text-muted-foreground">
          The close button holds its place at the right edge of the header.
        </p>
      </PanelContent>
    </div>
  ),
};
