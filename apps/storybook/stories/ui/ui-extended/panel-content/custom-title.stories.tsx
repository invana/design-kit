import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent, Badge } from '@invana/ui';
import { Database, X } from 'lucide-react';

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
 * `title` takes any node, so a header can carry an icon, a count, or a status
 * alongside the name. Use `titleText` when plain text is all you need.
 */
export const CustomTitle: Story = {
  render: () => (
    <div className="h-[260px] w-[380px] rounded-md border">
      <PanelContent
        title={
          <span className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-muted-foreground" />
            Connections
            <Badge variant="secondary" size="xs">3</Badge>
          </span>
        }
        headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
      >
        <p className="text-muted-foreground">
          The title node is rendered as-is — the panel forces no typography on it
          beyond the header's own alignment.
        </p>
      </PanelContent>
    </div>
  ),
};
