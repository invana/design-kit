import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { RemotePaginatedTable } from '@invana/tables';
import type { ColumnDef, RemotePageQuery } from '@invana/tables';

type Dataset = { name: string; rows: number; owner: string };

const DATASETS: Dataset[] = Array.from({ length: 42 }, (_, i) => ({
  name: `dataset_${String(i + 1).padStart(2, '0')}`,
  rows: (i + 1) * 12_480,
  owner: ['finance', 'ops', 'research'][i % 3],
}));

const COLUMNS: ColumnDef<Dataset, unknown>[] = [
  { id: 'name', accessorKey: 'name', header: 'Dataset', size: 220, meta: { mono: true } },
  {
    id: 'rows',
    accessorKey: 'rows',
    header: 'Rows',
    size: 120,
    meta: { align: 'right', mono: true },
    cell: ({ getValue }) => (getValue() as number).toLocaleString(),
  },
  { id: 'owner', accessorKey: 'owner', header: 'Owner', size: 140 },
];

const meta: Meta<typeof RemotePaginatedTable> = {
  title: 'Data Tables/RemotePaginatedTable',
  component: RemotePaginatedTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A fetch that fails: the rejection's message is said in the table, with a
 * `Retry` that asks for the same page again. Here the first request fails
 * and the retry succeeds.
 */
export const Failure: Story = {
  render: function Render() {
    const attempts = React.useRef(0);
    const fetchPage = ({ pageIndex, pageSize, signal }: RemotePageQuery) =>
      new Promise<{ rows: Dataset[]; total: number }>((resolve, reject) =>
        setTimeout(() => {
          // A request the table already gave up on is not an attempt.
          if (signal.aborted) return;
          attempts.current += 1;
          if (attempts.current === 1) {
            reject(new Error('HTTP 503 — the warehouse is offline'));
            return;
          }
          const start = pageIndex * pageSize;
          resolve({ rows: DATASETS.slice(start, start + pageSize), total: DATASETS.length });
        }, 600),
      );
    return (
      <RemotePaginatedTable<Dataset>
        columns={COLUMNS}
        fetchPage={fetchPage}
        searchable={false}
      />
    );
  },
};
