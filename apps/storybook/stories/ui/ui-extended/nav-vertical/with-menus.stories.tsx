import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Plus,
  Network,
  Table2,
  Database,
  Terminal,
  HelpCircle,
  User,
  FileCode,
  LayoutDashboard,
  Upload,
  BookOpen,
  MessageCircleQuestion,
  Keyboard,
  LogOut,
  UserCog,
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
 * The same `menuItems` in a 45px rail. A vertical nav opens its menus to the
 * **right** rather than downward, so the rail is never covered by its own
 * dropdown, and tooltips already sit on that side.
 *
 * Three rail items are menu triggers here: **New** at the top, and **Help**
 * and the account item at the bottom. Everything else is a plain rail button
 * whose active state is tracked by the nav.
 */
export const WithMenus: Story = {
  render: () => <WithMenusDemo />,
};

const WithMenusDemo = () => {
  const [created, setCreated] = useState<string | null>(null);

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <div className="h-full w-[45px] border-r bg-card text-card-foreground">
          <NavVertical
            topNavItems={[
              {
                name: 'New',
                icon: Plus,
                menuItems: [
                  {
                    id: 'query',
                    label: 'New query',
                    icon: FileCode,
                    shortcut: '⌘N',
                    onSelect: () => setCreated('query'),
                  },
                  {
                    id: 'dashboard',
                    label: 'New dashboard',
                    icon: LayoutDashboard,
                    onSelect: () => setCreated('dashboard'),
                  },
                  {
                    id: 'import',
                    label: 'Import dataset…',
                    icon: Upload,
                    separatorBefore: true,
                    onSelect: () => setCreated('import'),
                  },
                ],
                showSeperator: true,
              },
              { name: 'Graph', icon: Network, onClick: () => {} },
              { name: 'Tables', icon: Table2, onClick: () => {} },
              { name: 'Datasets', icon: Database, onClick: () => {} },
              { name: 'Console', icon: Terminal, onClick: () => {} },
            ]}
            bottomNavItems={[
              {
                name: 'Help',
                icon: HelpCircle,
                menuItems: [
                  { id: 'docs', label: 'Documentation', icon: BookOpen },
                  {
                    id: 'keys',
                    label: 'Keyboard shortcuts',
                    icon: Keyboard,
                    shortcut: '⌘K',
                  },
                  {
                    id: 'ask',
                    label: 'Ask the team',
                    icon: MessageCircleQuestion,
                    separatorBefore: true,
                  },
                ],
              },
              {
                name: 'Account',
                icon: User,
                menuItems: [
                  { id: 'profile', label: 'Profile', icon: UserCog },
                  {
                    id: 'signout',
                    label: 'Sign out',
                    icon: LogOut,
                    destructive: true,
                    separatorBefore: true,
                  },
                ],
              },
            ]}
          />
        </div>
        <div className="flex-1 p-6 text-meta text-muted-foreground">
          {created
            ? `Created: ${created}`
            : 'Open the + menu at the top of the rail.'}
        </div>
      </div>
    </TooltipProvider>
  );
};
