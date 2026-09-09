import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Network,
  ListChecks,
  Bell,
  AlertTriangle,
  Settings,
  CheckCheck,
  BellOff,
} from 'lucide-react';
import { NavVertical, TooltipProvider } from '@invana/ui';

const meta: Meta<typeof NavVertical> = {
  title: 'UI/UI Extended/NavVertical',
  component: NavVertical,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Counts on a rail. `badge` sits at the item's top-right, and `tooltip`
 * overrides `name` when the number needs a sentence to explain it — the badge
 * text is inside the item, so it reads as part of the accessible name while
 * the tooltip carries the meaning.
 *
 * `middle` fills the flexible space between the top and bottom sections; here
 * it holds a live status dot, which is why the settings item still sits at the
 * bottom of a full-height rail.
 */
export const WithBadges: Story = {
  render: () => (
    <TooltipProvider>
      <div className="h-screen w-[45px] border-r bg-card text-card-foreground">
        <NavVertical
          topNavItems={[
            { name: 'Graph', icon: Network, onClick: () => {} },
            {
              name: 'Tasks',
              icon: ListChecks,
              badge: 7,
              tooltip: '7 tasks waiting on you',
              onClick: () => {},
            },
            {
              name: 'Notifications',
              icon: Bell,
              badge: 3,
              menuItems: [
                { id: 'read', label: 'Mark all as read', icon: CheckCheck },
                { id: 'mute', label: 'Mute for an hour', icon: BellOff },
              ],
            },
            {
              name: 'Alerts',
              icon: AlertTriangle,
              badge: 1,
              tooltip: '1 ingestion failed overnight',
              onClick: () => {},
              showSeperator: true,
            },
          ]}
          middle={
            <div className="flex h-full items-center justify-center">
              <span
                aria-hidden
                className="size-2 rounded-full bg-primary"
                title="Live"
              />
            </div>
          }
          bottomNavItems={[
            { name: 'Settings', icon: Settings, onClick: () => {} },
          ]}
        />
      </div>
    </TooltipProvider>
  ),
};
