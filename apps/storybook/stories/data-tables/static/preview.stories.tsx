import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';

type Store = { store: string; margin: string; delta: string };

const rows: Store[] = [
  { store: 'North Mall', margin: '11.4%', delta: '−3.1' },
  { store: 'Northgate', margin: '12.0%', delta: '−2.6' },
  { store: 'Riverside', margin: '15.8%', delta: '+0.4' },
];

const columns: ColumnDef<Store>[] = [
  { id: 'store', accessorKey: 'store', header: 'Store' },
  { id: 'margin', accessorKey: 'margin', header: 'Margin', meta: { align: 'right' } },
  { id: 'delta', accessorKey: 'delta', header: 'Δ pts', meta: { align: 'right' } },
];

const meta: Meta<typeof DataTable<Store>> = {
  title: 'Data Tables/Static/Preview',
  component: DataTable<Store>,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `preview`: the first rows of a longer table, with how many there are under
 * them. No pagination and no header ground, since the rows are the point.
 */
export const Preview: Story = {
  args: {
    columns,
    data: rows,
    density: 'compact',
    enableSorting: false,
    enableColumnVisibility: false,
    preview: { total: 214, noun: 'stores' },
  },
};
