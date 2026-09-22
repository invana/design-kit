import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import { KindChip, RunStatusText } from '@invana/ui';

type Run = {
  id: string;
  about: string;
  kind: string;
  agent: string;
  world: string;
  elapsed: string;
  tokens: string;
  tasks: string;
  cost: string;
  status: string;
  depth: number;
};

const RUNS: Run[] = [
  { id: '7d3184f1', about: 'which carriers were late in H1?', kind: 'ask', agent: 'Analyst', world: 'EU · H1 2026', elapsed: '2m 51s', tokens: '21.4k', tasks: '9/9', cost: '$0.041', status: 'succeeded', depth: 0 },
  { id: 'c0193ab7', about: 'Nightly bundle — 4 datasets', kind: 'bulk', agent: 'Loader', world: 'global', elapsed: '6m 12s', tokens: '—', tasks: '12/14', cost: '—', status: 'running', depth: 0 },
  { id: '91be2204', about: 'orders.csv → Brokerage.Order', kind: 'import', agent: 'Loader', world: 'global', elapsed: '1.4s', tokens: '—', tasks: '5/7', cost: '—', status: 'succeeded', depth: 1 },
  { id: '3c77ba15', about: 'news-tv.csv → Media.Story', kind: 'import', agent: 'Loader', world: 'global', elapsed: '—', tokens: '—', tasks: '0/7', cost: '—', status: 'queued', depth: 1 },
  { id: '44f7c8d2', about: 'which suppliers slipped twice?', kind: 'ask', agent: 'Analyst', world: 'EU · H1 2026', elapsed: '18.2s', tokens: '9.1k', tasks: '6/6', cost: '$0.018', status: 'cannot_answer', depth: 0 },
  { id: '2ab90f13', about: 'Stitch Carriers ↔ Routes', kind: 'stitch', agent: 'Modeller', world: 'global', elapsed: '4.9s', tokens: '1.2k', tasks: '3/3', cost: '$0.003', status: 'succeeded', depth: 0 },
  { id: '6e5510cc', about: 'Escalate a late supplier', kind: 'enrich', agent: 'Analyst', world: 'EU · H1 2026', elapsed: '2m 04s', tokens: '3.3k', tasks: '4/5', cost: '$0.007', status: 'awaiting_approval', depth: 0 },
  { id: 'b81420ef', about: 'why was the draft rejected?', kind: 'ask', agent: 'Reviewer', world: 'EU · H1 2026', elapsed: '7.1s', tokens: '4.4k', tasks: '4/4', cost: '$0.009', status: 'succeeded', depth: 0 },
];

const columns: ColumnDef<Run>[] = [
  { accessorKey: 'id', header: 'run', size: 100, meta: { mono: true } },
  { accessorKey: 'about', header: 'what it was about', size: 260 },
  {
    accessorKey: 'kind',
    header: 'kind',
    size: 80,
    cell: ({ row }) => <KindChip kind={row.original.kind} />,
  },
  { accessorKey: 'agent', header: 'agent', size: 90 },
  { accessorKey: 'world', header: 'world', size: 120 },
  { accessorKey: 'elapsed', header: 'elapsed', size: 80, meta: { mono: true, align: 'right' } },
  { accessorKey: 'tokens', header: 'tokens', size: 70, meta: { mono: true, align: 'right' } },
  { accessorKey: 'tasks', header: 'tasks', size: 60, meta: { mono: true, align: 'right' } },
  { accessorKey: 'cost', header: 'cost', size: 70, meta: { mono: true, align: 'right' } },
  {
    accessorKey: 'status',
    header: 'status',
    size: 130,
    cell: ({ row }) => <RunStatusText status={row.original.status} />,
  },
];

const meta: Meta<typeof DataTable<Run>> = {
  title: 'Data Tables/Static/DataTable',
  component: DataTable<Run>,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The journal — every run in a Graph, newest first, children under their
 * parent.
 *
 * Three readings the table had to grow for it. **Compact** is the density a
 * record list is drawn at, and it was already in the primitive `Table` waiting
 * to be passed on. **Indent** puts the two imports under the bundle that
 * spawned them, on the first column only, so the shape of the list is carried
 * by the column a reader is scanning. **Selection** marks the run that is open
 * elsewhere — an accent ground and a rule down its leading edge, so it is still
 * findable after a scroll.
 *
 * `mono` on a column is not decoration: it is what makes a column of addresses
 * scannable and a column of durations comparable down its own length.
 */
export const TheJournal: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('7d3184f1');
    return (
      <DataTable
        columns={columns}
        data={RUNS}
        density="compact"
        enablePagination={false}
        enableSorting={false}
        enableColumnVisibility={false}
        rowIndent={(row) => row.depth}
        isRowSelected={(row) => row.id === selected}
        onRowClick={(row) => setSelected(row.id)}
      />
    );
  },
};
