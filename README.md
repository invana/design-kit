# @invana/tables

Data table components for Invana products — TanStack Table v8 underneath, `@invana/ui` on top,
with drag-to-reorder columns and editable cells.

```bash
pnpm add @invana/tables
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `@invana/forms`, `react`, `react-dom`.

## Usage

```tsx
import { DataTable, DataTablePagination, type ColumnDef } from '@invana/tables';

type Run = { id: string; task: string; status: string; duration: string };

const columns: ColumnDef<Run>[] = [
  { accessorKey: 'task', header: 'Task' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'duration', header: 'Duration' },
];

export function RunsTable({ rows }: { rows: Run[] }) {
  return <DataTable columns={columns} data={rows} />;
}
```

## Exports

- `DataTable` (and `DataTableProps`)
- `DataTableToolbar` — filter and column-visibility chrome
- `DataTablePagination` — page controls
- `EditableCell` — in-place cell editing, with `CellEditHandler`, `EditType` and `EditOption`

TanStack's state types are re-exported so consumers need not add `@tanstack/react-table` directly:
`ColumnDef`, `SortingState`, `ColumnFiltersState`, `ColumnOrderState`, `ColumnPinningState`,
`PaginationState`, `VisibilityState`.

## License

MIT © Ravi Raja Merugu
