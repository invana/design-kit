import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';
import { RefreshCw, Pin, MoreHorizontal, X } from 'lucide-react';

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
 * `headerActions` is a list of `NavHorizontal` items — a panel header has one
 * action area, so it takes the items themselves rather than left/centre/right
 * slots. Give an item `menuItems` and it becomes a `…` overflow dropdown.
 * Closing is one of these items and nothing more — there is no close prop, so
 * a dismiss affordance is described exactly like a refresh or a pin.
 */
export const HeaderActions: Story = {
  render: () => (
    <div className="h-[260px] w-[380px] rounded-md border">
      <PanelContent
        titleText="Results"
        headerActions={[
          { name: 'Refresh', icon: RefreshCw, onClick: () => {} },
          { name: 'Pin panel', icon: Pin, onClick: () => {} },
          {
            name: 'More options',
            icon: MoreHorizontal,
            menuItems: [
              { id: 'export', label: 'Export as CSV', onSelect: () => {} },
              { id: 'copy', label: 'Copy as JSON', shortcut: '⌘C', onSelect: () => {} },
              { id: 'clear', label: 'Clear results', destructive: true, separatorBefore: true, onSelect: () => {} },
            ],
          },
          { name: 'Close panel', icon: X, onClick: () => {} },
        ]}
      >
        <p className="text-muted-foreground">
          Each action is a nav item: it carries its own tooltip, hover ring and
          keyboard focus, and the close button is simply the last of them.
        </p>
      </PanelContent>
    </div>
  ),
};
