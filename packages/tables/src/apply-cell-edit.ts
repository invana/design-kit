import type { CellEdit } from './types';

/**
 * `obj` with `value` at `path` (`a.b.c`), copying each object on the way down
 * and nothing else — so React sees a new row and new parents, and every
 * untouched branch keeps its identity.
 */
export function setAtPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split('.');
  const source = (obj ?? {}) as Record<string, unknown>;
  return {
    ...source,
    [head]: rest.length ? setAtPath(source[head], rest.join('.'), value) : value,
  } as T;
}

export interface ApplyCellEditOptions<TData> {
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
export function applyCellEdit<TData>(
  rows: TData[],
  edit: CellEdit<TData>,
  { subRowsKey, getRowId }: ApplyCellEditOptions<TData> = {},
): TData[] {
  if (edit.field === undefined) return rows;
  const chain = [...edit.ancestors, edit.row];
  const same = (a: TData, b: TData) =>
    getRowId ? getRowId(a) === getRowId(b) : a === b;

  const walk = (list: TData[], depth: number): TData[] => {
    const target = chain[depth];
    const i = list.findIndex((r) => same(r, target));
    if (i < 0) return list;
    let next: TData;
    if (depth === chain.length - 1) {
      // Written into the row found, not `updatedRow`: matched by id, that row
      // may be newer than the one the edit began on.
      next = setAtPath(list[i], edit.field as string, edit.value);
    } else {
      const found = list[i] as Record<string, unknown>;
      const children = subRowsKey ? (found[subRowsKey] as TData[] | undefined) : undefined;
      if (!subRowsKey || !Array.isArray(children)) return list;
      const updated = walk(children, depth + 1);
      if (updated === children) return list;
      next = { ...found, [subRowsKey]: updated } as TData;
    }
    const copy = list.slice();
    copy[i] = next;
    return copy;
  };

  return walk(rows, 0);
}
