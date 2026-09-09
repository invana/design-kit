import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppLayoutV2, type AppLayoutV2Props } from '@invana/themes/app-v2/layout';
import { ThemeProvider, ThemeSelector } from '@invana/themes';
import {
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ContextBar,
  Kbd,
  Legend,
  LegendItem,
  PanelStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PropertyList,
  PropertyRow,
  ScrollArea,
  SearchInput,
  Separator,
  StatusDot,
  TabbedPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@invana/ui';
import {
  Activity,
  Bot,
  Compass,
  Crosshair,
  Database,
  Eye,
  EyeOff,
  FolderOpen,
  HelpCircle,
  History,
  Info,
  Layers,
  Link2,
  ListChecks,
  ListTree,
  Locate,
  Magnet,
  Maximize2,
  Monitor,
  Moon,
  Network,
  Paintbrush,
  Palette,
  PanelBottomClose,
  PanelBottomOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Table2,
  Terminal,
  Wand2,
  Workflow,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof AppLayoutV2> = {
  title: 'Themes/AppV2',
  component: AppLayoutV2,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ── The graph this artboard is drawing ───────────────────────────────────────
//
// Counts are graph-wide; hiding a type on the canvas does not move them
// (selection-and-the-panel.md SP6/SP7), which is why the eye and the number
// are independent here too.

const NODE_TYPES = [
  { name: 'Stock', color: 'var(--color-data-1)', count: 512 },
  { name: 'Article', color: 'var(--color-data-2)', count: 21390 },
  { name: 'Observation', color: 'var(--color-data-3)', count: 1912 },
  { name: 'Learning', color: 'var(--color-data-4)', count: 640 },
  { name: 'Pattern', color: 'var(--color-data-5)', count: 9 },
  { name: 'Filing', color: 'var(--color-data-6)', count: null },
];

const EDGE_TYPES = [
  { name: 'MENTIONS', color: 'var(--color-data-2)', count: 48210 },
  { name: 'SUPPORTS', color: 'var(--color-data-3)', count: 2104 },
  { name: 'DERIVED_FROM', color: 'var(--color-data-4)', count: 913 },
  { name: 'CONTRADICTS', color: 'var(--color-data-5)', count: 61 },
];

const RESULT_ROWS = [
  ['obs_20260908_bpcl_01', 'Observation', 'thesis', '0.72'],
  ['obs_20260908_bpcl_02', 'Observation', 'volume', '0.64'],
  ['art_20260908_reuters_11', 'Article', 'defence order book', '—'],
  ['stk_BPCL', 'Stock', 'BPCL', '—'],
];

// ── Small shared pieces ──────────────────────────────────────────────────────

/** A type row: the canvas legend and the list are the same act of reading. */
// A PanelStack section title with a readout pinned to the right. `title` takes
// any node, and a count that must always be legible belongs there rather than
// in `headerActions`, which only appears on hover.
function SectionTitle({
  children,
  meta,
}: {
  children: string;
  meta?: React.ReactNode;
}) {
  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-2">
      <span className="truncate text-meta font-semibold uppercase tracking-wide">
        {children}
      </span>
      {meta != null && (
        <span className="shrink-0 text-meta text-muted-foreground">{meta}</span>
      )}
    </span>
  );
}

function TypeRow({
  name,
  color,
  count,
  mono,
  hidden,
  onToggle,
}: {
  name: string;
  color: string;
  count: number | null;
  mono?: boolean;
  hidden?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex h-[30px] items-center gap-2 px-3 hover:bg-primary/5',
        hidden && 'text-muted-foreground',
      )}
    >
      <span
        aria-hidden
        style={{ color }}
        className={cn('size-2 shrink-0 rounded-full bg-current', hidden && 'opacity-40')}
      />
      <span className={cn('truncate', mono && 'font-mono text-meta')}>{name}</span>
      <span className="ml-auto flex items-center gap-2 text-meta text-muted-foreground tabular-nums">
        {/* A vendor that cannot count still names its types — a dash, never a
            made-up zero (SP8). */}
        {count === null ? '—' : count.toLocaleString()}
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={hidden ? `Show ${name} on this canvas` : `Hide ${name} on this canvas`}
            className="text-muted-foreground hover:text-foreground"
          >
            {hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
        ) : null}
      </span>
    </div>
  );
}

