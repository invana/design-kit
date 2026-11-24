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
    ],
  },
];

const GRAPHS = [
  { value: 'airways', label: 'airways', description: 'Neo4j' },
  { value: 'fraud', label: 'fraud', description: 'Memgraph' },
];

const node = <Circle className="size-3 shrink-0 text-data-1" aria-hidden />;
const edge = <ArrowRight className="size-3 shrink-0 text-data-1" aria-hidden />;

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

/** The signed-in frame with the views column open or folded; folding it folds the tree column too. */
function Shell({ initiallyCollapsed }: { initiallyCollapsed: boolean }) {
  const [collapsed, setCollapsed] = React.useState(initiallyCollapsed);
  const [view, setView] = React.useState('models');
  const [graph, setGraph] = React.useState('airways');

  const groups = VIEW_GROUPS.map((g) => ({
    ...g,
    items: g.items.map((item) => ({ ...item, onClick: () => setView(item.key ?? item.name) })),
  }));

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
        bottomNavItems: [{ key: 'settings', name: 'Settings', icon: Settings }],
      }}
      leftSection={
        collapsed
          ? undefined
          : {
              defaultSize: '280px',
              content: (
                <TreeView
                  variant="column"
                  items={MODEL_TREE}
                  searchable
                  searchPlaceholder="Filter models and types"
                  groupMeta={{ 'airways · Neo4j': '3 models' }}
                  activeId="airport"
                />
              ),
            }
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
 * The views column open: its head (title, New, Collapse), the Graph picker under it, the
 * views with their counts, and the tree column beside it. Collapse folds both columns to
 * the 45px rail; Expand opens them again.
 */
export const Expanded: Story = {
  render: () => <Shell initiallyCollapsed={false} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('A view becomes the open one', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Stitches/ }));
      await expect(canvas.getByText('Open view: stitches. The views column is open.')).toBeInTheDocument();
    });
    await step('Collapse folds the views and the tree column', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse' }));
      await expect(canvas.queryByText('Global model')).not.toBeInTheDocument();
      await expect(canvas.queryByText('Node types')).not.toBeInTheDocument();
    });
    await step('Expand opens both again', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Expand' }));
      await expect(canvas.getByText('Global model')).toBeInTheDocument();
      await expect(canvas.getByText('Node types')).toBeInTheDocument();
    });
  },
};

/** The views column folded to its 45px icon rail; each view's label is its tooltip and the tree column is hidden. */
export const Collapsed: Story = {
  render: () => <Shell initiallyCollapsed />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Global model')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
  },
};
