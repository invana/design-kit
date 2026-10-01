/**
 * Story-only helpers for the app-shell stories (`Themes/AppBase`, `Themes/AppV1`, `Themes/AppV2`):
 * the icon names their JSON refers to, and the JSON → props mapping every shell shares. Not a
 * kit component — everything drawn here is a kit component fed from `fixtures/themes/*.json`.
 */
import * as React from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  EmptyState,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  MetricGrid,
  MetricTile,
  PanelBox,
  PanelContent,
  PropertyList,
  PropertyRow,
  SearchInput,
  StatusDot,
  Typography,
  type MetricTone,
  type NavHorizontalProps,
  type NavItemConfig,
  type NavVerticalProps,
} from '@invana/ui';
import {
  Activity,
  Compass,
  Crosshair,
  Database,
  Eye,
  EyeOff,
  Info,
  Link2,
  ListChecks,
  Locate,
  Magnet,
  Network,
  Paintbrush,
  PanelBottomClose,
  PanelBottomOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Palette,
  Table2,
  Workflow,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  AlertTriangle,
  Bell,
  Bot,
  Boxes,
  Bug,
  Camera,
  Code2,
  Copy,
  File,
  FileCode,
  FileText,
  Files,
  Filter,
  Folder,
  FolderOpen,
  GitBranch,
  HelpCircle,
  History,
  Home,
  Inbox,
  Layers,
  ListTree,
  LogOut,
  Maximize2,
  Menu,
  MessageSquare,
  Minimize2,
  Package,
  PanelRight,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sliders,
  Sparkles,
  Terminal,
  Trash2,
  User,
  Wand2,
  Wrench,
  X,
} from 'lucide-react';

/** A green dot as a nav item's icon — "all systems operational". */
const Operational = () => <StatusDot tone="success" />;

/** Icon names the JSON uses → the component. Icons stay in stories; packages take them as props. */
export const ICONS: Record<string, React.ElementType> = {
  alert: AlertCircle,
  warning: AlertTriangle,
  bell: Bell,
  bot: Bot,
  boxes: Boxes,
  bug: Bug,
  camera: Camera,
  code: Code2,
  copy: Copy,
  file: File,
  'file-code': FileCode,
  'file-text': FileText,
  files: Files,
  filter: Filter,
  folder: Folder,
  'folder-open': FolderOpen,
  'git-branch': GitBranch,
  help: HelpCircle,
  history: History,
  home: Home,
  inbox: Inbox,
  layers: Layers,
  'list-tree': ListTree,
  logout: LogOut,
  maximize: Maximize2,
  menu: Menu,
  message: MessageSquare,
  minimize: Minimize2,
  package: Package,
  'panel-right': PanelRight,
  plus: Plus,
  refresh: RefreshCw,
  search: Search,
  settings: Settings,
  sliders: Sliders,
  sparkles: Sparkles,
  terminal: Terminal,
  trash: Trash2,
  user: User,
  wand: Wand2,
  wrench: Wrench,
  close: X,
  operational: Operational,
  activity: Activity,
  compass: Compass,
  crosshair: Crosshair,
  database: Database,
  eye: Eye,
  'eye-off': EyeOff,
  info: Info,
  link: Link2,
  'list-checks': ListChecks,
  locate: Locate,
  magnet: Magnet,
  network: Network,
  paintbrush: Paintbrush,
  'panel-bottom-close': PanelBottomClose,
  'panel-bottom-open': PanelBottomOpen,
  'panel-left-close': PanelLeftClose,
  'panel-left-open': PanelLeftOpen,
  'panel-right-close': PanelRightClose,
  'panel-right-open': PanelRightOpen,
  palette: Palette,
  table: Table2,
  workflow: Workflow,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
};

/** A nav item as JSON: the icon is a name, the click is the story's. */
export interface NavItemData {
  name: string;
  key?: string;
  label?: string;
  icon?: string;
  tooltip?: string;
  badge?: number;
  showSeperator?: boolean;
  /** Static text (a status-bar readout) — no click. */
  static?: boolean;
}

/** JSON nav items → `NavItemConfig[]`; every click goes to `onClick` with the item's key or name. */
export function navItems(items: NavItemData[] | undefined, onClick: (name: string) => void): NavItemConfig[] | undefined {
  return items?.map((i) => ({
    key: i.key,
    name: i.name,
    label: i.label ?? (i.icon ? undefined : i.name),
    icon: i.icon ? ICONS[i.icon] : undefined,
    tooltip: i.tooltip,
    badge: i.badge,
    showSeperator: i.showSeperator,
    onClick: i.static ? undefined : () => onClick(i.key ?? i.name),
  }));
}

