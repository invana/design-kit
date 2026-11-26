import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AppLayoutV2 } from '@invana/themes/app-v2/layout';
import {
  ButtonWithTooltip,
  RichSelect,
  StatusDot,
  TreeView,
  TypographyMuted,
  type NavVerticalGroup,
  type TreeItem,
} from '@invana/ui';
import {
  ArrowRight,
  Circle,
  Compass,
  Database,
  Hexagon,
  Layers,
  Network,
  Plus,
  Settings,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { RAIL_TOGGLE } from '../../_story/rail-toggle';

const meta: Meta<typeof AppLayoutV2> = {
  title: 'Themes/AppV2/Views Column',
  component: AppLayoutV2,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof meta>;

const VIEW_GROUPS: NavVerticalGroup[] = [
  {
    items: [
      { key: 'global', name: 'Global model', icon: Network },
      { key: 'models', name: 'Models', icon: Layers, count: 4 },
      { key: 'stitches', name: 'Stitches', icon: Share2, count: 6 },
      { key: 'worlds', name: 'Worlds', icon: Compass, count: 4 },
      { key: 'guardrails', name: 'Guardrails', icon: ShieldCheck, count: 6 },
      { key: 'database', name: 'Database', icon: Database, count: '15 drift', countTone: 'warning' },
      { key: 'settings', name: 'Settings', icon: Settings },
    ],
  },
];

const GRAPHS = [
  { value: 'airways', label: 'airways', description: 'Neo4j' },
  { value: 'fraud', label: 'fraud', description: 'Memgraph' },
];

const node = <Circle className="size-3 shrink-0 text-data-blue" aria-hidden />;
const edge = <ArrowRight className="size-3 shrink-0 text-data-blue" aria-hidden />;

const MODEL_TREE: TreeItem[] = [
  {
    id: 'AirRoutes',
    label: 'AirRoutes',
    meta: 'v1 · v2 draft',
    metaTone: 'warning',
    group: 'airways · Neo4j',
    children: [
      {
        id: 'nodes',
        label: 'Node types',
        meta: 3,
        children: [
          { id: 'airport', label: 'airport', icon: node, meta: '3,504', tone: 'warning', title: '2 properties changed in the draft' },
          { id: 'country', label: 'country', icon: node, meta: '237' },
          { id: 'continent', label: 'continent', icon: node, meta: '7' },
        ],
      },
      {
        id: 'edges',
        label: 'Edge types',
        meta: 3,
        children: [
          { id: 'route', label: 'route · airport → airport', icon: edge, meta: '50,637', tone: 'warning', title: 'dist: int → float in the draft' },
          { id: 'contains', label: 'contains · continent → airport', icon: edge, meta: '7,008' },
        ],
      },
    ],
  },
  { id: 'NewsArticles', label: 'NewsArticles', meta: 'v1', group: 'airways · Neo4j', isExpanded: false, children: [] },
  { id: 'Twitter', label: 'Twitter', meta: 'v1', group: 'airways · Neo4j', isExpanded: false, children: [] },
];

const flat = (ids: string[]): TreeItem[] => ids.map((id) => ({ id, label: id }));

/** What each view's tree column holds; a view with none (Settings) has no tree column. */
const TREES: Record<string, { items: TreeItem[]; placeholder: string; activeId?: string } | undefined> = {
  global: { items: flat(['AirRoutes', 'NewsArticles', 'Twitter']), placeholder: 'Filter models', activeId: 'AirRoutes' },
  models: { items: MODEL_TREE, placeholder: 'Filter models and types', activeId: 'airport' },
  stitches: { items: flat(['airport ↔ news', 'country ↔ tweet']), placeholder: 'Filter stitches' },
  worlds: { items: flat(['Default', 'Auditors', 'Analysts', 'Fraud team']), placeholder: 'Filter worlds', activeId: 'Default' },
  guardrails: { items: flat(['All guardrails', 'Mask email', 'Keep salary in']), placeholder: 'Filter guardrails' },
  database: { items: flat(['2 properties changed', '13 unmodelled labels']), placeholder: 'Filter drift' },
  settings: undefined,
};

/**
 * One frame, one control. The views column holds the selection and whether it is open;
 * the tree column is the open view's tree. Folded, a click on a view opens
 * that same column beside the rail, and main gives way as it does when the rail is open.
 */
function Shell({ initiallyCollapsed }: { initiallyCollapsed: boolean }) {
  const [collapsed, setCollapsed] = React.useState(initiallyCollapsed);
  const [view, setView] = React.useState('models');
  const [graph, setGraph] = React.useState('airways');

  const groups = VIEW_GROUPS.map((g) => ({
    ...g,
    items: g.items.map((item) => ({ ...item, onClick: () => setView(item.key ?? item.name) })),
  }));
  const tree = TREES[view];

  return (
    <AppLayoutV2
      header={{
        className: '!h-[40px] px-2',
        left: <span className="px-2 font-semibold">Invana Model</span>,
      }}
      leftNav={{
        groups,
        activeKey: view,
        expanded: !collapsed,
        onExpandedChange: (open) => setCollapsed(!open),
        toggle: RAIL_TOGGLE,
        header: {
          title: 'Model',
          actions: (
            <ButtonWithTooltip tooltip="New model" variant="ghost" size="icon-sm" aria-label="New model">
              <Plus />
            </ButtonWithTooltip>
          ),
          below: (
            <RichSelect
              options={GRAPHS}
              value={graph}
              onChange={(v) => setGraph(v as string)}
              label="Graph"
              triggerIcon={Hexagon}
              triggerAriaLabel="Graph"
              className="w-full"
            />
          ),
        },
      }}
      leftSection={
        tree
          ? {
              defaultSize: '280px',
              content: (
                <TreeView
                  variant="column"
                  items={tree.items}
                  searchable
                  searchPlaceholder={tree.placeholder}
                  activeId={tree.activeId}
                  groupMeta={view === 'models' ? { 'airways · Neo4j': '3 models' } : undefined}
                />
              ),
            }
          : undefined
      }
      mainSection={{
        content: (
          <div className="p-4">
            <TypographyMuted>
              Open view: {view}. The views column is {collapsed ? 'folded to its rail' : 'open'}.
            </TypographyMuted>
          </div>
        ),
      }}
      footer={{
        className: '!h-[26px] px-3 text-sm text-muted-foreground',
        left: (
          <span className="flex items-center gap-1.5">
            <StatusDot tone="success" size="xs" />
            {graph} · healthy
          </span>
        ),
      }}
      mainClassName="h-[calc(100vh-66px)]"
    />
  );
}

/**
 * 1 · Open. A click on a view makes it the open one and swaps its tree in at once; there
 * is one highlight, held by the views column.
 */
export const Expanded: Story = {
  render: () => <Shell initiallyCollapsed={false} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('A view becomes the open one and its tree replaces the last', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Worlds/ }));
      await expect(canvas.getByText('Open view: worlds. The views column is open.')).toBeInTheDocument();
      await expect(canvas.getByText('Auditors')).toBeInTheDocument();
      await expect(canvas.queryByText('Node types')).not.toBeInTheDocument();
    });
    await step('The lit view again puts the tree away; a click on it shows it again', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Worlds/ }));
      await expect(canvas.queryByPlaceholderText('Filter worlds')).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /Worlds/ }));
      await expect(canvas.getByPlaceholderText('Filter worlds')).toBeInTheDocument();
    });
    await step('Global model and Models are two views, each with its own tree', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Global model/ }));
      await expect(canvas.getByPlaceholderText('Filter models')).toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: /^Models/ }));
      await expect(canvas.getByPlaceholderText('Filter models and types')).toBeInTheDocument();
    });
  },
};

