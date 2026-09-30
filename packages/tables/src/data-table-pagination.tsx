import { RecordPager } from '@invana/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';
import type { Table } from '@tanstack/react-table';

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  /**
   * Offer a rows-per-page picker with these sizes. Absent, there is no picker:
   * most tables have one right page size, and a control nobody changes is
   * noise under every one of them.
   */
  pageSizeOptions?: number[];
}

/**
 * The line under a paged table: which rows these are, and the way to the
 * pages either side.
 *
 * Quiet by default — a count and a `RecordPager` — because it sits under every
 * paged table and is read far more often than it is used. A table whose rows
 * all fit on one page, with no size to pick, draws nothing at all: `8 of 8`
 * and two disabled arrows say nothing the rows did not.
 */
export function DataTablePagination<TData>({
  table,
  pageSizeOptions,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const serverRowCount = table.options.rowCount;
  const total =
    typeof serverRowCount === 'number'
      ? serverRowCount
      : table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(table.getPageCount(), 1);
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  if (pageCount <= 1 && !pageSizeOptions?.length) return null;

  return (
    <div className="flex items-center justify-between gap-4 px-2 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {total === 0 ? 'No rows' : `${start}–${end} of ${total}`}
      </span>
      <div className="flex items-center gap-4">
        {pageSizeOptions?.length ? (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-6 w-[64px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        ) : null}
        <RecordPager
          className="tabular-nums"
          position={`page ${pageIndex + 1} of ${pageCount}`}
          previousLabel="Previous page"
          nextLabel="Next page"
          onPrevious={
            table.getCanPreviousPage() ? () => table.previousPage() : undefined
          }
          onNext={table.getCanNextPage() ? () => table.nextPage() : undefined}
        />
      </div>
    </div>
  );
}
