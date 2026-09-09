import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';
import { ChevronsRight } from 'lucide-react';

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
 * There is no close prop: closing is a header action, so its glyph is just the
 * item's `icon`. A drawer that slides away rather than closing reads better
 * with a directional one — and it keeps the same hit area, hover ring and
 * tooltip as any other action.
 */
export const CustomCloseIcon: Story = {
  render: () => (
    <div className="h-[240px] w-[340px] rounded-md border">
      <PanelContent
        titleText="Inspector"
        headerActions={[
          { name: 'Hide panel', icon: ChevronsRight, onClick: () => {} },
        ]}
      >
        <p className="text-muted-foreground">
          The item's `name` is what the tooltip and assistive tech read, so the
          affordance says what it does rather than being named for its shape.
        </p>
      </PanelContent>
    </div>
  ),
};
