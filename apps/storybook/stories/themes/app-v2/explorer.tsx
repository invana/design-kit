/**
 * Story-only state holder: the "Explorer shell" AppV2 cell — Studio's Explorer on `AppLayoutV2`.
 * Header · rail · left panel · canvas · right inspector · bottom console · status bar, composed
 * only from `@invana/*` and fed from `fixtures/themes/app-v2.json`. Anything the screen needs
 * that the kit lacks is listed as a gap rather than drawn by hand.
 *
 * All three side regions collapse: each is `collapsible` (drag its divider to the edge) and has
 * an explicit control — the left panel's collapse icon, the canvas strip's console and inspector
 * toggles, and the rail icons, which reopen the left panel.
 */
import * as React from 'react';
import { AppLayoutV2, type AppLayoutV2Props, type BottomSpan } from '@invana/themes/app-v2/layout';
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
  EmptyState,
  Eyebrow,
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
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
  SectionHeader,
  StatusDot,
  TabbedPanel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '@invana/ui';
import { Monitor, Moon, Sun } from 'lucide-react';

import { ICONS, footerProps, navItems, type FooterData, type NavItemData } from '../shell';
import type { V2Handlers } from './handlers';

interface TypeData {
  name: string;
  color: string;
  /** `null` when the vendor cannot count — a dash, never a made-up zero. */
  count: number | null;
}

interface Prop {
  label: string;
  value: string;
  mono?: boolean;
}

export interface ExplorerData {
  caption: string;
  kind: 'explorer';
  bottomSpan: BottomSpan;
  brand: string;
  trail: string[];
  tools: NavItemData[];
  readout: NavItemData;
  assistant: NavItemData;
  rail: { top: NavItemData[]; bottom: NavItemData[] };
  me: string;
  nodeTypes: TypeData[];
  edgeTypes: TypeData[];
  hidden: string[];
  selected: {
    id: string;
    type: string;
    badge: string;
    color: string;
    summary: Prop[];
    source: string;
    from: Prop[];
    properties: Prop[];
    design: string;
  };
  leftFooter: { counters: string; hint: string };
  canvases: { value: string; label: string }[];
  canvasActions: NavItemData[];
  canvasNote: string;
  records: { columns: string[]; rows: string[][] };
  query: string;
  console: { running: string; counters: string[]; kbd: string; hint: string };
  footer: FooterData;
}

const EyeOff = ICONS['eye-off'];
const MODE_ICONS = { light: Sun, dark: Moon, system: Monitor };
const count = (n: number | null) => (n === null ? '—' : n.toLocaleString());

function Props({ rows }: { rows: Prop[] }) {
  return (
    <PropertyList>
      {rows.map((r) => (
        <PropertyRow key={r.label} label={r.label} mono={r.mono}>
          {r.value}
        </PropertyRow>
      ))}
    </PropertyList>
  );
}

/**
 * The header theme picker, as Studio ships it: one icon button opening the full
 * `ThemeSelector`. Accent is off — Studio's canvas palette is a separate decision.
 */
function ThemeMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-xs" aria-label="Theme & appearance">
          <ICONS.palette />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <ThemeSelector layout="form" showAccent={false} modeIcons={MODE_ICONS} />
      </PopoverContent>
    </Popover>
  );
}

