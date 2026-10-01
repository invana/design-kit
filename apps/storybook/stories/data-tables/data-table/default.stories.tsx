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

/**
 * Every row, at once, and sortable by a header click — the table a card, an
 * answer or a record shows. There is no search and no page line: a table that
 * needs them is a `PaginatedTable`, or a `RemotePaginatedTable` when the
 * server holds the rows.
 */
export const Default: Story = {
  args: { columns: STORE_COLUMNS, data: STORES },
};
