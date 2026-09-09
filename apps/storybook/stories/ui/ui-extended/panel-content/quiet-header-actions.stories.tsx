import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent } from '@invana/ui';
import { Filter, MoreHorizontal } from 'lucide-react';

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
 * `actionsOnHover` holds the actions at rest and reveals them on hover or
 * focus — VS Code's quiet view header, for a panel whose chrome would
 * otherwise compete with its content. They stay visible while an action holds
 * focus or its menu is open, so the keyboard path never disappears.
 *
 * Hover the header to reveal the filter and overflow actions.
 */
export const QuietHeaderActions: Story = {
  render: () => (
    <div className="h-[240px] w-[360px] rounded-md border">
      <PanelContent
        titleText="Timeline"
        actionsOnHover
        headerActions={[
          { name: 'Filter', icon: Filter, onClick: () => {} },
          {
            name: 'More options',
            icon: MoreHorizontal,
            menuItems: [
              { id: 'collapse', label: 'Collapse all', onSelect: () => {} },
              { id: 'settings', label: 'Timeline settings…', onSelect: () => {} },
            ],
          },
        ]}
      >
        <p className="text-muted-foreground">
          At rest the header is just a title. The actions fade in when the
          pointer enters it.
        </p>
      </PanelContent>
    </div>
  ),
};
