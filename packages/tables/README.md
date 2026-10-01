# @invana/tables

Data table components for Invana products — TanStack Table v8 underneath, `@invana/ui` on top,
with drag-to-reorder columns and editable cells.

```bash
pnpm add @invana/tables
```

Peer dependencies: `@invana/ui`, `@invana/styling`, `@invana/forms`, `react`, `react-dom`.

## Three tables

Pick by where the rows are and how many there are. All three share one core, so sorting, inline
editing (`meta.editable` + `onCellEdit`), row and cell highlighting (`isRowHighlighted`,
`isCellHighlighted`, `isRowSelected`, `isTotalRow`), grouping, nesting (`getSubRows`), expanding
(`renderExpanded`), density, `seamless` and the column features (visibility, pinning, reordering,
resizing) behave the same in each.

| Component | Rows | Adds |
| --- | --- | --- |
| `DataTable` | every row, in hand | `preview` (first rows of a longer table, `Open all`) |
| `PaginatedTable` | every row, in hand | search, column picker, pages, rows-per-page |
| `RemotePaginatedTable` | on a server | `fetchPage` — debounce, abort, page reset, loading, error + retry |

```tsx
import { DataTable, PaginatedTable, RemotePaginatedTable, type ColumnDef } from '@invana/tables';

type Run = { id: string; task: string; status: string; duration: string };

const columns: ColumnDef<Run>[] = [
  { accessorKey: 'task', header: 'Task', meta: { editable: true } },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'duration', header: 'Duration', meta: { align: 'right', mono: true } },
];

<DataTable columns={columns} data={rows} />

<PaginatedTable columns={columns} data={rows} pageSizeOptions={[10, 25, 50]} onCellEdit={save} />

<RemotePaginatedTable
  columns={columns}
  fetchPage={async ({ pageIndex, pageSize, sorting, search, signal }) => {
    const res = await fetch(url({ pageIndex, pageSize, sorting, search }), {
      signal,
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    return { rows: json.items, total: json.total };
  }}
/>
```

`fetchPage` owns the transport — URL, headers, auth, GraphQL — and is read through a ref, so an
inline function does not refetch on every render. Change `refreshKey` to fetch the current page
again.

### Inline edits

A column opts in with `meta.editable`. `onCellEdit` receives a `CellEdit` — everything needed to
write the change elsewhere:

| Field | |
| --- | --- |
| `value` / `previousValue` | new and old value (an emptied number is `null`) |
| `rowId` | `getRowId`'s answer, or the position id |
| `columnId` / `field` | the column, and the accessor path it reads (`order.quantity`) |
| `row` / `updatedRow` | the row, and a copy with the change applied |
| `ancestors` | parent rows, outermost first (nested tables) |

```tsx
// to a server — reject to put the old value back
onCellEdit={({ rowId, field, value }) =>
  fetch(`/api/items/${rowId}`, { method: 'PATCH', body: JSON.stringify({ [field!]: value }) })}

// to the parent's state
onCellEdit={(edit) => setRows((rows) => applyCellEdit(rows, edit, { subRowsKey: 'children' }))}
```

`RemotePaginatedTable` writes a successful edit into the page it is showing, so the value stays
without a refetch.

### Page size

The rows-per-page picker on both paged tables offers `10, 25, 50, 100` and ends in `Custom…`, a
number field capped at `maxPageSize` (500). Pass your own `pageSizeOptions`, `allowCustomPageSize={false}`
to drop `Custom…`, or `pageSizeOptions={false}` for no picker. It hides itself when every row fits
the smallest size.

Column options live on `meta`: `editable` / `editType` / `options`, `align`, `mono`, `control`
(an always-on `sm` control in the cell), and the `cellClassName` / `headerClassName` escape hatches.

## Exports

- `DataTable`, `PaginatedTable`, `RemotePaginatedTable` (and their `…Props`, plus `TableBaseProps`)
- `DataTableToolbar` — search, caller controls and the column picker
- `DataTablePagination` — page controls
- `EditableCell` — in-place cell editing, with `CellEdit`, `CellEditHandler`, `EditType` and `EditOption`
- `applyCellEdit` — writes a `CellEdit` into an array of rows, immutably
- `RemotePageQuery`, `RemotePage` — the `fetchPage` contract

TanStack's state types are re-exported so consumers need not add `@tanstack/react-table` directly:
`ColumnDef`, `SortingState`, `ColumnFiltersState`, `ColumnOrderState`, `ColumnPinningState`,
`ExpandedState`, `PaginationState`, `VisibilityState`.

## License

MIT © Ravi Raja Merugu
