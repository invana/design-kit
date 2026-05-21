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

  return (
    <div className="flex items-center justify-between gap-2 px-2 py-2">
      <div className="flex items-center gap-2">{children}</div>
      <div className="flex items-center gap-2">
        {enableColumnVisibility && toggleableCols.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns
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
                        className="flex items-center justify-between px-2 py-1 text-sm"
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
                            className={`rounded px-1.5 py-0.5 text-xs ${
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
                            className={`rounded px-1.5 py-0.5 text-xs ${
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
