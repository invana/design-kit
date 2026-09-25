import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavItems } from '@invana/ui';
import { Activity, LayoutDashboard, Network, Pencil, X } from 'lucide-react';

/**
 * `NavItems` as a **folder strip whose tabs close** — `onClose` draws an `×`
 * inside the item. The body still selects; only the `×` closes.
 *
 * A strip can mix the two affordances: a page with things to manage keeps its
 * caret menu, and a page with nothing to manage but its own closing carries
 * the `×` instead, on every tab rather than only the active one.
 */
const meta: Meta<typeof NavItems> = {
  title: 'UI/UI Extended/NavBase',
  component: NavItems,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PAGES = [
  { key: 'graph', name: 'Graph', icon: Network, kind: 'fixed' },
  { key: 'canvas', name: 'Canvas 1', icon: Network, kind: 'menu' },
  { key: 'run', name: 'Run #42', icon: Activity, kind: 'close' },
  { key: 'rule', name: 'Rule — fuel reserve', icon: LayoutDashboard, kind: 'close' },
] as const;

export const ClosableTabs: Story = {
  name: 'Closable tabs',
  render: () => {
    const [open, setOpen] = React.useState<string[]>(PAGES.map((p) => p.key));
    const [active, setActive] = React.useState('run');

    const close = (key: string): void => {
      setOpen((keys) => keys.filter((k) => k !== key));
      if (key === active) setActive('graph');
    };

    const items = PAGES.filter((p) => open.includes(p.key)).map((p) => ({
      key: p.key,
      name: p.name,
      label: p.name,
      icon: p.icon,
      labelClassName: 'max-w-[16ch] truncate',
      menuTrigger: 'caret' as const,
      menuItems:
        p.kind === 'menu' && p.key === active
          ? [
              { id: 'rename', label: 'Rename', icon: Pencil },
              { id: 'close', label: 'Close', icon: X, destructive: true, separatorBefore: true, onSelect: () => close(p.key) },
            ]
          : undefined,
      onClose: p.kind === 'close' ? () => close(p.key) : undefined,
    }));

    return (
      <div className="flex h-[30px] w-[640px] items-stretch border-b bg-card">
        <NavItems
          items={items}
          variant="folder"
          selectionMode="tabs"
          activeKey={active}
          onActiveChange={setActive}
          overflow
          className="min-w-0 flex-1 gap-0"
          iconClassName="h-3.5 w-3.5 shrink-0"
        />
      </div>
    );
  },
};
