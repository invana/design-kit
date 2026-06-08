import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@invana/tables';
import type { ColumnDef } from '@invana/tables';
import { Badge } from '@invana/ui';
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

const NAMES = [
  'Ada Lovelace',
  'Linus Torvalds',
  'Grace Hopper',
  'Alan Turing',
  'Margaret Hamilton',
  'Dennis Ritchie',
  'Barbara Liskov',
  'Donald Knuth',
];

const data: Person[] = Array.from({ length: 87 }).map((_, i) => ({
  id: `u-${i + 1}`,
  name: `${NAMES[i % NAMES.length]} ${i + 1}`,
  email: `user${i + 1}@invana.io`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  team: ['Platform', 'Growth', 'Data', 'Design'][i % 4],
  status: (['active', 'invited', 'disabled'] as const)[i % 3],
  visits: (i * 37) % 500,
}));

function StaticDemo() {
  const [query, setQuery] = React.useState('');

  // Client-side search across name, email, and team.
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.team.toLowerCase().includes(q),
    );
  }, [query]);

  const columns = React.useMemo<ColumnDef<Person, any>[]>(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name', size: 220 },
      { id: 'email', accessorKey: 'email', header: 'Email', size: 240 },
      { id: 'role', accessorKey: 'role', header: 'Role', size: 120 },
      { id: 'team', accessorKey: 'team', header: 'Team', size: 140 },
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
        meta: { align: 'right' },
      },
    ],
    [],
  );

  return (
    <DataTable<Person>
      columns={columns}
      data={filtered}
      enableSorting
      enablePagination
      enableColumnVisibility
      pageSize={10}
      pageSizeOptions={[10, 20, 50]}
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

const meta: Meta = {
  title: 'Data Tables/Static/DataTable',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Static (client-side) data table over an in-memory dataset. Sorting, pagination, column visibility, and search all run in the browser — no server round-trips.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSearch: Story = {
  render: () => <StaticDemo />,
};
