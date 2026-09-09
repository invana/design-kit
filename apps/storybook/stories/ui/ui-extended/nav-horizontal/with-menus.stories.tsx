import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronDown,
  Bell,
  Settings,
  User,
  Check,
  Plus,
  BellOff,
  Keyboard,
  Palette,
  RotateCcw,
  CreditCard,
  LogOut,
  UserCog,
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

const WORKSPACES = ['ravi-merugu', 'invana-labs', 'nse-research'];

/**
 * Any nav item can open a dropdown: give it `menuItems` and it becomes a menu
 * trigger — no `onClick` needed. It keeps its tooltip, and stays highlighted
 * while the menu is open.
 *
 * A menu row takes an `icon`, a `shortcut` hint, `disabled`, `destructive`
 * (the red delete/sign-out row) and `separatorBefore` to group rows apart.
 *
 * The header below is live: switching workspace moves the check, "Mark all
 * read" clears the bell's badge, and muting swaps the bell for a struck-through
 * one.
 */
export const WithMenus: Story = {
  render: () => <WithMenusDemo />,
};

const WithMenusDemo = () => {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [unread, setUnread] = useState(3);
  const [muted, setMuted] = useState(false);

  return (
    <TooltipProvider>
      <NavHorizontal
        className="h-12 rounded-md border bg-card px-3 text-card-foreground"
        left={<span className="mr-2 font-semibold">Invana</span>}
        leftNavItems={[
          {
            name: 'Switch workspace',
            label: workspace,
            icon: ChevronDown,
            iconClassName: 'w-3.5 h-3.5 order-last opacity-60',
            menuItems: [
              ...WORKSPACES.map((name) => ({
                id: name,
                label: name,
                icon: name === workspace ? Check : undefined,
                onSelect: () => setWorkspace(name),
              })),
              {
                id: 'new',
                label: 'New workspace…',
                icon: Plus,
                shortcut: '⌘⇧N',
                separatorBefore: true,
              },
            ],
          },
        ]}
        rightNavItems={[
          {
            name: muted ? 'Notifications muted' : 'Notifications',
            icon: muted ? BellOff : Bell,
            badge: !muted && unread > 0 ? unread : undefined,
            menuItems: [
              {
                id: 'read',
                label: 'Mark all as read',
                icon: Check,
                disabled: unread === 0,
                onSelect: () => setUnread(0),
              },
              {
                id: 'mute',
                label: muted ? 'Unmute notifications' : 'Mute for an hour',
                icon: muted ? Bell : BellOff,
                onSelect: () => setMuted((v) => !v),
              },
            ],
          },
          {
            name: 'Settings',
            icon: Settings,
            menuItems: [
              { id: 'appearance', label: 'Appearance', icon: Palette },
              {
                id: 'keys',
                label: 'Keyboard shortcuts',
                icon: Keyboard,
                shortcut: '⌘K',
              },
              {
                id: 'reset',
                label: 'Reset preferences',
                icon: RotateCcw,
                destructive: true,
                separatorBefore: true,
              },
            ],
          },
          {
            name: 'Account',
            icon: User,
            showSeperator: false,
            menuItems: [
              { id: 'profile', label: 'Profile', icon: UserCog },
              { id: 'billing', label: 'Billing', icon: CreditCard },
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
    </TooltipProvider>
  );
};
