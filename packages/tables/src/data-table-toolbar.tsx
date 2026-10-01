import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@invana/ui';
import { Settings2 } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  enableColumnVisibility?: boolean;
  enableColumnPinning?: boolean;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  enableColumnVisibility = true,
  enableColumnPinning = false,
  children,
}: DataTableToolbarProps<TData>) {
  const toggleableCols = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide());
  const showColumns = enableColumnVisibility && toggleableCols.length > 0;

  // Nothing to put in it: no row at all, or its padding opens a gap above
  // the header.
  if (!children && !showColumns) return null;

  // One row. What the caller passes takes the width; the column picker is a
  // named icon at the end, a setting of the table rather than a second
  // toolbar under the first.
  return (
    <div className="flex items-center gap-2">
      {/* A block, not a flex row: a block child (a `FilterBar`) fills the
          width, an inline one (a search, a segmented control) keeps its own. */}
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 items-center">
        {showColumns && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Columns"
                title="Columns"
              >
                <Settings2 aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {toggleableCols.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(v) => col.toggleVisibility(!!v)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {String(col.columnDef.header ?? col.id)}
                </DropdownMenuCheckboxItem>
              ))}
              {enableColumnPinning && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Pinning</DropdownMenuLabel>
                  {table.getAllLeafColumns().map((col) => {
                    if (!col.getCanPin()) return null;
                    const pinned = col.getIsPinned();
                    return (
                      <div
                        key={col.id}
                        className="flex items-center justify-between px-2 py-1"
                      >
                        <span className="capitalize truncate">
                          {String(col.columnDef.header ?? col.id)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              col.pin(pinned === 'left' ? false : 'left')
                            }
                            className={`rounded px-1.5 py-0.5 text-sm ${
                              pinned === 'left'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/70'
                            }`}
                          >
                            L
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              col.pin(pinned === 'right' ? false : 'right')
                            }
                            className={`rounded px-1.5 py-0.5 text-sm ${
                              pinned === 'right'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/70'
                            }`}
                          >
                            R
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
