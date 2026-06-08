import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import { Badge, Button } from '@invana/ui';
import { Input } from '@invana/forms';
import { Search } from 'lucide-react';

type Person = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  team: string;
  status: 'active' | 'invited' | 'disabled';
  visits: number;
};

const seed: Person[] = Array.from({ length: 87 }).map((_, i) => ({
  id: `u-${i + 1}`,
  name: [
    'Ada Lovelace',
    'Linus Torvalds',
    'Grace Hopper',
    'Alan Turing',
    'Margaret Hamilton',
    'Dennis Ritchie',
    'Barbara Liskov',
    'Donald Knuth',
  ][i % 8] + ` ${i + 1}`,
  email: `user${i + 1}@invana.io`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  team: ['Platform', 'Growth', 'Data', 'Design'][i % 4],
  status: (['active', 'invited', 'disabled'] as const)[i % 3],
  visits: Math.floor(Math.random() * 500),
}));

const meta: Meta<typeof DataTable<Person>> = {
  title: 'Data Tables/Static/DataTable',
  component: DataTable<Person>,
  parameters: { layout: 'padded' },
};


function DataTableDemo(args: Partial<React.ComponentProps<typeof DataTable<Person>>>) {
  const [data, setData] = React.useState<Person[]>(seed);
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q),
    );
  }, [data, query]);

  const columns: ColumnDef<Person, any>[] = React.useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        size: 220,
        meta: { editable: true, editType: 'text' },
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        size: 240,
        meta: { editable: true, editType: 'text' },
      },
      {
        id: 'role',
        accessorKey: 'role',
        header: 'Role',
        size: 140,
        meta: {
          editable: true,
          editType: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
      },
      {
        id: 'team',
        accessorKey: 'team',
        header: 'Team',
        size: 140,
        meta: { editable: true, editType: 'text' },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ getValue }) => {
          const v = getValue() as Person['status'];
          const tone =
            v === 'active' ? 'default' : v === 'invited' ? 'secondary' : 'outline';
          return <Badge variant={tone}>{v}</Badge>;
        },
      },
      {
        id: 'visits',
        accessorKey: 'visits',
        header: 'Visits',
        size: 100,
        meta: { editable: true, editType: 'number', align: 'right' },
      },
    ],
    [],
  );

  return (
    <DataTable<Person>
      {...args}
      columns={columns}
      data={filtered}
      onCellEdit={({ rowIndex, columnId, value }) => {
        setData((prev) => {
          const target = filtered[rowIndex];
          if (!target) return prev;
          return prev.map((r) =>
            r.id === target.id ? { ...r, [columnId]: value } : r,
          );
        });
      }}
      toolbar={
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, team…"
            className="h-8 w-[260px] pl-8"
          />
        </div>
      }
    />
  );
}

export default meta;
type Story = StoryObj<typeof meta>;

export const ResizableColumns: Story = {
  render: () => (
    <DataTableDemo
      enableSorting
      enablePagination
      enableColumnResizing
      pageSize={10}
    />
  ),
};
