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
 * Calling out what the rows say. `isCellHighlighted(row, columnId)` tints a
 * single cell — here every margin under 12.5% and every fall of more than two
 * points. `isRowHighlighted(row)` tints a whole row — the best store.
 */
export const CellHighlight: Story = {
  args: {
    columns: STORE_COLUMNS,
    data: STORES,
    isCellHighlighted: (row, columnId) =>
      (columnId === 'margin' && row.margin < 12.5) ||
      (columnId === 'delta' && row.delta < -2),
    isRowHighlighted: (row) => row.store === 'Airport',
  },
};