const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };

/**
 * The header theme picker, as Studio ships it: one icon button opening the full
 * `ThemeSelector` — theme cards and light/dark/system. Accent is off here
 * because Studio's canvas palette is a separate decision from the app accent.
 *
 * It drives the surrounding `ThemeProvider`, which is why this story opts out of
 * Storybook's global theme decorator (`selfThemed`) — two things applying a
 * theme to `<html>` would fight, and the one in the header would lose.
 */
function ThemeMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" title="Theme & appearance">
          <Palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <ThemeSelector layout="form" showAccent={false} modeIcons={MODE_ICONS} />
      </PopoverContent>
    </Popover>
  );
}

/**
 * The Explorer, as Studio ships it — the whole shell on `AppLayoutV2`.
 *
 * Header · rail · left panel · canvas · right inspector · bottom console ·
 * status bar, composed only from `@invana/*`. It is the acceptance test for the
 * kit: anything the screen needs that the kit lacks shows up here as a gap,
 * never as a workaround.
 *
 * **All three side regions collapse.** Each is `collapsible` (drag its divider
 * to the edge) *and* has an explicit control: the left panel's own
 * collapse icon, the canvas strip's inspector and console toggles, and the rail
 * icons, which reopen whichever panel they name.
 *
 * The bottom console is the one region Studio's Explorer does not ship today —
 * it is drawn here because the shell supports it and a results drawer is where
 * it would go.
 */
