import type { RowData, SortingState } from '@tanstack/react-table';

export type EditType = 'text' | 'number' | 'select';

export type EditOption = { label: string; value: string };

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    editable?: boolean;
    editType?: EditType;
    options?: EditOption[];
    align?: 'left' | 'center' | 'right';
    /**
     * Read this column as the record writes it — an id, a digest, a count, a
     * duration. Mono is not decoration here: it is what makes a column of
     * addresses scannable and a column of numbers comparable down its own
     * length.
     */
    mono?: boolean;
    /**
     * Extra class(es) applied to this column's body `<td>`. Use to control
     * padding, vertical alignment, or background when rendering your own
     * always-on controls (Switch/Select/Input) inside `cell()`. A function is
     * asked per row — a verdict column coloured by its own verdict.
     */
    cellClassName?: string | ((row: TData) => string | undefined);
    /** Extra class(es) applied to this column's header `<th>`. */
    headerClassName?: string;
    /**
     * The cell holds a control that is always on — an `Input`, a `Select`, a
     * `Checkbox` at its `sm` size. The cell gives up the vertical padding the
     * control's own border already provides, so a row of controls is the
     * same height as a row of text.
     */
    control?: boolean;
  }
}

/**
 * One saved cell edit — everything needed to write it somewhere else: a
 * server (`PATCH /items/${rowId}` with `{ [field]: value }`), or the parent's
 * own state (`setRows((rows) => applyCellEdit(rows, edit))`).
 */
export interface CellEdit<TData> {
  /** The new value. An emptied number is `null`. */
  value: unknown;
  /** The value before the edit. */
  previousValue: unknown;
  /** The row as the table was given it. */
  row: TData;
  /** A copy of `row` with `value` written at `field` — `row` itself when `field` is undefined. */
  updatedRow: TData;
  /** The row's id: `getRowId`'s answer, or TanStack's position id (`0`, `0.1`). */
  rowId: string;
  /** The column's id. */
  columnId: string;
  /**
   * The path the column reads — its `accessorKey`, dots and all
   * (`order.quantity`). Undefined for a column read by an `accessorFn`, which
   * names no place to write.
   */
  field: string | undefined;
  /** The rows above this one, outermost first. Empty in a flat table. */
  ancestors: TData[];
  /** The row's index among its siblings — in `data`, its parent's sub-rows, or the page. */
  rowIndex: number;
}

/**
 * Saves a cell edit. Return a promise to save asynchronously: the cell shows
 * the new value as saving until it settles, and on a rejection puts the old
 * value back and says why (the error's `message`) on the cell.
 */
export type CellEditHandler<TData> = (
  edit: CellEdit<TData>,
) => void | Promise<unknown>;

/** One choice of a filter: its value, or a value with a label. */
export type TableFilterOption = string | { value: string; label?: string };

/**
 * A filter chip over the rows. The same definition works on both paged
 * tables: `PaginatedTable` applies it to the rows in memory,
 * `RemotePaginatedTable` sends the picks to `fetchPage` as `filters[id]`.
 */
export interface TableFilter<TData> {
  /** Its key in the filter values, and in `RemotePageQuery.filters`. */
  id: string;
  /** What the chip says — `kind`, `status`. */
  label: string;
  /**
   * The choices. `PaginatedTable` derives them from the rows when absent —
   * every distinct value of the column — sorted; `RemotePaginatedTable`
   * cannot see every row, so name them there.
   */
  options?: TableFilterOption[];
  /** The column whose value is matched. Defaults to the filter's `id`. */
  columnId?: string;
  /** Pick one at a time rather than many. */
  single?: boolean;
  /**
   * In memory only: whether a row passes, given what is picked (never
   * empty). Defaults to the column's value being one of them.
   */
  match?: (row: TData, selected: string[]) => boolean;
}

/** What each filter is narrowed to, by filter id. An empty or missing list is not filtering. */
export type FilterValues = Record<string, string[]>;

/** What `RemotePaginatedTable` asks the server for. */
export interface RemotePageQuery {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  /** The search box, debounced and trimmed — `''` when empty. */
  search: string;
  /** The filters that are set, by id — only those with a pick. */
  filters: FilterValues;
  /** Aborted when a newer query replaces this one. */
  signal: AbortSignal;
}

/** One page back from the server, and how many rows there are in all. */
export interface RemotePage<TData> {
  rows: TData[];
  total: number;
}
