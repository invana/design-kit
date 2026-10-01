import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginatedTable, type TableFilter } from '@invana/tables';
import { PEOPLE_COLUMNS, usePeople, type Person } from '../fixtures/people';

const meta: Meta<typeof PaginatedTable> = {
  title: 'Data Tables/PaginatedTable',
  component: PaginatedTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Role and team take their choices from the rows; status names its own, in its own order. */
const FILTERS: TableFilter<Person>[] = [
  { id: 'role', label: 'role' },
  { id: 'team', label: 'team' },
  {
    id: 'status',
    label: 'status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'invited', label: 'Invited' },
      { value: 'disabled', label: 'Disabled' },
    ],
  },
  {
    id: 'busy',
    label: 'visits',
    single: true,
    options: [
      { value: 'high', label: '300 or more' },
      { value: 'low', label: 'under 300' },
    ],
    match: (row, [band]) => (band === 'high' ? row.visits >= 300 : row.visits < 300),
  },
];

/**
 * `filters` declares the chips; the table does the rest in memory. Within a
 * chip any pick matches, across chips all must, and the search and the sort
 * apply to what the filters leave — then the rows are paged. Every change goes
 * back to page 1, and the count at the end of the row says what is left.
 *
 * A chip without `options` offers every distinct value of its column. `match`
 * is a filter that is not one column's value — here a band of visits — and
 * `single` makes a chip pick one at a time.
 */
export const Filters: Story = {
  render: function Render() {
    const [rows, onCellEdit] = usePeople();
    return (
      <PaginatedTable
        columns={PEOPLE_COLUMNS}
        data={rows}
        onCellEdit={onCellEdit}
        filters={FILTERS}
        noun="people"
      />
    );
  },
};
