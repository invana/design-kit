import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';

type Ceiling = { key: string; value: string; bounds: string };

const rows: Ceiling[] = [
  { key: 'max_concurrent_runs', value: '3', bounds: 'runs at once' },
  { key: 'max_fanout', value: '200', bounds: 'lanes in one map' },
  { key: 'max_children', value: '0', bounds: 'agents spawned per run' },
  { key: 'max_depth', value: '0', bounds: 'levels of delegation' },
];

const columns: ColumnDef<Ceiling>[] = [
  { id: 'key', accessorKey: 'key', header: 'Ceiling' },
  { id: 'value', accessorKey: 'value', header: 'Value' },
  { id: 'bounds', accessorKey: 'bounds', header: 'What it bounds' },
];

const meta: Meta<typeof DataTable<Ceiling>> = {
  title: 'Data Tables/Static/Bordered',
  component: DataTable<Ceiling>,
  parameters: { layout: 'padded' },
};

export default meta;

/**
 * `bordered` draws the box, for a table standing alone on a page. Off by
 * default: in a card, a panel or an answer the edge is the frame, so the table
 * keeps its row rules only and its outer columns sit flush.
 */
export const Bordered: StoryObj<typeof meta> = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      bordered
      enableSorting={false}
      enablePagination={false}
      enableColumnVisibility={false}
    />
  ),
};
