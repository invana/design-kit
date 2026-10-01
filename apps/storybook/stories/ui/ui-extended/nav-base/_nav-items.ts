import type * as React from 'react';
import type { NavItemConfig, NavMenuItem } from '@invana/ui';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowDownUp,
  Bell,
  BellOff,
  BookOpen,
  Check,
  CheckCheck,
  ChevronDown,
  Copy,
  CreditCard,
  Database,
  Download,
  FileCode,
  FileJson,
  FileSpreadsheet,
  Filter,
  GitPullRequest,
  HelpCircle,
  History,
  Home,
  Inbox,
  Info,
  Keyboard,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  ListChecks,
  LogOut,
  MessageCircleQuestion,
  MessageSquare,
  MoreHorizontal,
  MousePointerClick,
  Network,
  Paintbrush,
  Palette,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Save,
  ScanSearch,
  Search,
  Settings,
  Share2,
  Table2,
  Terminal,
  Trash2,
  Upload,
  User,
  UserCog,
  Users,
  X,
} from 'lucide-react';

/**
 * Story data, not a kit export: the nav stories (`NavBase`, `NavHorizontal`, `NavVertical`)
 * keep their items in JSON and name each icon; this is the map from that name to the icon a
 * consumer would import, and the one place an item gets its callbacks.
 */
export const ICONS: Record<string, React.ElementType> = {
  activity: Activity,
  'alert-triangle': AlertTriangle,
  archive: Archive,
  'arrow-down-up': ArrowDownUp,
  bell: Bell,
  'bell-off': BellOff,
  'book-open': BookOpen,
  check: Check,
  'check-check': CheckCheck,
  'chevron-down': ChevronDown,
  copy: Copy,
  'credit-card': CreditCard,
  database: Database,
  download: Download,
  'file-code': FileCode,
  'file-json': FileJson,
  'file-spreadsheet': FileSpreadsheet,
  filter: Filter,
  'git-pull-request': GitPullRequest,
  'help-circle': HelpCircle,
  history: History,
  home: Home,
  inbox: Inbox,
  info: Info,
  keyboard: Keyboard,
  layers: Layers,
  'layout-dashboard': LayoutDashboard,
  'layout-grid': LayoutGrid,
  'list-checks': ListChecks,
  'log-out': LogOut,
  'message-circle-question': MessageCircleQuestion,
  'message-square': MessageSquare,
  'more-horizontal': MoreHorizontal,
  'mouse-pointer-click': MousePointerClick,
  network: Network,
  paintbrush: Paintbrush,
  palette: Palette,
  pencil: Pencil,
  play: Play,
  plus: Plus,
  'rotate-ccw': RotateCcw,
  save: Save,
  'scan-search': ScanSearch,
  search: Search,
  settings: Settings,
  'share-2': Share2,
  'table-2': Table2,
  terminal: Terminal,
  'trash-2': Trash2,
  upload: Upload,
  user: User,
  'user-cog': UserCog,
  users: Users,
  x: X,
};

/** A menu row as JSON holds it — `icon` is a name in {@link ICONS}. */
export interface MenuJson extends Omit<NavMenuItem, 'icon' | 'onSelect' | 'children'> {
  label: string;
  icon?: string;
  /** A submenu, as more rows. */
  children?: MenuJson[];
}

/**
 * A nav item as JSON holds it. `action: true` gives it an `onClick`; `closable: true` an
 * `onClose`. Anything else is the item's own prop.
 */
export interface NavJson extends Omit<NavItemConfig, 'icon' | 'menuItems' | 'onClick' | 'onClose'> {
  icon?: string;
  action?: boolean;
  closable?: boolean;
  menuItems?: MenuJson[];
}

export interface NavHandlers {
  onClick?: (name: string) => void;
  onSelect?: (item: string, id: string) => void;
  onClose?: (key: string) => void;
}

export const toMenu = (item: string, rows: MenuJson[] | undefined, on: NavHandlers): NavMenuItem[] | undefined =>
  rows?.map((m) => ({
    ...m,
    icon: m.icon ? ICONS[m.icon] : undefined,
    onSelect: () => on.onSelect?.(item, m.id),
    children: toMenu(item, m.children, on),
  }));

/** JSON items → `NavItemConfig[]`, every callback routed to `on`. */
export function toNavItems(items: NavJson[], on: NavHandlers): NavItemConfig[] {
  return items.map(({ icon, action, closable, menuItems, ...item }) => ({
    ...item,
    icon: icon ? ICONS[icon] : undefined,
    onClick: action ? () => on.onClick?.(item.name) : undefined,
    onClose: closable ? () => on.onClose?.(item.key ?? item.name) : undefined,
    menuItems: toMenu(item.name, menuItems, on),
  }));
}

/** The Code tab's line that turns JSON items into what the component takes. */
export const MAP_ITEMS = [
  '// Icons are named in the data; a consumer imports them from its own icon set.',
  'const toItems = (items) => items.map(({ icon, menuItems, ...i }) => ({',
  '  ...i,',
  '  icon: ICONS[icon],',
  '  onClick: () => onClick(i.name), // receives the item name',
  '  menuItems: menuItems?.map((m) => ({ ...m, icon: ICONS[m.icon], onSelect: () => onSelect(i.name, m.id) })),',
  '}));',
].join('\n');