export interface HeaderData {
  brand: { name: string; mark?: string };
  search?: string;
  actions?: NavItemData[];
  user?: { name: string; avatar: string; initials: string; label?: boolean };
}

export interface ShellHandlers {
  /** A nav item, header action or page action was clicked — receives its name. */
  onClick: (name: string) => void;
  /** The header search changed — receives the text. */
  onSearch: (value: string) => void;
}

/** The header every dashboard shell shares: brand, search, actions, the signed-in user. */
export function headerProps(h: HeaderData, search: string, on: ShellHandlers): NavHorizontalProps {
  return {
    left: h.brand.mark ? (
      <Avatar>
        <AvatarFallback>{h.brand.mark}</AvatarFallback>
      </Avatar>
    ) : undefined,
    leftNavItems: [{ name: h.brand.name, label: h.brand.name }],
    center: h.search ? <SearchInput value={search} onChange={on.onSearch} placeholder={h.search} /> : undefined,
    rightNavItems: navItems(
      [
        ...(h.actions ?? []).map((a, i, all) => ({ ...a, showSeperator: a.showSeperator ?? (i === all.length - 1 && !!h.user) })),
        ...(h.user?.label ? [{ name: h.user.name, label: h.user.name }] : []),
      ],
      on.onClick,
    ),
    right: h.user ? (
      <Avatar>
        <AvatarImage src={h.user.avatar} alt={h.user.name} />
        <AvatarFallback>{h.user.initials}</AvatarFallback>
      </Avatar>
    ) : undefined,
  };
}

export interface FooterData {
  left?: NavItemData[];
  center?: NavItemData[];
  right?: NavItemData[];
}

/** A status bar as nav items only — readouts are static text, links answer `onClick`. */
export function footerProps(f: FooterData, on: ShellHandlers): NavHorizontalProps {
  const items = (list?: NavItemData[]) =>
    navItems(
      list?.map((i) => ({ ...i, static: i.static ?? true })),
      on.onClick,
    );
  return { leftNavItems: items(f.left), centerNavItems: items(f.center), rightNavItems: items(f.right) };
}

export interface PageData {
  title: string;
  subtitle?: string;
  actions?: NavItemData[];
  metrics: { label: string; value: string; caption?: string; tone?: MetricTone }[];
  panels: {
    title: string;
    activity?: { title: string; description?: string; when: string; avatar: string; initials: string }[];
    status?: { service: string; uptime: string }[];
  }[];
}

/** A dashboard page: titled panel, its actions, a band of figures, then its panels. */
export function DashboardPage({ page, on }: { page: PageData; on: ShellHandlers }) {
  return (
    <PanelContent title={page.title} headerActions={navItems(page.actions, on.onClick)}>
      {/* Kit gap: no vertical stack primitive — the one layout class this page sets. */}
      <div className="flex flex-col gap-4 pt-4">
        {page.subtitle ? <Typography.Muted>{page.subtitle}</Typography.Muted> : null}
        <MetricGrid>
          {page.metrics.map((m) => (
            <MetricTile key={m.label} label={m.label} value={m.value} caption={m.caption} captionTone={m.tone} />
          ))}
        </MetricGrid>
        {page.panels.map((p) => (
          <PanelBox key={p.title} title={p.title}>
            {p.activity ? (
              <ItemGroup>
                {p.activity.map((a) => (
                  <Item key={a.title} size="sm">
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={a.avatar} alt={a.title} />
                        <AvatarFallback>{a.initials}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{a.description ? `${a.title} ${a.description}` : a.title}</ItemTitle>
                      <ItemDescription>{a.when}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            ) : null}
            {p.status ? (
              <PropertyList>
                {p.status.map((s) => (
                  <PropertyRow key={s.service} label={s.service}>
                    <StatusDot tone="success" /> {s.uptime}
                  </PropertyRow>
                ))}
              </PropertyList>
            ) : null}
          </PanelBox>
        ))}
      </div>
    </PanelContent>
  );
}

/** A labelled region of a shell, so it's obvious which slot is which. */
export interface RegionData {
  label: string;
  hint?: string;
  /** The active `bottomSpan`, shown on the bottom region. */
  span?: string;
}

export function Region({ region }: { region: RegionData }) {
  return (
    <EmptyState
      title={region.label}
      description={region.span ? `bottomSpan="${region.span}" — ${region.hint ?? ''}` : region.hint}
    />
  );
}

/** JSON → the activity rail. */
export function railProps(
  nav: { top?: NavItemData[]; bottom?: NavItemData[] } | undefined,
  onClick: (name: string) => void,
): NavVerticalProps | undefined {
  if (!nav) return undefined;
  return { topNavItems: navItems(nav.top, onClick), bottomNavItems: navItems(nav.bottom, onClick) };
}
