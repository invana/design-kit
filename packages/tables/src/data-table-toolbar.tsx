import * as React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  FilterBar,
  MultiFilterChip,
  SearchInput,
} from '@invana/ui';
import { Settings2 } from 'lucide-react';
import type { Column, Table } from '@tanstack/react-table';
import type { FilterValues, TableFilter, TableFilterOption } from './types';

export interface DataTableToolbarProps<TData> {
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
    items: { filter: TableFilter<TData>; options: TableFilterOption[] }[];
    values: FilterValues;
    onChange: (values: FilterValues) => void;
  };
  /** What the filters left — `23 of 91 events`. Only drawn with `filters`. */
  summary?: React.ReactNode;
  children?: React.ReactNode;
}

/** A column's name in the picker: its header when that is text, else its id. */
function columnLabel<TData>(column: Column<TData, unknown>): string {
  const header = column.columnDef.header;
  return typeof header === 'string' && header !== '' ? header : column.id;
}

const PIN_OPTIONS = [
  { value: 'none', label: 'Not pinned' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
] as const;

export function DataTableToolbar<TData>({
  table,
  enableColumnVisibility = true,
  enableColumnPinning = false,
  search,
  filters,
  summary,
  children,
}: DataTableToolbarProps<TData>) {
  const leafColumns = table.getAllLeafColumns();
  const toggleableCols = leafColumns.filter((c) => c.getCanHide());
  const pinnableCols = enableColumnPinning
    ? leafColumns.filter((c) => c.getCanPin())
    : [];
  const showVisibility = enableColumnVisibility && toggleableCols.length > 0;
  const showMenu = showVisibility || pinnableCols.length > 0;

  // Nothing to put in it: no row at all, or its padding opens a gap above
  // the header.
  const chips = filters?.items.length ? filters.items : null;
  if (!children && !showMenu && !search && !chips) return null;

  const searchBox = search ? (
    <SearchInput
      inputSize="sm"
      className="w-56 shrink-0"
      aria-label={search.placeholder ?? 'Search'}
      placeholder={search.placeholder ?? 'Search…'}
      value={search.value}
      onChange={search.onChange}
    />
  ) : null;

  const menu = showMenu ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="shrink-0"
          aria-label="Columns"
          title="Columns"
        >
          <Settings2 aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showVisibility && (
          <>
            <DropdownMenuLabel>Show columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {toggleableCols.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(v) => col.toggleVisibility(!!v)}
                onSelect={(e) => e.preventDefault()}
              >
                {columnLabel(col)}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
        {pinnableCols.length > 0 && (
          <>
            {showVisibility && <DropdownMenuSeparator />}
            <DropdownMenuLabel>Pin columns</DropdownMenuLabel>
            {pinnableCols.map((col) => (
              <DropdownMenuSub key={col.id}>
                <DropdownMenuSubTrigger>{columnLabel(col)}</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={col.getIsPinned() || 'none'}
                    onValueChange={(v) =>
                      col.pin(v === 'left' || v === 'right' ? v : false)
                    }
                  >
                    {PIN_OPTIONS.map((o) => (
                      <DropdownMenuRadioItem
                        key={o.value}
                        value={o.value}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {o.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  // With filters, one `FilterBar`: the search, a chip per filter, what the
  // caller passes, and the count of what is left hard right; the column
  // picker after it, a setting of the table rather than a filter.
  if (chips && filters) {
    return (
      <div className="flex items-center gap-2">
        <FilterBar seamless className="min-w-0 flex-1" summary={summary}>
          {searchBox}
          {chips.map(({ filter, options }) => (
            <MultiFilterChip
              key={filter.id}
              label={filter.label}
              options={options}
              multiple={!filter.single}
              value={filters.values[filter.id] ?? []}
              onChange={(picked) =>
                filters.onChange({ ...filters.values, [filter.id]: picked })
              }
            />
          ))}
          {children}
        </FilterBar>
        {menu}
      </div>
    );
  }

  // One row: the search, then what the caller passes, which takes the width;
  // the column picker is a named icon at the end, a setting of the table
  // rather than a second toolbar under the first.
  return (
    <div className="flex items-center gap-2">
      {searchBox}
      {/* A block, not a flex row: a block child (a `FilterBar`) fills the
          width, an inline one (a segmented control) keeps its own. */}
      <div className="min-w-0 flex-1">{children}</div>
      {menu}
    </div>
  );
}
