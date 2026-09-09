import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Inbox,
  GitPullRequest,
  MessageSquare,
  AlertTriangle,
  Filter,
  ArrowDownUp,
  CheckCheck,
  MoreHorizontal,
  Archive,
} from 'lucide-react';
import { NavHorizontal, TooltipProvider } from '@invana/ui';

const meta: Meta<typeof NavHorizontal> = {
  title: 'UI/UI Extended/NavHorizontal',
  component: NavHorizontal,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `badge` pins a count to an item's top-right — the one place in the kit where
 * a round capsule is right, because a count bubble is a round object. Keep it
 * to a bare number; anything longer belongs in the `tooltip`.
 *
 * This header mixes the three item kinds: labelled counts on the left, a
 * label-only static item (no `href`/`onClick`/`menuItems`, so it renders as
 * plain text with no hover affordance), `showSeperator` to group, and an
 * icon-only `…` menu on the right.
 */
export const WithBadges: Story = {
  render: () => (
    <TooltipProvider>
      <NavHorizontal
        className="h-12 rounded-md border bg-card px-3 text-card-foreground"
        leftNavItems={[
          {
            name: 'Inbox',
            label: 'Inbox',
            icon: Inbox,
            badge: 12,
            onClick: () => {},
          },
          {
            name: 'Pull requests',
            label: 'Reviews',
            icon: GitPullRequest,
            badge: 4,
            onClick: () => {},
          },
          {
            name: 'Discussions',
            label: 'Discussions',
            icon: MessageSquare,
            onClick: () => {},
            showSeperator: true,
          },
          {
            name: 'Failing checks',
            label: 'Checks',
            icon: AlertTriangle,
            badge: 2,
            tooltip: '2 checks failing on main',
            onClick: () => {},
          },
        ]}
        // Static: no href, onClick or menuItems — plain text, no hover state.
        center={
          <span className="text-meta text-muted-foreground">
            Synced 2 minutes ago
          </span>
        }
        rightNavItems={[
          { name: 'Filter', icon: Filter, onClick: () => {} },
          { name: 'Sort', icon: ArrowDownUp, onClick: () => {} },
          {
            name: 'More options',
            icon: MoreHorizontal,
            menuItems: [
              { id: 'read', label: 'Mark all as read', icon: CheckCheck },
              { id: 'archive', label: 'Archive read items', icon: Archive },
            ],
          },
        ]}
      />
    </TooltipProvider>
  ),
};