/**
 * 2 · Folded. The rail is the compact form of the same control: a click on a view opens its
 * tree in the column beside the rail, and main gives way; Escape (or the lit view again) closes it.
 */
export const Collapsed: Story = {
  render: () => <Shell initiallyCollapsed />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Nothing is open until a view is clicked', async () => {
      await expect(canvas.queryByPlaceholderText('Filter worlds')).not.toBeInTheDocument();
      await expect(canvas.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    });
    await step('A click on a view shows its tree at once, without expanding the rail', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Worlds/ }));
      await expect(canvas.getByPlaceholderText('Filter worlds')).toBeInTheDocument();
      await expect(canvas.getByText('Open view: worlds. The views column is folded to its rail.')).toBeInTheDocument();
    });
    await step('Escape closes the column; the view stays selected', async () => {
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByPlaceholderText('Filter worlds')).not.toBeInTheDocument();
      await expect(canvas.getByText(/Open view: worlds/)).toBeInTheDocument();
    });
  },
};

/** 3 · Pinned. Expand on a folded rail with the tree open keeps that view's tree as the column. */
export const Pinned: Story = {
  render: () => <Shell initiallyCollapsed />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Guardrails/ }));
    await expect(canvas.getByPlaceholderText('Filter guardrails')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand' }));
    await expect(canvas.getByText('Open view: guardrails. The views column is open.')).toBeInTheDocument();
    await expect(canvas.getByPlaceholderText('Filter guardrails')).toBeInTheDocument();
  },
};

/** 4 · A view with no tree. Settings has none: the rail stays and no empty column opens. */
export const NoTree: Story = {
  render: () => <Shell initiallyCollapsed />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Settings/ }));
    await expect(canvas.getByText(/Open view: settings/)).toBeInTheDocument();
    await expect(canvas.queryByPlaceholderText(/^Filter/)).not.toBeInTheDocument();
  },
};
