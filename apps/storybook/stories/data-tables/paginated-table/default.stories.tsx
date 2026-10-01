import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginatedTable } from '@invana/tables';
import { PEOPLE_COLUMNS, usePeople } from '../fixtures/people';

const meta: Meta<typeof PaginatedTable> = {
  title: 'Data Tables/PaginatedTable',
  component: PaginatedTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every row in hand, ten at a time — and nothing to turn on: the search
 * (across every column with an accessor), the column picker, sorting and the
 * page line are what a `PaginatedTable` is. A new search goes back to page 1.
 *
 * The rows-per-page picker offers 10, 25, 50 and 100, and ends in `Custom…`
 * — a number field for any size up to `maxPageSize` (500).
 *
 * Name, email, role, team and visits edit in place, and an edit keeps the
 * page you are on.
 */
export const Default: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
      />
    );
  },
};
