import * as React from "react";
import type {
  OnChangeFn,
  PaginationState,
  RowData,
} from "@tanstack/react-table";
import { cn } from "@invana/ui";
import {
  DataTablePagination,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { applyFilters, filterOptions } from "./core/filters";
import {
  pickViewProps,
  type TableBaseProps,
  type TableFilterProps,
} from "./core/props";
import type { FilterValues } from "./types";
import { TableGrid } from "./core/table-grid";
import { useControllable, useTableModel } from "./core/use-table-model";

export interface PaginatedTableProps<TData extends RowData>
  extends TableBaseProps<TData>,
    TableFilterProps<TData> {
  /** Every row; the table searches and pages them itself. */
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
export function PaginatedTable<TData extends RowData>(
  props: PaginatedTableProps<TData>,
) {
  const {
    data,
    loading,
    toolbar,
    className,
    pageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    allowCustomPageSize = true,
    maxPageSize,
    pagination: paginationProp,
    onPaginationChange,
    searchable = true,
    searchPlaceholder,
    searchColumns,
    search: searchProp,
    onSearchChange,
    filters,
    filterValues: filterValuesProp,
    defaultFilterValues,
    onFiltersChange,
    noun,
    columns,
    getSubRows,
    onSortingChange,
    enableColumnVisibility = true,
    enableColumnPinning = false,
  } = props;

  const [pagination, setPagination] = useControllable<PaginationState>(
    paginationProp,
    onPaginationChange,
    { pageIndex: 0, pageSize },
  );
  const [internalSearch, setInternalSearch] = React.useState("");
  const search = searchProp ?? internalSearch;
  const setSearch = (value: string) => {
    onSearchChange?.(value);
    if (searchProp === undefined) setInternalSearch(value);
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
  const rows = React.useMemo(
    () => applyFilters(data, filters ?? [], filterValues, columns, getSubRows),
    [data, filters, filterValues, columns, getSubRows],
  );
  // The choices come from every row, not the filtered ones, so picking one
  // never takes the others off the menu.
  const filterItems = React.useMemo(
    () =>
      (filters ?? []).map((filter) => ({
        filter,
        options: filterOptions(filter, columns, data, getSubRows),
      })),
    [filters, columns, data, getSubRows],
  );

  const table = useTableModel({
    ...props,
    data: rows,
    onSortingChange: (updater) => {
      onSortingChange?.(updater);
      setPagination((p) => ({ ...p, pageIndex: 0 }));
    },
    paging: { mode: "client", state: pagination, onChange: setPagination },
    search: { value: search, columns: searchColumns },
  });

  // Rows can go — a filter outside the table, a deletion — and leave the
  // page past the end. Step back to the last page there is.
  const lastPage = Math.max(table.getPageCount() - 1, 0);
  React.useEffect(() => {
    if (pagination.pageIndex > lastPage) {
      setPagination((p) => ({ ...p, pageIndex: lastPage }));
    }
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <DataTableToolbar
        table={table}
        enableColumnVisibility={enableColumnVisibility}
        enableColumnPinning={enableColumnPinning}
        search={
          searchable
            ? { value: search, onChange: setSearch, placeholder: searchPlaceholder }
            : undefined
        }
        filters={
          filterItems.length
            ? { items: filterItems, values: filterValues, onChange: setFilterValues }
            : undefined
        }
        summary={`${table.getFilteredRowModel().rows.length} of ${data.length}${noun ? ` ${noun}` : ""}`}
      >
        {toolbar}
      </DataTableToolbar>

      <TableGrid table={table} loading={loading} {...pickViewProps(props)} />

      <DataTablePagination
        table={table}
        pageSizeOptions={pageSizeOptions}
        allowCustomPageSize={allowCustomPageSize}
        maxPageSize={maxPageSize}
      />
    </div>
  );
}