function ExplorerShellInner({ v, on }: { v: ExplorerData; on: V2Handlers }) {
  const [open, setOpen] = React.useState({ left: true, right: true, bottom: true });
  const [search, setSearch] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState<string[]>(v.hidden);
  const [canvas, setCanvas] = React.useState(v.canvases[0].value);

  const flip = (p: keyof typeof open, name: string) => {
    on.onClick(name);
    setOpen((o) => ({ ...o, [p]: !o[p] }));
  };
  const toggleHidden = (name: string) => {
    on.onClick(`${hidden.includes(name) ? 'Show' : 'Hide'} ${name}`);
    setHidden((h) => (h.includes(name) ? h.filter((n) => n !== name) : [...h, name]));
  };
  const q = search.trim().toLowerCase();
  const matches = (t: TypeData) => !q || t.name.toLowerCase().includes(q);
  const shown = v.nodeTypes.length - hidden.length;

  const typeList = (types: TypeData[], toggleable: boolean) => (
    <ScrollArea>
      <ItemGroup>
        {types.filter(matches).map((t) => (
          <Item key={t.name} size="sm">
            <ItemContent>
              <LegendItem color={t.color} label={t.name} count={count(t.count)} />
            </ItemContent>
            {toggleable ? (
              <ItemActions>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  aria-label={hidden.includes(t.name) ? `Show ${t.name} on this canvas` : `Hide ${t.name} on this canvas`}
                  onClick={() => toggleHidden(t.name)}
                >
                  {hidden.includes(t.name) ? <EyeOff /> : <ICONS.eye />}
                </Button>
              </ItemActions>
            ) : null}
          </Item>
        ))}
      </ItemGroup>
    </ScrollArea>
  );

  const s = v.selected;
  const layout: AppLayoutV2Props = {
    header: {
      leftNavItems: [{ name: v.brand, label: v.brand, showSeperator: true }],
      // The trail is a real Breadcrumb — it carries no nav state, so it is not nav items.
      center: (
        <Breadcrumb>
          <BreadcrumbList>
            {v.trail.map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 ? <BreadcrumbSeparator /> : null}
                <BreadcrumbItem>
                  {i === v.trail.length - 1 ? (
                    <BreadcrumbPage>{t}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="#" onClick={(e) => (e.preventDefault(), on.onClick(t))}>
                      {t}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ),
      // The canvas toolbar reads the live camera, so it sits in the header above the canvas.
      centerNavItems: navItems(v.tools, on.onClick),
      rightNavItems: [
        ...navItems([v.readout], on.onClick)!,
        // The theme picker opens a whole ThemeSelector, so it rides in as the item's label.
        { name: 'Theme & appearance', label: <ThemeMenu /> },
        ...navItems([v.assistant], on.onClick)!,
      ],
    },

    leftNav: {
      topNavItems: navItems(v.rail.top, (key) => (on.onClick(key), setOpen((o) => ({ ...o, left: true })))),
      bottomNavItems: navItems(v.rail.bottom, (key) => (on.onClick(key), setOpen((o) => ({ ...o, left: true })))),
      bottom: (
        <Avatar>
          <AvatarFallback>{v.me}</AvatarFallback>
        </Avatar>
      ),
    },

    // Left: node types · relationships · selected, each collapsing and resizing on its own.
    leftSection: open.left
      ? {
          defaultSize: '300px',
          minSize: '240px',
          maxSize: '900px',
          content: (
            <TabbedPanel
              tabs={[
                {
                  value: 'explorer',
                  label: 'Explorer',
                  icon: ICONS.compass,
                  content: (
                    <PanelStack
                      withHandle
                      sections={[
                        {
                          id: 'node-types',
                          title: (
                            <SectionHeader
                              bare
                              title="Node types"
                              count={hidden.length ? `${shown} shown · ${hidden.length} hidden` : shown}
                            />
                          ),
                          content: (
                            <>
                              {searchOpen ? (
                                <SearchInput inputSize="sm" value={search} onChange={(t) => (setSearch(t), on.onSearch(t))} placeholder="Search types" />
                              ) : null}
                              {typeList(v.nodeTypes, true)}
                            </>
                          ),
                        },
                        {
                          id: 'relationships',
                          title: <SectionHeader bare title="Relationships" count={v.edgeTypes.length} />,
                          content: typeList(v.edgeTypes, false),
                        },
                        {
                          id: 'selected',
                          title: <SectionHeader bare title="Selected" count={s.type} />,
                          content: (
                            <ScrollArea>
                              <Legend>
                                <LegendItem color={s.color} label={s.id} />
                              </Legend>
                              <Props rows={s.summary} />
                              <Typography.Muted>{s.source}</Typography.Muted>
                            </ScrollArea>
                          ),
                        },
                      ]}
                    />
                  ),
                },
              ]}
              headerActions={[
                { key: 'refresh', name: 'Recount the graph', icon: ICONS.refresh, onClick: () => on.onClick('Recount the graph') },
                {
                  key: 'search',
                  name: 'Search types',
                  icon: ICONS.search,
                  onClick: () => {
                    on.onClick('Search types');
                    setSearchOpen((o) => !o);
                    setSearch('');
                  },
                },
                { key: 'close', name: 'Collapse panel', icon: ICONS['panel-left-close'], onClick: () => flip('left', 'Collapse panel') },
              ]}
              footerContent={<ContextBar counters={`${shown} types · ${v.leftFooter.counters}`} hint={v.leftFooter.hint} />}
            />
          ),
        }
      : undefined,

    // Main: the canvas tabs, each drawing its canvas. A real one is @invana/canvas.
    mainSection: {
      minSize: '300px',
      content: (
        <TabbedPanel
          activeTab={canvas}
          onTabChange={(c) => (setCanvas(c), on.onTabChange(c))}
          tabs={v.canvases.map((c) => ({
            value: c.value,
            label: c.label,
            content: (
              <>
                <EmptyState title={c.label} description={v.canvasNote} icon={<StatusDot tone="success" />} />
                <Legend>
                  {v.nodeTypes
                    .filter((t) => !hidden.includes(t.name))
                    .map((t) => (
                      <LegendItem key={t.name} color={t.color} label={t.name} />
                    ))}
                </Legend>
              </>
            ),
          }))}
          headerActions={[
            ...navItems(v.canvasActions, on.onClick)!,
            {
              key: 'left',
              name: open.left ? 'Hide the Explorer panel' : 'Show the Explorer panel',
              icon: ICONS[open.left ? 'panel-left-close' : 'panel-left-open'],
              onClick: () => flip('left', open.left ? 'Hide the Explorer panel' : 'Show the Explorer panel'),
            },
            {
              key: 'bottom',
              name: open.bottom ? 'Hide the console' : 'Show the console',
              icon: ICONS[open.bottom ? 'panel-bottom-close' : 'panel-bottom-open'],
              onClick: () => flip('bottom', open.bottom ? 'Hide the console' : 'Show the console'),
            },
            {
              key: 'inspector',
              name: open.right ? 'Hide inspector panel' : 'Show inspector panel',
              icon: ICONS[open.right ? 'panel-right-close' : 'panel-right-open'],
              onClick: () => flip('right', open.right ? 'Hide inspector panel' : 'Show inspector panel'),
            },
          ]}
        />
      ),
    },

    // Right: the inspector — where it came from, before what it says.
    rightSection: open.right
      ? {
          defaultSize: '280px',
          minSize: '240px',
          maxSize: '360px',
          content: (
            <TabbedPanel
              defaultTab="properties"
              onTabChange={on.onTabChange}
              tabs={[
                {
                  value: 'properties',
                  label: 'Properties',
                  icon: ICONS.sliders,
                  content: (
                    <ScrollArea>
                      <SectionHeader bare title={s.type} icon={<Badge variant="outline">{s.badge}</Badge>} />
                      <Typography.Muted>{s.id}</Typography.Muted>
                      <Eyebrow>From</Eyebrow>
                      <Props rows={s.from} />
                      <Eyebrow>Properties</Eyebrow>
                      <Props rows={s.properties} />
                    </ScrollArea>
                  ),
                },
                {
                  value: 'design',
                  label: 'Design',
                  icon: ICONS.paintbrush,
                  content: <EmptyState icon={<ICONS.paintbrush />} title={s.design} />,
                },
              ]}
              headerActions={[
                { key: 'close', name: 'Collapse panel', icon: ICONS['panel-right-close'], onClick: () => flip('right', 'Collapse inspector') },
              ]}
            />
          ),
        }
      : undefined,

    // Bottom: the console. It spans the canvas only, so the panel and the inspector stay full height.
    bottomSpan: v.bottomSpan,
    bottomSection: open.bottom
      ? {
          defaultSize: '220px',
          minSize: '120px',
          maxSize: '520px',
          content: (
            <TabbedPanel
              defaultTab="records"
              onTabChange={on.onTabChange}
              tabs={[
                {
                  value: 'records',
                  label: 'Records',
                  icon: ICONS.network,
                  content: (
                    <Table density="compact" seamless>
                      <TableHeader>
                        <TableRow>
                          {v.records.columns.map((c) => (
                            <TableHead key={c}>{c}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {v.records.rows.map((r) => (
                          <TableRow key={r[0]} onClick={() => on.onSelect(r[0])}>
                            {r.map((cell, i) => (
                              <TableCell key={i}>{cell}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ),
                },
                {
                  value: 'query',
                  label: 'Query',
                  icon: ICONS.terminal,
                  content: (
                    <Typography.Pre>
                      <code>{v.query}</code>
                    </Typography.Pre>
                  ),
                },
              ]}
              headerActions={[
                { key: 'rerun', name: 'Run again', icon: ICONS.refresh, onClick: () => on.onClick('Run again') },
                { key: 'close', name: 'Collapse console', icon: ICONS['panel-bottom-close'], onClick: () => flip('bottom', 'Collapse console') },
              ]}
              // Describes the surface in front of you and the shortcut that finishes it.
              footerContent={
                <ContextBar
                  counters={
                    <>
                      <Badge variant="outline" size="xs" tone="success">
                        {v.console.running}
                      </Badge>
                      {v.console.counters.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </>
                  }
                  hint={
                    <>
                      <Kbd>{v.console.kbd}</Kbd> {v.console.hint}
                    </>
                  }
                />
              }
            />
          ),
        }
      : undefined,

    // The one footer: the session's state, nothing that moves per route.
    footer: footerProps(v.footer, on),
  };

  return <AppLayoutV2 {...layout} />;
}

/**
 * The header's picker drives this provider. `storageKey={null}` keeps the choice out of the
 * shared `invana-theme` key, so it does not follow the reader into other stories.
 */
export function ExplorerShell(props: { v: ExplorerData; on: V2Handlers }) {
  return (
    <ThemeProvider defaultTheme="default" defaultMode="dark" storageKey={null}>
      <ExplorerShellInner {...props} />
    </ThemeProvider>
  );
}
