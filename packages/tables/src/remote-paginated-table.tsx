import * as React from "react";
import type {
  PaginationState,
  RowData,
  SortingState,
} from "@tanstack/react-table";
import { Button, cn } from "@invana/ui";
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { activeFilterValues, filterOptions } from "./core/filters";
import {
  pickViewProps,
  type TableBaseProps,
  type TableFilterProps,
} from "./core/props";
import { TableGrid } from "./core/table-grid";
import { useControllable, useTableModel } from "./core/use-table-model";
import { applyCellEdit } from "./apply-cell-edit";
import type {
  CellEditHandler,
  FilterValues,
  RemotePage,
  RemotePageQuery,
} from "./types";

export interface RemotePaginatedTableProps<TData extends RowData>
  extends TableBaseProps<TData>,
    TableFilterProps<TData> {
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

type Settled<TData> = {
  /** Which query this answers; the table is loading until it matches the current one. */
  key: string;
  rows: TData[];
  total: number;
  error: Error | null;
};

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
export function RemotePaginatedTable<TData extends RowData>(
  props: RemotePaginatedTableProps<TData>,
) {
  const {
    fetchPage,
    refreshKey,
    onCellEdit,
    getRowId,
    toolbar,
    className,
    pageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    allowCustomPageSize = true,
    maxPageSize,
    searchable = true,
    searchPlaceholder,
    search: searchProp,
    onSearchChange,
    searchDebounceMs = 300,
    sorting: sortingProp,
    onSortingChange,
    defaultSorting,
    filters,
    filterValues: filterValuesProp,
    defaultFilterValues,
    onFiltersChange,
    noun,
    columns,
    errorState,
    emptyState,
    enableColumnVisibility = true,
    enableColumnPinning = false,
  } = props;

  const fetchRef = React.useRef(fetchPage);
  React.useLayoutEffect(() => {
    fetchRef.current = fetchPage;
  });

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });
  const [sorting, setSortingState] = useControllable<SortingState>(
    sortingProp,
    onSortingChange,
    defaultSorting ?? [],
  );
  const setSorting: typeof setSortingState = (updater) => {
    setSortingState(updater);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  const [internalFilters, setInternalFilters] = React.useState<FilterValues>(
    defaultFilterValues ?? {},
  );
  const filterValues = filterValuesProp ?? internalFilters;
  const setFilterValues = (values: FilterValues) => {
    onFiltersChange?.(values);
    if (filterValuesProp === undefined) setInternalFilters(values);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };
  const sentFilters = activeFilterValues(filterValues);

  // The box shows every keystroke; the server hears the text once typing
  // pauses, and a new search starts from the first page.
  const [internalTyped, setInternalTyped] = React.useState("");
  const typed = searchProp ?? internalTyped;
  const setTyped = (value: string) => {
    onSearchChange?.(value);
    if (searchProp === undefined) setInternalTyped(value);
  };
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const t = setTimeout(() => setSearch(typed.trim()), searchDebounceMs);
    return () => clearTimeout(t);
  }, [typed, searchDebounceMs]);
  const [pagedSearch, setPagedSearch] = React.useState(search);
  if (search !== pagedSearch) {
    setPagedSearch(search);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }

  // A new `refreshKey`, or a retry, asks for the same page again.
  const [reloads, setReloads] = React.useState(0);
  const [seenRefreshKey, setSeenRefreshKey] = React.useState(refreshKey);
  if (refreshKey !== seenRefreshKey) {
    setSeenRefreshKey(refreshKey);
    setReloads((n) => n + 1);
  }
  const retry = React.useCallback(() => setReloads((n) => n + 1), []);

  const key = JSON.stringify([
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    search,
    sentFilters,
    reloads,
  ]);
  const [settled, setSettled] = React.useState<Settled<TData>>({
    key: "",
    rows: [],
    total: 0,
    error: null,
  });
  const loading = settled.key !== key;

  React.useEffect(() => {
    const controller = new AbortController();
    fetchRef
      .current({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        search,
        filters: sentFilters,
        signal: controller.signal,
      })
      .then(
        (page) => {
          if (controller.signal.aborted) return;
          setSettled({ key, rows: page.rows, total: page.total, error: null });
        },
        (error: unknown) => {
          if (controller.signal.aborted) return;
          setSettled((prev) => ({
            ...prev,
            key,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
        },
      );
    return () => controller.abort();
    // `key` is every input above, serialised.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const error = loading ? null : settled.error;
  const rows = error ? [] : settled.rows;

  const handleCellEdit: CellEditHandler<TData> | undefined = onCellEdit
    ? (edit) => {
        // Matched by id when the caller names one, so a page refetched while
        // the save was in flight still takes the edit.
        const write = () =>
          setSettled((prev) => ({
            ...prev,
            rows: applyCellEdit(prev.rows, edit, { getRowId: idOf }),
          }));
        const result = onCellEdit(edit);
        if (result && typeof (result as Promise<unknown>).then === "function") {
          return (result as Promise<unknown>).then((v) => {
            write();
            return v;
          });
        }
        write();
        return result;
      }
    : undefined;

  const idOf = getRowId ? (row: TData) => getRowId(row, 0) : undefined;
  const table = useTableModel({
    ...props,
    data: rows,
    onCellEdit: handleCellEdit,
    sorting,
    onSortingChange: setSorting,
    manualSorting: true,
    // The server searches; the model must not filter the page again.
    search: undefined,
    paging: {
      mode: "server",
      state: pagination,
      onChange: setPagination,
      rowCount: settled.total,
    },
  });

  const shownError = error ? (
    errorState ? (
      errorState(error, retry)
    ) : (
      <span className="inline-flex items-baseline gap-2 text-destructive">
        Could not load: {error.message}
        <Button type="button" variant="link" size="xs" className="h-auto p-0" onClick={retry}>
          Retry
        </Button>
      </span>
    )
  ) : null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <DataTableToolbar
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        enableColumnPinning={enableColumnPinning}
        search={
          searchable
            ? { value: typed, onChange: setTyped, placeholder: searchPlaceholder }
            : undefined
        }
        filters={
          filters?.length
            ? {
                // Named choices; without them, what the page in hand holds.
                items: filters.map((filter) => ({
                  filter,
                  options: filterOptions(filter, columns, rows),
                })),
                values: filterValues,
                onChange: setFilterValues,
              }
            : undefined
        }
        summary={`${settled.total.toLocaleString()}${noun ? ` ${noun}` : ""}`}
      >
        {toolbar}
      </DataTableToolbar>

      <TableGrid
        table={table}
        loading={loading}
        {...pickViewProps(props)}
        emptyState={shownError ?? emptyState}
      />

      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        allowCustomPageSize={allowCustomPageSize}
        maxPageSize={maxPageSize}
      />
    </div>
  );
}