function ExplorerShellDemo() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(true);
  const [rail, setRail] = useState('explorer');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState<string[]>(['Filing']);
  const [activeCanvas, setActiveCanvas] = useState('defence');

  const isHidden = (name: string) => hidden.includes(name);
  const toggleHidden = (name: string) =>
    setHidden((h) => (h.includes(name) ? h.filter((n) => n !== name) : [...h, name]));

  const q = search.trim().toLowerCase();
  const matches = (name: string) => !q || name.toLowerCase().includes(q);
  const shown = NODE_TYPES.length - hidden.length;

  // One rail, one page. Every icon is a toggle onto the single left column, so
  // exactly one is ever lit — the highlight is driven from app state, not from
  // NavVertical's own last-clicked memory.
  const railItem = (key: string, name: string, icon: typeof Compass, badge?: number) => ({
    key,
    name,
    icon,
    badge,
    iconClassName: 'w-5 h-5',
    tooltipSide: 'right' as const,
    className: cn(
      'my-1.5',
      rail === key
        ? '!bg-primary/15 !text-primary !ring-primary/25'
        : '!bg-transparent !text-foreground !ring-transparent hover:!bg-primary/10 hover:!text-primary hover:!ring-primary/25',
    ),
    onClick: () => {
      setRail(key);
      setLeftOpen(true);
    },
  });

  const layout: AppLayoutV2Props = {
    header: {
      className: '!h-[38px]',
      // Brand, then the trail, in the header's `left` slot. The trail is a real
      // Breadcrumb — it carries no nav state (no active latch, no tooltips), so
      // it belongs to the breadcrumb primitive rather than to `leftNavItems`.
      left: (
        <div className="flex items-center gap-1">
          <span className="select-none px-2 text-xl font-bold">Invana Studio</span>
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb className="px-1.5">
            <BreadcrumbList className="gap-1.5 font-bold text-foreground sm:gap-1.5">
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="hover:text-primary">
                  ravi-merugu
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="hover:text-primary">
                  stock-market-graph
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-muted-foreground" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-bold">Explorer</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ),
      // The canvas toolbar reads the live camera, so it sits in the app header,
      // directly above the canvas tabs. The nav centres its middle section, so
      // the toolbar needs no positioning of its own.
      centerNavItems: [
        { name: 'Zoom out', icon: ZoomOut, iconClassName: 'size-4', onClick: () => {}, className: '!px-1.5' },
        {
          name: 'Zoom level',
          label: <span className="w-10 text-center tabular-nums text-muted-foreground">92%</span>,
          className: '!px-0',
        },
        { name: 'Zoom in', icon: ZoomIn, iconClassName: 'size-4', onClick: () => {}, className: '!px-1.5', showSeperator: true },
        { name: 'Fit to view', icon: Maximize2, iconClassName: 'size-4', onClick: () => {}, className: '!px-1.5' },
        { name: 'Centre on selection', icon: Locate, iconClassName: 'size-4', onClick: () => {}, className: '!px-1.5' },
        { name: 'Magnet', icon: Magnet, iconClassName: 'size-4', onClick: () => {}, className: '!px-1.5' },
      ],
      rightNavItems: [
        {
          name: 'Nodes in view',
          label: <span className="tabular-nums text-muted-foreground">1.2k</span>,
          className: '!px-1.5',
        },
        // The theme picker opens a whole `ThemeSelector` card, not a row list,
        // so it rides in as the item's label rather than as `menuItems`.
        { name: 'Theme & appearance', label: <ThemeMenu />, className: '!p-0' },
        // One assistant, reachable from every surface (AD1).
        {
          name: 'Assistant',
          label: 'Assistant',
          icon: Sparkles,
          iconClassName: 'size-4',
          onClick: () => {},
          className: '!bg-primary/10 !text-primary !px-2 !py-1 hover:!bg-primary/15',
        },
      ],
    },

    leftNav: {
      topNavItems: [
        railItem('explorer', 'Explorer', Compass),
        railItem('model', 'Model', ListTree),
        railItem('layers', 'Layers', Layers),
        railItem('links', 'Links', Link2),
        railItem('datasets', 'Datasets', Database),
        railItem('templates', 'Templates', Table2),
        railItem('projects', 'Projects', FolderOpen),
        railItem('tasks', 'Tasks', ListChecks, 7),
        railItem('agents', 'Agents', Bot),
        railItem('workflows', 'Workflows', Workflow),
      ],
      bottomNavItems: [
        railItem('info', 'Info', Info),
        railItem('llms', 'LLMs', Sparkles),
        railItem('skills', 'Skills', Wand2),
        railItem('events', 'Events', Activity),
        { ...railItem('settings', 'Settings', Settings), showSeperator: true },
      ],
      bottom: (
        <Avatar className="size-7">
          <AvatarFallback>RM</AvatarFallback>
        </Avatar>
      ),
    },

    // ── Left: the Explorer's own panel ──────────────────────────────────────
    // Node types · Relationships · Selected, each collapsing and resizing on its
    // own — the column is the canvas's legend as much as it is a list.
    leftSection: leftOpen
      ? {
          defaultSize: '300px',
          minSize: '240px',
          maxSize: '900px',
          collapsible: true,
          content: (
            <TabbedPanel
              className="border-0"
              bodyClassName="p-0"
              tabs={[
                {
                  value: 'explorer',
                  label: 'Explorer',
                  icon: Compass,
                  content: (
                    <div className="flex h-full min-h-0 flex-col">
                      {searchOpen ? (
                        <div className="border-b p-1.5">
                          <SearchInput
                            inputSize="sm"
                            value={search}
                            onChange={setSearch}
                            placeholder="Search types"
                          />
                        </div>
                      ) : null}
                      <div className="min-h-0 flex-1">
                        <PanelStack
                          withHandle
                          sections={[
                            {
                              id: 'node-types',
                              title: (
                                <SectionTitle
                                  meta={
                                    hidden.length > 0
                                      ? `${shown} shown · ${hidden.length} hidden`
                                      : shown
                                  }
                                >
                                  Node types
                                </SectionTitle>
                              ),
                              content: (
                                <ScrollArea className="h-full">
                                  {NODE_TYPES.filter((t) => matches(t.name)).map((t) => (
                                    <TypeRow
                                      key={t.name}
                                      {...t}
                                      hidden={isHidden(t.name)}
                                      onToggle={() => toggleHidden(t.name)}
                                    />
                                  ))}
                                </ScrollArea>
                              ),
                            },
                            {
                              id: 'relationships',
                              title: (
                                <SectionTitle
                                  meta={
                                    <span className="tabular-nums">
                                      {EDGE_TYPES.length}
                                    </span>
                                  }
                                >
                                  Relationships
                                </SectionTitle>
                              ),
                              content: (
                                <ScrollArea className="h-full">
                                  {EDGE_TYPES.filter((t) => matches(t.name)).map((t) => (
                                    <TypeRow key={t.name} {...t} mono />
                                  ))}
                                </ScrollArea>
                              ),
                            },
                            {
                              id: 'selected',
                              title: (
                                <SectionTitle meta="Observation">
                                  Selected
                                </SectionTitle>
                              ),
                              content: (
                                <ScrollArea className="h-full">
                                  <div className="flex flex-col gap-2 px-3 py-2">
                                    <div className="flex items-baseline gap-2">
                                      <span
                                        aria-hidden
                                        style={{ color: 'var(--color-data-3)' }}
                                        className="size-2 shrink-0 rounded-full bg-current"
                                      />
                                      <span className="truncate font-mono text-meta">
                                        obs_20260908_bpcl_01
                                      </span>
                                    </div>
                                    <PropertyList>
                                      <PropertyRow label="kind">thesis</PropertyRow>
                                      <PropertyRow label="direction">long</PropertyRow>
                                      <PropertyRow label="confidence">0.72</PropertyRow>
                                      <PropertyRow label="thinking" mono>
                                        7e21
                                      </PropertyRow>
                                    </PropertyList>
                                    <p className="text-meta text-muted-foreground">
                                      From dataset <span className="text-foreground">nse-daily</span> ·
                                      2026-09-08.csv
                                    </p>
                                  </div>
                                </ScrollArea>
                              ),
                            },
                          ]}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t px-3 py-1.5 text-meta text-muted-foreground">
                        <span className="tabular-nums">{shown} types · 24,463 nodes</span>
                        <span className="truncate">Defence theme — Sep 2026</span>
                      </div>
                    </div>
                  ),
                },
              ]}
              headerActions={[
                { key: 'refresh', name: 'Recount the graph', icon: RefreshCw, onClick: () => {} },
                {
                  key: 'search',
                  name: 'Search types',
                  icon: Search,
                  onClick: () => {
                    setSearchOpen((v) => !v);
                    setSearch('');
                  },
                },
                {
                  key: 'close',
                  name: 'Collapse panel',
                  icon: PanelLeftClose,
                  onClick: () => setLeftOpen(false),
                },
              ]}
            />
          ),
        }
      : undefined,

    // ── Main: the canvas tab strip, then the canvas ─────────────────────────
    mainSection: {
      defaultSize: '600px',
      minSize: '300px',
      content: (
        <div className="flex h-full min-h-0 w-full flex-col">
          <div className="h-[30px] shrink-0">
            <TabbedPanel
              activeTab={activeCanvas}
              onTabChange={setActiveCanvas}
              // Header-only strip: the canvas stays mounted below as a sibling,
              // so switching tabs never remounts it.
              className="[&>div]:border-x-0 [&>div]:border-t-0"
              bodyClassName="hidden"
              tabs={[
                { value: 'defence', label: 'Defence theme — Sep 2026', content: null },
                { value: 'bpcl', label: 'BPCL today', content: null },
              ]}
              headerActions={[
                { key: 'new', name: 'New canvas', icon: Plus, onClick: () => {}, showSeperator: true },
                { key: 'help', name: 'What can I do here?', icon: HelpCircle, onClick: () => {} },
                { key: 'style', name: 'Styling', icon: SlidersHorizontal, onClick: () => {} },
                { key: 'history', name: 'History', icon: History, onClick: () => {} },
                { key: 'find', name: 'Find in canvas', icon: Crosshair, onClick: () => {}, showSeperator: true },
                {
                  key: 'left',
                  name: leftOpen ? 'Hide the Explorer panel' : 'Show the Explorer panel',
                  icon: leftOpen ? PanelLeftClose : PanelLeftOpen,
                  onClick: () => setLeftOpen((v) => !v),
                },
                {
                  key: 'bottom',
                  name: bottomOpen ? 'Hide the console' : 'Show the console',
                  icon: bottomOpen ? PanelBottomClose : PanelBottomOpen,
                  onClick: () => setBottomOpen((v) => !v),
                },
                {
                  key: 'inspector',
                  name: rightOpen ? 'Hide inspector panel' : 'Show inspector panel',
                  icon: rightOpen ? PanelRightClose : PanelRightOpen,
                  onClick: () => setRightOpen((v) => !v),
                },
              ]}
            />
          </div>

          {/* The canvas. A real one is @invana/canvas; here it is the ground the
              legend and the caption sit on. */}
          <div className="relative min-h-0 flex-1 bg-background">
            <div className="absolute bottom-2 left-2 border border-border bg-card p-2">
              <Legend>
                {NODE_TYPES.filter((t) => !isHidden(t.name)).map((t) => (
                  <LegendItem key={t.name} color={t.color} label={t.name} />
                ))}
              </Legend>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 border border-border bg-card px-2 py-1 text-meta text-muted-foreground">
              <StatusDot tone="success" /> obs_20260908_bpcl_01 · added from task Setup check BPCL
            </div>
          </div>
        </div>
      ),
    },

    // ── Right: the inspector ────────────────────────────────────────────────
    rightSection: rightOpen
      ? {
          defaultSize: '280px',
          minSize: '240px',
          maxSize: '360px',
          collapsible: true,
          content: (
            <TabbedPanel
              className="border-0"
              defaultTab="properties"
              tabs={[
                {
                  value: 'properties',
                  label: 'Properties',
                  icon: SlidersHorizontal,
                  content: (
                    <ScrollArea className="h-full">
                      <div className="flex flex-col gap-4 p-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" size="xs">
                              vertex
                            </Badge>
                            <span className="font-semibold">Observation</span>
                          </div>
                          <p className="break-all font-mono text-meta text-muted-foreground">
                            obs_20260908_bpcl_01
                          </p>
                        </div>
                        {/* Where it came from, before what it says — a value you
                            cannot trace is a value you cannot use (IW1). */}
                        <div className="flex flex-col gap-1">
                          <p className="text-meta text-muted-foreground">From</p>
                          <PropertyList>
                            <PropertyRow label="dataset">nse-daily</PropertyRow>
                            <PropertyRow label="file" mono>
                              2026-09-08.csv
                            </PropertyRow>
                            <PropertyRow label="row" mono>
                              1184
                            </PropertyRow>
                          </PropertyList>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-meta text-muted-foreground">Properties</p>
                          <PropertyList>
                            <PropertyRow label="kind">thesis</PropertyRow>
                            <PropertyRow label="direction">long</PropertyRow>
                            <PropertyRow label="horizon">intraday</PropertyRow>
                            <PropertyRow label="confidence">0.72</PropertyRow>
                            <PropertyRow label="thinking" mono>
                              7e21
                            </PropertyRow>
                          </PropertyList>
                        </div>
                      </div>
                    </ScrollArea>
                  ),
                },
                {
                  value: 'design',
                  label: 'Design',
                  icon: Paintbrush,
                  content: (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Paintbrush className="size-8 opacity-20" />
                      <p className="text-center text-meta">Style overrides — coming soon</p>
                    </div>
                  ),
                },
              ]}
              headerActions={[
                {
                  key: 'close',
                  name: 'Collapse panel',
                  icon: PanelRightClose,
                  onClick: () => setRightOpen(false),
                },
              ]}
            />
          ),
        }
      : undefined,

    // ── Bottom: the console ─────────────────────────────────────────────────
    // Spans the canvas only, so the panel and the inspector stay full height —
    // both describe the selection, which the console does not change.
    bottomSpan: 'main',
    bottomSection: bottomOpen
      ? {
          defaultSize: '220px',
          minSize: '120px',
          maxSize: '520px',
          collapsible: true,
          content: (
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1">
                <TabbedPanel
                  className="border-0"
                  defaultTab="records"
                  tabs={[
                    {
                      value: 'records',
                      label: 'Records',
                      icon: Network,
                      content: (
                        <ScrollArea className="h-full">
                          <Table density="compact">
                            <TableHeader>
                              <TableRow>
                                <TableHead>id</TableHead>
                                <TableHead>type</TableHead>
                                <TableHead>summary</TableHead>
                                <TableHead className="text-right">confidence</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {RESULT_ROWS.map(([id, type, summary, confidence]) => (
                                <TableRow key={id}>
                                  <TableCell className="font-mono text-meta">{id}</TableCell>
                                  <TableCell>{type}</TableCell>
                                  <TableCell className="text-muted-foreground">{summary}</TableCell>
                                  <TableCell className="text-right tabular-nums">{confidence}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      ),
                    },
                    {
                      value: 'query',
                      label: 'Query',
                      icon: Terminal,
                      content: (
                        <ScrollArea className="h-full">
                          <pre className="p-3 font-mono text-meta text-muted-foreground">
                            {'MATCH (s:Stock {ticker: "BPCL"})<-[:MENTIONS]-(a:Article)\nWHERE a.published_at > date("2026-09-01")\nRETURN a, s LIMIT 50'}
                          </pre>
                        </ScrollArea>
                      ),
                    },
                  ]}
                  headerActions={[
                    { key: 'rerun', name: 'Run again', icon: RefreshCw, onClick: () => {} },
                    {
                      key: 'close',
                      name: 'Collapse console',
                      icon: PanelBottomClose,
                      onClick: () => setBottomOpen(false),
                    },
                  ]}
                />
              </div>
              {/* Describes the surface in front of you and the shortcut that
                  finishes it — the session's own state is the status bar below. */}
              <ContextBar
                counters={
                  <>
                    <Badge variant="outline" size="xs" tone="success">
                      1 running
                    </Badge>
                    <span>26 nodes</span>
                    <span>41 edges</span>
                  </>
                }
                hint={
                  <>
                    <Kbd>⌘↵</Kbd> accept
                  </>
                }
              />
            </div>
          ),
        }
      : undefined,

    // The one footer: the session's state, and nothing that moves per route.
    // The bar IS the status bar — `AppStatusBar` is for surfaces that own their
    // own 25px strip, and nesting one inside this one would be two bars.
    footer: {
      className: '!h-[25px]',
      left: (
        <div className="flex items-center gap-3 px-2 text-meta text-muted-foreground">
          <span className="flex items-center gap-2">
            <StatusDot tone="success" />
            <span className="text-success">ACTIVE</span>
          </span>
          <span>•</span>
          <span className="tabular-nums">26 nodes · 41 edges · 60 fps</span>
        </div>
      ),
      right: (
        <div className="flex items-center gap-3 px-2 text-meta text-muted-foreground">
          <span>Explorer</span>
          <span>v0.9.0</span>
        </div>
      ),
    },

    mainClassName: 'h-[calc(100vh-63px)]',
  };

  return <AppLayoutV2 {...layout} />;
}

export const ExplorerShell: Story = {
  // Self-themed: the header's own picker owns the theme, so the global toolbar
  // decorator stands down. Switch the theme from inside the screen.
  parameters: { selfThemed: true },
  render: () => (
    // `storageKey={null}` keeps the picker from writing this story's choice into
    // the shared `invana-theme` key, where it would follow the reader into every
    // other story.
    <ThemeProvider defaultTheme="default" defaultMode="dark" storageKey={null}>
      <ExplorerShellDemo />
    </ThemeProvider>
  ),
};
