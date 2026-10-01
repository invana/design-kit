import * as React from 'react';
import { applyCellEdit, type CellEditHandler, type ColumnDef } from '@invana/tables';
import { Badge } from '@invana/ui';

/**
 * The people every `PaginatedTable` story pages through — 87 rows, so the
 * search, the page line and the rows-per-page picker all have something to
 * do. Deterministic, so a story looks the same on every load.
 */
export type Person = {
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

export const PEOPLE: Person[] = Array.from({ length: 87 }, (_, i) => ({
  id: `u-${i + 1}`,
  name: `${NAMES[i % NAMES.length]} ${i + 1}`,
  email: `user${i + 1}@invana.io`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  team: ['Platform', 'Growth', 'Data', 'Design'][i % 4],
  status: (['active', 'invited', 'disabled'] as const)[i % 3],
  visits: (i * 137) % 500,
}));

const STATUS_VARIANT = {
  active: 'default',
  invited: 'secondary',
  disabled: 'outline',
} as const;

/** Name, email, role, team and visits edit in place; status is read-only. */
export const PEOPLE_COLUMNS: ColumnDef<Person, unknown>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 220,
    meta: { editable: true },
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 240,
    meta: { editable: true },
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
    meta: { editable: true },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    size: 120,
    cell: ({ getValue }) => {
      const v = getValue() as Person['status'];
      return <Badge variant={STATUS_VARIANT[v]}>{v}</Badge>;
    },
  },
  {
    id: 'visits',
    accessorKey: 'visits',
    header: 'Visits',
    size: 100,
    meta: { editable: true, editType: 'number', align: 'right', mono: true },
  },
];

/** The people as state, and the edit handler that writes into it. */
export function usePeople(): [Person[], CellEditHandler<Person>] {
  const [rows, setRows] = React.useState(PEOPLE);
  const onCellEdit: CellEditHandler<Person> = (edit) =>
    setRows((all) => applyCellEdit(all, edit));
  return [rows, onCellEdit];
}
