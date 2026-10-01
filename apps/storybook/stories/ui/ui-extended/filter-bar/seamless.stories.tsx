import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FilterBar,
  MultiFilterChip,
  SearchInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

const meta: Meta<typeof FilterBar> = {
  title: 'UI/UI Extended/FilterBar',
  component: FilterBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { title: 'Quarterly revenue', kind: 'report' },
  { title: 'Churn by cohort', kind: 'dataset' },
  { title: 'Pipeline health', kind: 'dashboard' },
];

/**
 * Over a table, the table is the frame: no rule under the bar, and its search
 * and summary flush with the table's edges. The search and chips read at the
 * size of the rows they narrow.
 */
export const Seamless: Story = {
  render: () => {
    const [query, setQuery] = React.useState('');
    const [kind, setKind] = React.useState<string[]>([]);
    return (
      <div className="flex w-[560px] flex-col gap-2">
        <FilterBar seamless summary="3 items">
          <SearchInput
            inputSize="sm"
            className="w-56"
            placeholder="Search items"
            value={query}
            onChange={setQuery}
          />
          <MultiFilterChip
            label="kind"
            options={['report', 'dataset', 'dashboard']}
            value={kind}
            onChange={setKind}
          />
        </FilterBar>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Kind</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((r) => (
              <TableRow key={r.title}>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.kind}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};
