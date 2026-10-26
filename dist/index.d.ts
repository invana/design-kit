import * as React from 'react';
import { RowData, SortingState, ColumnDef, OnChangeFn, ExpandedState, PaginationState, Table, CellContext } from '@tanstack/react-table';
export { ColumnDef, ColumnFiltersState, ColumnOrderState, ColumnPinningState, ExpandedState, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table';
import { TableDensity } from '@invana/ui';

type EditType = 'text' | 'number' | 'select';
type EditOption = {
    label: string;
    value: string;
};
declare module '@tanstack/react-table' {
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
interface CellEdit<TData> {
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
type CellEditHandler<TData> = (edit: CellEdit<TData>) => void | Promise<unknown>;
/** One choice of a filter: its value, or a value with a label. */
type TableFilterOption = string | {
    value: string;
    label?: string;
};
/**
 * A filter chip over the rows. The same definition works on both paged
 * tables: `PaginatedTable` applies it to the rows in memory,
 * `RemotePaginatedTable` sends the picks to `fetchPage` as `filters[id]`.
 */
interface TableFilter<TData> {
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
type FilterValues = Record<string, string[]>;
/** What `RemotePaginatedTable` asks the server for. */
interface RemotePageQuery {
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
interface RemotePage<TData> {
    rows: TData[];
    total: number;
}

/**
 * Everything a table reads the same way whether it shows every row, pages
 * them itself or asks a server for each page. `DataTable`, `PaginatedTable`
 * and `RemotePaginatedTable` each take all of this, and add only their own
 * chrome on top.
 */
interface TableBaseProps<TData extends RowData> {
    columns: ColumnDef<TData, any>[];
    /** Sort by a header click. On by default; a column opts out with `enableSorting: false`. */
    enableSorting?: boolean;
    /** Controlled sorting state. */
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    /** The sort to start from, when `sorting` is not controlled. */
    defaultSorting?: SortingState;
    /** Offer the column picker — the icon at the end of the toolbar. */
    enableColumnVisibility?: boolean;
    /** Drag a header by its grip to move the column. */
    enableColumnReordering?: boolean;
    /** Drag a header's right edge to resize the column. */
    enableColumnResizing?: boolean;
    /** Pin columns to either edge, from the column picker. */
    enableColumnPinning?: boolean;
    /**
     * Saves a cell edited in place. A column opts in with `meta.editable` (and
     * `meta.editType` / `meta.options`); return a promise to save asynchronously.
     */
    onCellEdit?: CellEditHandler<TData>;
    /**
     * What opens an editable cell's editor. `click` (the default) opens it on a
     * click or `Enter`. `dblclick` leaves a single click to `onCellClick` — the
     * cell is picked, its details shown — and opens the editor on a double-click,
     * or `F2` on the focused cell (`Enter` on it is a click). Either way `Enter`
     * saves and `Escape` puts the value back.
     */
    editTrigger?: "click" | "dblclick";
    /** Anything beside the table's own controls, at the start of the toolbar. */
    toolbar?: React.ReactNode;
    /** Content rendered as a sticky summary bar inside the table's bordered container, below the rows. */
    footer?: React.ReactNode;
    className?: string;
    /** What an empty table says. Defaults to `No results.` */
    emptyState?: React.ReactNode;
    /**
     * Presentational row grouping — returns the group a row belongs to, or
     * `null` for none. A full-width header row is emitted whenever the key
     * changes from the previous row.
     *
     * Deliberately *not* TanStack's aggregating grouping model. This is for a
     * list that already arrives in the right order and wants section headings in
     * it — a story index, a queue split into questions/proposals/results. It
     * sorts nothing and aggregates nothing, so it cannot disagree with the order
     * the caller chose.
     */
    groupBy?: (row: TData) => string | null | undefined;
    /** What a group header row contains. Defaults to the key. */
    renderGroupHeader?: (key: string, rows: TData[]) => React.ReactNode;
    /**
     * `compact` is the dense reading — 26px rows at `text-sm`, which is what a
     * journal, a trace or a step's output table is drawn at.
     */
    density?: TableDensity;
    /**
     * No box, and nothing wasted on its outside: only the rules between rows are
     * drawn, and the first and last columns sit flush with the text around the
     * table. For a table set into running text — an assistant's answer — whose
     * columns should start where the sentence above it does.
     */
    seamless?: boolean;
    /**
     * Draw the box. Off for a table inside a card or a panel, whose edge already
     * frames it — a second border a few pixels in reads as a box inside a box —
     * while its cells keep their padding. `seamless` draws no box either way.
     */
    bordered?: boolean;
    /**
     * How deep this row sits under another — a child run under the run that
     * spawned it. Indents the **first** cell only, so the shape of the list is
     * carried by the column a reader is scanning and not by the whole row.
     *
     * Presentational, like `groupBy`: it nests nothing and sorts nothing, because
     * the caller already has the rows in the order it wants them.
     */
    rowIndent?: (row: TData) => number | undefined;
    /**
     * Which row is the one being read elsewhere — the run open in the panel, the
     * step open on its page. Drawn as an accent ground with a rule down its
     * leading edge, so it is still findable after a scroll.
     */
    isRowSelected?: (row: TData) => boolean;
    /**
     * Rows called out for what they say — the worst store, the outlier — on a
     * tinted ground. Unlike `isRowSelected` nothing is open elsewhere, so there
     * is no leading rule.
     */
    isRowHighlighted?: (row: TData) => boolean;
    /**
     * Single cells called out — the figure that breaches a limit, the value
     * that changed. The same tint as `isRowHighlighted`, on that cell only.
     */
    isCellHighlighted?: (row: TData, columnId: string) => boolean;
    /**
     * The total row: set bold under a rule, and not counted among the rows a
     * preview says it shows. Pass it last in the rows.
     */
    isTotalRow?: (row: TData) => boolean;
    /**
     * Extra class(es) for a body row, asked per row and applied after the
     * table's own, so they win — a stream tinted by each event's verdict.
     */
    rowClassName?: (row: TData) => string | undefined;
    /** Extra class(es) for the header row. */
    headerRowClassName?: string;
    /**
     * The narrowest the table may draw, in px. A wide table keeps its columns
     * legible and scrolls sideways instead of squeezing them.
     */
    minWidth?: number;
    /** Makes rows activate — click, `Enter` or `Space`. */
    onRowClick?: (row: TData) => void;
    /**
     * A body cell was clicked — the header never, nor a cell whose editor is
     * open (a click inside the field is typing, not picking). Fires before
     * `onRowClick` when both are set, since the cell is inside the row; a
     * double-click is two clicks, so it fires twice. Cells take no focus of
     * their own: `Enter` on an editable cell's value is a click, so it fires
     * there, and a keyboard reader picks a whole row with `onRowClick`. Pair
     * with `isCellHighlighted` to draw the picked cell.
     */
    onCellClick?: (row: TData, columnId: string) => void;
    /**
     * Rows under a row, with the same columns — a plan's subtasks, a folder's
     * files, a dataset's tables. A row with children gets a chevron in its first
     * cell; each level indents that cell, as `rowIndent` does for a flat list
     * (and wins over it). Sorting orders siblings, so children stay under their
     * parent; pagination counts top-level rows, so opening one never pushes
     * another onto the next page.
     */
    getSubRows?: (row: TData) => TData[] | undefined;
    /**
     * Anything under a row, the full width of the table — a payload, a small
     * table, a trace. Drawn with no box of its own, aligned with the row's
     * content. Every row can open one unless `canExpand` says otherwise.
     */
    renderExpanded?: (row: TData) => React.ReactNode;
    /** Which rows `renderExpanded` has something for. Defaults to all of them. */
    canExpand?: (row: TData) => boolean;
    /**
     * Which rows start open: `true` for all, or `{ [rowId]: true }` for some.
     * Ignored when `expanded` is controlled.
     */
    defaultExpanded?: ExpandedState;
    /** Which rows are open, by row id — `true` for all. Controlled. */
    expanded?: ExpandedState;
    onExpandedChange?: OnChangeFn<ExpandedState>;
    /** Also open and close a row by clicking it, not only its chevron. */
    expandOnRowClick?: boolean;
    /**
     * A row's id — what `expanded` is keyed by. Defaults to its position
     * (`0`, `0.1`, …), which moves when the data does; pass one to keep a row
     * open across a refetch or a sort.
     */
    getRowId?: (row: TData, index: number, parent?: {
        id: string;
    }) => string;
}
/**
 * Search and filter chips — the same props on both paged tables. Where the
 * work happens is the table's: `PaginatedTable` narrows its rows in memory,
 * `RemotePaginatedTable` sends the picks to `fetchPage`. Either way the
 * callbacks hear every change and the table goes back to its first page.
 */
interface TableFilterProps<TData> {
    /** Draw the search box. On by default. */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Controlled search text. */
    search?: string;
    onSearchChange?: (value: string) => void;
    /** The filter chips, in order, after the search box. */
    filters?: TableFilter<TData>[];
    /** Controlled filter values, by filter id. */
    filterValues?: FilterValues;
    /** The values to start from, when `filterValues` is not controlled. */
    defaultFilterValues?: FilterValues;
    onFiltersChange?: (values: FilterValues) => void;
    /**
     * What the rows are, for the count at the end of the filter row —
     * `23 of 91 events`. Shown whenever there are filters.
     */
    noun?: string;
}

/** Where streamed rows go. */
type StreamMode = "prepend" | "append" | "upsert";
/**
 * Subscribes to a source of rows: call `emit` with each batch as it arrives,
 * and return what stops it — closing a socket, clearing a timer.
 */
type TableStream<TData> = (emit: (rows: TData[]) => void) => (() => void) | void;
/**
 * Live rows on top of `data` — a log, an evaluation stream, sessions whose
 * numbers move. `data` is where the rows start; what `stream` emits goes on
 * top of it, and a new `data` starts the rows over from it.
 */
interface TableStreamProps<TData extends RowData> {
    /**
     * Subscribed while true: turning it on calls `stream`, turning it off (or
     * unmounting) calls what `stream` returned.
     */
    streaming?: boolean;
    /**
     * The source. Read when `streaming` turns on, not on every render, so an
     * inline function does not reconnect each time the parent draws; to switch
     * sources, turn `streaming` off and on, or remount the table.
     */
    stream?: TableStream<TData>;
    /**
     * `prepend` puts new rows on top (newest first, the default), `append` at
     * the bottom; `upsert` replaces the row with the same `getRowId` in place
     * and appends the rest — rows whose values move.
     */
    streamMode?: StreamMode;
    /**
     * Keep only this many rows: the oldest go — the bottom ones when
     * prepending, the top ones otherwise.
     */
    maxRows?: number;
}

interface DataTableProps<TData extends RowData> extends TableBaseProps<TData>, TableStreamProps<TData> {
    /** The rows — where a `stream` starts from, when there is one. */
    data: TData[];
    /** Dim the rows under a spinner. */
    loading?: boolean;
    /**
     * The table as a preview of a longer one — the first rows an answer shows.
     * Says how much there is under the rows: `3 of 214 · stores`, with `action`
     * (an `Open all`) at the end. `data` is the rows shown; `total` is how many
     * exist, and without it there is no count line, since `3 of 3` says nothing.
     *
     * `onOpen` draws the `Open all` link itself (`openLabel` renames it), in the
     * primary colour and flush with the count; `action` is for anything else.
     */
    preview?: {
        total?: number;
        noun?: string;
        action?: React.ReactNode;
        onOpen?: () => void;
        openLabel?: React.ReactNode;
    };
}
/**
 * Every row, at once — the table inside a card, an answer, a panel, a run's
 * record. No search and no pages: when the rows need either, it is a
 * `PaginatedTable`, or a `RemotePaginatedTable` when the server holds them.
 *
 * Sorting, inline editing, highlighting, grouping, nesting, expanding and the
 * column features are all here, and are the same in the other two.
 */
declare function DataTable<TData extends RowData>(props: DataTableProps<TData>): React.JSX.Element;

interface PaginatedTableProps<TData extends RowData> extends TableBaseProps<TData>, TableFilterProps<TData>, TableStreamProps<TData> {
    /**
     * Every row; the table searches and pages them itself. Streamed rows join
     * them, and the page, search and filters stay where they are.
     */
    data: TData[];
    /** Dim the rows under a spinner. */
    loading?: boolean;
    /** Rows per page. Defaults to 10. */
    pageSize?: number;
    /**
     * The sizes the rows-per-page picker offers. Defaults to 10, 25, 50 and
     * 100; `false` draws no picker. Hidden anyway when every row fits the
     * smallest size.
     */
    pageSizeOptions?: number[] | false;
    /** End the picker with `Custom…`, a number field for any size. On by default. */
    allowCustomPageSize?: boolean;
    /** The largest page `Custom…` accepts. Defaults to 500. */
    maxPageSize?: number;
    /** Controlled pagination state. */
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    /** Which columns the search reads, by id. Defaults to every column with an accessor. */
    searchColumns?: string[];
}
/**
 * Every row in hand, a page of them at a time — with a search across them,
 * filter chips, the column picker and the line of pages under the rows.
 * Search, filters and sorting all run in memory: filter, then search, then
 * sort, then page. A new search, filter or sort goes back to the first page;
 * editing a cell keeps the page you are on.
 *
 * When the server holds the rows and sends a page at a time, use
 * `RemotePaginatedTable`.
 */
declare function PaginatedTable<TData extends RowData>(props: PaginatedTableProps<TData>): React.JSX.Element;

interface RemotePaginatedTableProps<TData extends RowData> extends TableBaseProps<TData>, TableFilterProps<TData> {
    /**
     * Fetch one page. Called on the first draw and whenever the page, the page
     * size, the sort, the filters or the (debounced) search changes, and when
     * `refreshKey` does. Transport is yours — headers, auth, the URL shape, GraphQL — the
     * table only says which page it wants and aborts `signal` when it stops
     * wanting it. A rejection is shown in the table, with a retry.
     *
     * Read through a ref, so an inline function does not refetch every render.
     */
    fetchPage: (query: RemotePageQuery) => Promise<RemotePage<TData>>;
    /** Change it to fetch the current page again — a filter outside the table, a save elsewhere. */
    refreshKey?: unknown;
    /** Rows per page. Defaults to 10. */
    pageSize?: number;
    /**
     * The sizes the rows-per-page picker offers. Defaults to 10, 25, 50 and
     * 100; `false` draws no picker. Hidden anyway when every row fits the
     * smallest size.
     */
    pageSizeOptions?: number[] | false;
    /** End the picker with `Custom…`, a number field for any size. On by default. */
    allowCustomPageSize?: boolean;
    /** The largest page `Custom…` accepts. Defaults to 500. */
    maxPageSize?: number;
    /** How long typing must pause before the search is sent, in ms. Defaults to 300. */
    searchDebounceMs?: number;
    /** What a failed fetch says. Defaults to the error's message and a retry. */
    errorState?: (error: Error, retry: () => void) => React.ReactNode;
}
/**
 * A table whose rows live on a server: it asks `fetchPage` for one page at a
 * time — by page, size, sort, filters and search — and owns everything
 * around that ask: the debounce on typing, aborting a request a newer one
 * replaced, going back to the first page on a new search, filter or sort, the spinner while a page is
 * on its way (the last page stays under it), and the error with a retry.
 *
 * An edited cell is written into the page it is on once `onCellEdit` settles,
 * so the new value stays without a refetch.
 */
declare function RemotePaginatedTable<TData extends RowData>(props: RemotePaginatedTableProps<TData>): React.JSX.Element;

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    /**
     * Offer a rows-per-page picker with these sizes. Absent or `false`, there is
     * no picker. The current page size is always among them, so a `pageSize`
     * the list does not name still reads in the picker.
     */
    pageSizeOptions?: number[] | false;
    /** End the picker with `Custom…`, which opens a number field for any size. */
    allowCustomPageSize?: boolean;
    /** The largest size `Custom…` accepts; anything larger is taken as this. */
    maxPageSize?: number;
}
/**
 * The line under a paged table: which rows these are, how many to a page,
 * and the way to the pages either side.
 *
 * Quiet by default — a count, the size and a `RecordPager` — because it sits
 * under every paged table and is read far more often than it is used. The
 * picker only shows when a size could change what is on screen: when every
 * row already fits the smallest size, there is nothing to pick. A table whose
 * rows all fit on one page with nothing to pick draws nothing at all.
 */
declare function DataTablePagination<TData>({ table, pageSizeOptions, allowCustomPageSize, maxPageSize, }: DataTablePaginationProps<TData>): React.JSX.Element | null;

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    enableColumnVisibility?: boolean;
    enableColumnPinning?: boolean;
    /** A search box at the start of the row. Absent, there is none. */
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
    };
    /**
     * Filter chips after the search. With any, the row becomes a `FilterBar`:
     * search, chips, what the caller passes, then `summary` hard right.
     */
    filters?: {
        items: {
            filter: TableFilter<TData>;
            options: TableFilterOption[];
        }[];
        values: FilterValues;
        onChange: (values: FilterValues) => void;
    };
    /** What the filters left — `23 of 91 events`. Only drawn with `filters`. */
    summary?: React.ReactNode;
    children?: React.ReactNode;
}
declare function DataTableToolbar<TData>({ table, enableColumnVisibility, enableColumnPinning, search, filters, summary, children, }: DataTableToolbarProps<TData>): React.JSX.Element | null;

interface EditableCellProps<TData> {
    ctx: CellContext<TData, unknown>;
    editType?: EditType;
    options?: EditOption[];
    align?: 'left' | 'center' | 'right';
    onCellEdit?: CellEditHandler<TData>;
    /**
     * What opens the editor: a click (and `Enter`), or a double-click (and
     * `F2`) — which leaves a single click to the table's `onCellClick`.
     */
    trigger?: 'click' | 'dblclick';
}
/**
 * A cell that edits in place: click it (or `Enter` on it) — or, with
 * `trigger="dblclick"`, double-click it (or `F2`) — type, and `Enter`
 * or leaving the field saves; `Escape` puts it back. Focus returns to the
 * cell either way, so a keyboard reader can walk on with `Tab`.
 *
 * An empty number saves `null`, not `0`; a number that does not parse is not
 * saved. When `onCellEdit` returns a promise the cell shows the new value as
 * saving, and on a rejection restores the old one and says why.
 */
declare function EditableCell<TData>({ ctx, editType, options, align, onCellEdit, trigger, }: EditableCellProps<TData>): React.JSX.Element;

interface ApplyCellEditOptions<TData> {
    /**
     * Where a row keeps its children, for a nested table — the key `getSubRows`
     * reads (`children`). Without it only top-level rows are found.
     */
    subRowsKey?: string;
    /**
     * Find rows by id rather than by identity — for rows that have been
     * replaced since the edit began, such as a refetched page. Pass the table's
     * own `getRowId`.
     */
    getRowId?: (row: TData) => string;
}
/**
 * `rows` with one cell edit applied: the edited row copied with the new value
 * at its `field`, and each parent on the way to it copied — the rest untouched.
 * Returns `rows` itself when the row is not found, or the column names no
 * `field` to write.
 *
 * ```tsx
 * <PaginatedTable data={rows} onCellEdit={(edit) => setRows((r) => applyCellEdit(r, edit))} />
 * ```
 */
declare function applyCellEdit<TData>(rows: TData[], edit: CellEdit<TData>, { subRowsKey, getRowId }?: ApplyCellEditOptions<TData>): TData[];

export { type ApplyCellEditOptions, type CellEdit, type CellEditHandler, DataTable, DataTablePagination, type DataTableProps, DataTableToolbar, type EditOption, type EditType, EditableCell, type FilterValues, PaginatedTable, type PaginatedTableProps, type RemotePage, type RemotePageQuery, RemotePaginatedTable, type RemotePaginatedTableProps, type StreamMode, type TableBaseProps, type TableFilter, type TableFilterOption, type TableFilterProps, type TableStream, type TableStreamProps, applyCellEdit };
