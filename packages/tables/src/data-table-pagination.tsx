import * as React from 'react';
import { RecordPager } from '@invana/ui';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@invana/forms';
import type { Table } from '@tanstack/react-table';

/** What a paged table offers when the caller names no sizes. */
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/** The largest page a custom size may ask for, unless the table says otherwise. */
export const DEFAULT_MAX_PAGE_SIZE = 500;

const CUSTOM = 'custom';

export interface DataTablePaginationProps<TData> {
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
export function DataTablePagination<TData>({
  table,
  pageSizeOptions,
  allowCustomPageSize = false,
  maxPageSize = DEFAULT_MAX_PAGE_SIZE,
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

  const [customOpen, setCustomOpen] = React.useState(false);

  const sizes = pageSizeOptions
    ? [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b)
    : [];
  const showPicker = sizes.length > 0 && total > sizes[0];

  if (pageCount <= 1 && !showPicker) return null;

  const commitCustom = (raw: string) => {
    setCustomOpen(false);
    const n = Math.floor(Number(raw));
    if (!Number.isFinite(n) || n < 1) return;
    table.setPageSize(Math.min(n, maxPageSize));
  };

  return (
    <div className="flex items-center justify-between gap-4 px-2 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {total === 0 ? 'No rows' : `${start}–${end} of ${total}`}
      </span>
      <div className="flex items-center gap-4">
        {showPicker ? (
          <label className="flex items-center gap-2">
            <span>Rows</span>
            {customOpen ? (
              <Input
                autoFocus
                type="number"
                inputSize="sm"
                min={1}
                max={maxPageSize}
                aria-label="Rows per page"
                defaultValue={pageSize}
                className="w-16 tabular-nums"
                onFocus={(e) => e.currentTarget.select()}
                onBlur={(e) => commitCustom(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commitCustom(e.currentTarget.value);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    setCustomOpen(false);
                  }
                }}
              />
            ) : (
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  if (v === CUSTOM) setCustomOpen(true);
                  else table.setPageSize(Number(v));
                }}
              >
                <SelectTrigger
                  triggerSize="sm"
                  className="w-16 tabular-nums"
                  aria-label="Rows per page"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                  {allowCustomPageSize ? (
                    <SelectItem value={CUSTOM}>Custom…</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            )}
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
