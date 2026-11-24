import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SectionHeader, TreeView, TypographyMuted, type ExpandedKeys, type TreeItem } from '@invana/ui';
import { ArrowRight, Circle, File, Folder } from 'lucide-react';

import VARIANTS from '../../../../fixtures/ui-extended/tree-view.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** Icons are named in the JSON; a consumer draws its own. */
const ICONS: Record<string, React.ReactNode> = {
  folder: <Folder size={16} aria-hidden />,
  file: <File size={16} aria-hidden />,
  node: <Circle size={16} aria-hidden />,
  edge: <ArrowRight size={16} aria-hidden />,
};

interface ItemJson extends Omit<TreeItem, 'icon' | 'children' | 'onClick'> {
  icon?: string;
  children?: ItemJson[];
}

interface Args {
  variant: string;
  onClick: (id: string | number, label: string) => void;
}

const meta = {
  title: 'UI/UI Extended/TreeView',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { SectionHeader, TreeView } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { items: v.items, ...(v.header ? { header: v.header } : {}) },
              setup: [
                '// onClick receives (id, label): ("1-2", "Child 1-2").',
                'const toItems = (items) => items.map(({ icon, children, ...i }) => ({',
                '  ...i,',
                '  icon: ICONS[icon],',
                '  onClick,',
                '  children: children && toItems(children),',
                '}));',
              ].join('\n'),
              call: jsx('TreeView', {
                items: 'toItems(items)',
                searchable: v.searchable ? 'true' : undefined,
                header: v.header ? '<SectionHeader bare title={header.title} count={header.count} />' : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onClick: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function toItems(items: ItemJson[], onClick: TreeItem['onClick']): TreeItem[] {
  return items.map(({ icon, children, ...i }) => ({
    ...i,
    icon: icon ? ICONS[icon] : undefined,
    onClick,
    children: children && toItems(children, onClick),
  }));
}

function Live({ v, log, onClick }: { v: (typeof VARIANTS)[number]; log: Log; onClick: Args['onClick'] }) {
  const [opened, setOpened] = React.useState<string | null>(null);
  const click = (id: string | number, label: string) => {
    onClick(id, label);
    log('onClick', [id, label]);
    setOpened(label);
  };
  return (
    <>
      <TreeView
        items={toItems(v.items as ItemJson[], click)}
        searchable={v.searchable}
        header={v.header ? <SectionHeader bare title={v.header.title} count={v.header.count} /> : undefined}
      />
      {opened ? <TypographyMuted>Opened {opened}</TypographyMuted> : null}
    </>
  );
}

/**
 * A nested list of folders and files, guided by rules, with an optional search box that keeps
 * every ancestor of a match — from `fixtures/ui-extended/tree-view.json`. A `header` sits above
 * the search. Click a row: it reports `(id, label)` and a folder folds; type to filter. An item's
 * `meta` is a right-aligned count, its `tone` a status dot, and top-level items sharing a `group`
 * sit under that header.
 */
export const TreeViewStory: Story = {
  name: 'TreeView',
  render: ({ variant, onClick }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} onClick={onClick} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Searchable' }));
    await step('A row reports its id and label', async () => {
      await userEvent.click(cell.getByRole('button', { name: /Child 1-2/ }));
      await expect(args.onClick).toHaveBeenCalledWith('1-2', 'Child 1-2');
      await expect(cell.getByText('Opened Child 1-2')).toBeInTheDocument();
    });
    await step('Search keeps the match and its ancestors', async () => {
      await userEvent.type(cell.getByRole('textbox'), 'Root 2');
      await expect(cell.queryByRole('button', { name: /Root 1/ })).toBeNull();
      await expect(cell.getByRole('button', { name: /Root 2/ })).toBeInTheDocument();
    });
    await step('Grouped items sit under their header, each with its count', async () => {
      const grouped = within(within(canvasElement).getByRole('group', { name: 'Grouped, with counts and status' }));
      await expect(grouped.getByText('Relationship types')).toBeInTheDocument();
      await expect(grouped.getByRole('button', { name: /route.*50,640/ })).toBeInTheDocument();
    });
  },
};

const MODEL_TREE: TreeItem[] = [
  {
    id: 'AirRoutes',
    label: 'AirRoutes',
    icon: <Circle size={12} className="text-data-1" aria-hidden />,
    meta: 'v1 · v2 draft',
    metaTone: 'warning',
    group: 'airways · Neo4j',
    children: [
      {
        id: 'nodes',
        label: 'Node types',
        meta: 3,
        children: [
          { id: 'airport', label: 'airport', icon: ICONS.node, meta: '3,504', tone: 'warning', title: '2 properties changed in the draft', href: '#airport' },
          { id: 'country', label: 'country', icon: ICONS.node, meta: '237', href: '#country' },
        ],
      },
      {
        id: 'indexes',
        label: 'Indexes',
        meta: '1 · 2 staged',
        metaTone: 'warning',
        children: [
          { id: 'ix-code', label: 'airport.code', meta: 'unique' },
          { id: 'ix-icao', label: 'airport.icao', meta: 'unique · staged', metaTone: 'warning' },
        ],
      },
    ],
  },
  {
    id: 'Deals',
    label: 'Deals',
    icon: <Circle size={12} className="text-data-4" aria-hidden />,
    meta: 'v1',
    group: 'airways · Neo4j',
    title: '4 node · 4 edge types',
    children: [{ id: 'sponsor', label: 'Sponsor.version ≡ AirRoutes', meta: 'end gone', metaTone: 'destructive' }],
  },
];

/** The tree column: the open row and the open branches are the caller's. */
function ColumnDemo({ onClick }: { onClick: Args['onClick'] }) {
  const [active, setActive] = React.useState<string | number>('airport');
  const [open, setOpen] = React.useState<ExpandedKeys>({ AirRoutes: true, nodes: true });
  const wire = (items: TreeItem[]): TreeItem[] =>
    items.map((i) => ({
      ...i,
      onClick: (id, label, event) => {
        event.preventDefault();
        setActive(id);
        onClick(id, label);
      },
      children: i.children && wire(i.children),
    }));
  return (
    <div style={{ width: 280, height: 420 }} className="border-r">
      <TreeView
        variant="column"
        items={wire(MODEL_TREE)}
        searchable
        searchPlaceholder="Filter models and types"
        groupMeta={{ 'airways · Neo4j': '2 models' }}
        activeId={active}
        expanded={open}
        onExpandedChange={setOpen}
      />
    </div>
  );
}

/**
 * `variant="column"` fills a left-side column: flat, full height, rows indented 14px a level.
 * `activeId` lights the open row; `expanded` with `onExpandedChange` holds which branches are
 * open — by id, the same shape as a `DataTable`'s or a `Gantt`'s. A typed filter shows every branch open, so no match hides in a shut one. An item's `metaTone` colours its meta (amber *staged*, red *end gone*), `title` is its
 * tooltip and `href` draws it as a link. `groupMeta` puts a fact on a group's header, and
 * `searchPlaceholder` names the filter.
 */
export const Column: Story = {
  render: ({ onClick }) => <ColumnDemo onClick={onClick} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('The open row is lit, and the filter is named', async () => {
      await expect(canvas.getByRole('link', { name: /airport/ })).toHaveAttribute('aria-current', 'page');
      await expect(canvas.getByRole('textbox', { name: 'Filter models and types' })).toBeInTheDocument();
      await expect(canvas.getByText('2 models')).toBeInTheDocument();
    });
    await step('A link row reports its click and becomes the open one', async () => {
      await userEvent.click(canvas.getByRole('link', { name: /country/ }));
      await expect(args.onClick).toHaveBeenCalledWith('country', 'country');
      await expect(canvas.getByRole('link', { name: /country/ })).toHaveAttribute('aria-current', 'page');
    });
    await step('A filter shows a match inside a shut branch, and clearing it shuts the branch again', async () => {
      const filter = canvas.getByRole('textbox', { name: 'Filter models and types' });
      await userEvent.type(filter, 'Sponsor');
      await expect(canvas.getByText('end gone')).toBeInTheDocument();
      await userEvent.clear(filter);
      await expect(canvas.queryByText('end gone')).toBeNull();
    });
    await step('Opening a branch goes through onExpandedChange', async () => {
      await expect(canvas.queryByText('end gone')).toBeNull();
      await userEvent.click(canvas.getByRole('button', { name: /Deals/ }));
      await expect(canvas.getByRole('button', { name: /Deals/ })).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByText('end gone')).toHaveClass('text-destructive');
    });
  },
};
