import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import { STORES, STORE_COLUMNS, type Store } from '../fixtures/stores';

const meta: Meta<typeof DataTable<Store>> = {
  title: 'Data Tables/DataTable',
  component: DataTable<Store>,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Region names a place, not an order, so its header is not a sort button. */
const COLUMNS = STORE_COLUMNS.map((column) =>
  column.id === 'region' ? { ...column, enableSorting: false } : column,
);

/**
 * Sorting is on by default: a header click sorts ascending, a second click
 * descending, a third puts the rows back. `defaultSorting` is where it starts
 * — here the best margin first, its arrow already showing — and a column opts
 * out with `enableSorting: false`. `sorting` / `onSortingChange` control it
 * from outside; `enableSorting={false}` turns it off for the whole table. The
 * same props on `PaginatedTable` and `RemotePaginatedTable`.
 */
export const Sorting: Story = {
  args: {
    columns: COLUMNS,
    data: STORES,
    defaultSorting: [{ id: 'margin', desc: true }],
  },
};
