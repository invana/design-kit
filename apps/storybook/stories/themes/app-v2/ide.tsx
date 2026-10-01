/**
 * Story-only state holder: the "Default" AppV2 cell — an IDE whose activity rail swaps the left
 * panel, whose menus toggle the side panels, and whose panels maximise and close. Everything it
 * draws is a kit component fed from `fixtures/themes/app-v2.json`.
 */
import * as React from 'react';
import { AppLayoutV2, type AppLayoutV2Props, type BottomSpan } from '@invana/themes/app-v2/layout';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  SearchInput,
  TabbedPanel,
  type NavItemConfig,
  type NavMenuItem,
} from '@invana/ui';

import { ICONS, footerProps, navItems, type FooterData, type NavItemData } from '../shell';
import { tabsOf, type Body, type TabData } from './body';
import type { V2Handlers } from './handlers';

interface MenuItemData {
  label: string;
  shortcut?: string;
  separatorBefore?: boolean;
  /** Which panel the item shows or hides. */
  toggle?: 'left' | 'bottom' | 'right';
}

export interface IdeData {
  caption: string;
  kind: 'ide';
  bottomSpan: BottomSpan;
  brand: string;
  menus: { name: string; items: MenuItemData[] }[];
  command: string;
  actions: NavItemData[];
  people: { name: string; avatar: string; initials: string }[];
  rail: { top: NavItemData[]; bottom: NavItemData[] };
  sidebars: Record<string, { label: string; icon: string; body: Body }>;
  sidebarActions: NavItemData[];
  editor: TabData[];
  bottom: { tabs: TabData[]; actions: NavItemData[] };
  right: { tabs: TabData[]; actions: NavItemData[] };
  footer: FooterData;
}

type Panel = 'left' | 'bottom' | 'right';

export function IdeShell({ v, on }: { v: IdeData; on: V2Handlers }) {
  const [shown, setShown] = React.useState<Record<Panel, boolean>>({ left: true, bottom: true, right: true });
  const [active, setActive] = React.useState(v.rail.top[0].name);
  const [maximized, setMaximized] = React.useState<Panel | null>(null);
  const [command, setCommand] = React.useState('');

  const toggle = (p: Panel) => setShown((s) => ({ ...s, [p]: !s[p] }));
  // The already-active icon with the sidebar open collapses it (VS Code behaviour).
  const openPanel = (name: string) => {
    on.onClick(name);
    if (shown.left && active === name) setShown((s) => ({ ...s, left: false }));
    else {
      setActive(name);
      setShown((s) => ({ ...s, left: true }));
    }
  };
  const close = (p: Panel) => {
    on.onClick(`Close ${p}`);
    setMaximized((m) => (m === p ? null : m));
    setShown((s) => ({ ...s, [p]: false }));
  };
  const maximize = (p: Panel) => {
    on.onClick(`${maximized === p ? 'Restore' : 'Maximize'} ${p}`);
    setMaximized((m) => (m === p ? null : p));
  };

  /** Maximise / restore, then close — the chrome every side panel carries. */
  const chrome = (p: Panel): NavItemConfig[] => [
    {
      name: maximized === p ? 'Restore Panel Size' : 'Maximize Panel',
      icon: ICONS[maximized === p ? 'minimize' : 'maximize'],
      onClick: () => maximize(p),
    },
    { name: 'Close Panel', icon: ICONS.close, onClick: () => close(p) },
  ];

  const menu = (items: MenuItemData[]): NavMenuItem[] =>
    items.map((i) => ({
      id: i.label,
      label: i.label,
      shortcut: i.shortcut,
      separatorBefore: i.separatorBefore,
      onSelect: () => {
        on.onClick(i.label);
        if (i.toggle) toggle(i.toggle);
      },
    }));

  const sidebar = v.sidebars[active] ?? v.sidebars[v.rail.top[0].name];
  const panels: Record<Panel, React.ReactNode> = {
    left: (
      <TabbedPanel
        tabs={tabsOf([{ value: active, label: sidebar.label, icon: sidebar.icon, body: sidebar.body }], on.onSelect)}
        activeTab={active}
        headerActions={[...navItems(v.sidebarActions, on.onClick)!, ...chrome('left')]}
      />
    ),
    bottom: (
      <TabbedPanel
        tabs={tabsOf(v.bottom.tabs, on.onSelect)}
        defaultTab={v.bottom.tabs[0].value}
        onTabChange={on.onTabChange}
        headerActions={[...navItems(v.bottom.actions, on.onClick)!, ...chrome('bottom')]}
      />
    ),
    right: (
      <TabbedPanel
        tabs={tabsOf(v.right.tabs, on.onSelect)}
        defaultTab={v.right.tabs[0].value}
        onTabChange={on.onTabChange}
        headerActions={[...navItems(v.right.actions, on.onClick)!, ...chrome('right')]}
      />
    ),
  };
  const editor = (
    <TabbedPanel tabs={tabsOf(v.editor, on.onSelect)} defaultTab={v.editor[0].value} onTabChange={on.onTabChange} />
  );
  const section = (p: Panel) => (maximized === null && shown[p] ? { content: panels[p] } : undefined);

  const layout: AppLayoutV2Props = {
    bottomSpan: v.bottomSpan,
    leftNav: {
      topNavItems: navItems(v.rail.top, openPanel),
      bottomNavItems: navItems(v.rail.bottom, openPanel),
    },
    header: {
      leftNavItems: [
        { name: 'Open menu', icon: ICONS.menu, menuItems: menu(v.menus[0].items) },
        { name: v.brand, label: v.brand, showSeperator: true },
        { name: 'Active panel', label: active, showSeperator: true },
        ...v.menus.map((m) => ({ name: m.name, label: m.name, menuItems: menu(m.items) })),
      ],
      center: <SearchInput value={command} onChange={(q) => (setCommand(q), on.onSearch(q))} placeholder={v.command} />,
      rightNavItems: navItems(v.actions, on.onClick),
      right: (
        <>
          {v.people.map((p, i) => (
            <Avatar key={i}>
              <AvatarImage src={p.avatar} alt={p.name} />
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
        </>
      ),
    },
    // A maximised panel takes over the main area and the others hide.
    leftSection: section('left'),
    mainSection: { content: maximized ? panels[maximized] : editor },
    bottomSection: section('bottom'),
    rightSection: section('right'),
    footer: footerProps(v.footer, on),
  };

  return <AppLayoutV2 {...layout} />;
}
