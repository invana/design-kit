import type { RowData } from "@tanstack/react-table";
import type { TableBaseProps } from "./props";
import type { FilterValues, TableFilter, TableFilterOption } from "../types";

type Columns<TData extends RowData> = TableBaseProps<TData>["columns"];

/** A row's value in a column, read the way the column reads it. */
export function readColumnValue<TData extends RowData>(
  columns: Columns<TData>,
  columnId: string,
  row: TData,
  index: number,
): unknown {
  for (const col of columns) {
    const def = col as {
      id?: string;
      accessorKey?: unknown;
      accessorFn?: (row: TData, index: number) => unknown;
    };
    const key = def.accessorKey != null ? String(def.accessorKey) : undefined;
    if (def.id !== columnId && key !== columnId) continue;
    if (def.accessorFn) return def.accessorFn(row, index);
    if (key) {
      return key
        .split(".")
        .reduce<unknown>(
          (v, part) => (v == null ? v : (v as Record<string, unknown>)[part]),
          row,
        );
    }
  }
  // No column by that id: read the field of the same name.
  return (row as Record<string, unknown>)[columnId];
}

/** The filters that narrow anything — those with at least one pick. */
export function activeFilterValues(values: FilterValues): FilterValues {
  return Object.fromEntries(
    Object.entries(values).filter(([, picked]) => picked.length > 0),
  );
}

/** A filter's choices: its own, or every distinct value of its column in `data`. */
export function filterOptions<TData extends RowData>(
  filter: TableFilter<TData>,
  columns: Columns<TData>,
  data: TData[],
  getSubRows?: (row: TData) => TData[] | undefined,
): TableFilterOption[] {
  if (filter.options) return filter.options;
  const seen = new Set<string>();
  const visit = (rows: TData[]) =>
    rows.forEach((row, i) => {
      const v = readColumnValue(columns, filter.columnId ?? filter.id, row, i);
      if (v != null && v !== "") seen.add(String(v));
      const children = getSubRows?.(row);
      if (children) visit(children);
    });
  visit(data);
  return [...seen].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * The rows every set filter lets through. Within a filter any pick matches;
 * across filters all must. In a nested table a row also stays when anything
 * under it passes, so a match deep down keeps the rows that lead to it.
 */
export function applyFilters<TData extends RowData>(
  data: TData[],
  filters: TableFilter<TData>[],
  values: FilterValues,
  columns: Columns<TData>,
  getSubRows?: (row: TData) => TData[] | undefined,
): TData[] {
  const active = filters.filter((f) => (values[f.id]?.length ?? 0) > 0);
  if (!active.length) return data;

  const passes = (row: TData, index: number) =>
    active.every((f) => {
      const picked = values[f.id];
      if (f.match) return f.match(row, picked);
      const v = readColumnValue(columns, f.columnId ?? f.id, row, index);
      return v != null && picked.includes(String(v));
    });
  const keeps = (row: TData, index: number): boolean =>
    passes(row, index) || (getSubRows?.(row) ?? []).some(keeps);

  return data.filter(keeps);
}
