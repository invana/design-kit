import type { MarkTone } from '@invana/ui';

import type { Call, OpSet } from './playbook';

/**
 * What a table can be told — the table's own op set, prototyped in the story. In the RFC it
 * ships with `DataTable` in `@invana/tables`; the playbook never reads past `ops` and `check`.
 */

type Row = Record<string, unknown>;

/** A row — or, with `column`, one cell — called out, and why. */
export interface TableMark {
  /** The row's `rowKey` value. */
  row: string;
  column?: string;
  tone?: MarkTone;
  /** Why — a popover on the cell, or on the row's first cell. */
  note?: string;
  /** The note opens when the step that sets it is played. */
  open?: boolean;
}

export interface TableState {
  rowKey: string;
  rows: Row[];
  marks: TableMark[];
}

export const TABLE_OPS = ['setRows', 'upsertRows', 'removeRows', 'setCell', 'mark', 'unmark'] as const;

export class TableCallError extends Error {}

/** A cell's value as the text a row is named by — a toned cell names by its value. */
export function keyText(cell: unknown): string {
  if (cell && typeof cell === 'object' && 'value' in cell) return String((cell as { value: unknown }).value);
  return String(cell);
}

const isList = (v: unknown): v is unknown[] => Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === 'string';

function check({ op, args = {} }: Call): string[] {
  const problems: string[] = [];
  if ((op === 'setRows' || op === 'upsertRows') && !isList(args.rows)) problems.push('`rows` must be a list');
  if (op === 'upsertRows' && args.keep !== undefined && !(Number.isInteger(args.keep) && (args.keep as number) > 0))
    problems.push('`keep` must be a positive whole number');
  if (op === 'removeRows' && !(isList(args.keys) && args.keys.every(isText))) problems.push('`keys` must be a list of row keys');
  if (op === 'setCell') {
    if (!isText(args.row)) problems.push('`row` must be a row key');
    if (!isText(args.column)) problems.push('`column` must be a column key');
    if (!('value' in args)) problems.push('`value` is missing');
  }
  if (op === 'mark' && !(isList(args.marks) && args.marks.every((m) => m && isText((m as TableMark).row))))
    problems.push('`marks` must be a list of marks, each with a `row`');
  if (op === 'unmark' && args.column !== undefined && args.row === undefined) problems.push('`column` needs a `row`');
  return problems;
}

const sameSpot = (a: TableMark, b: TableMark) => a.row === b.row && (a.column ?? null) === (b.column ?? null);

function apply(s: TableState, { op, args = {} }: Call): TableState {
  const key = (r: Row) => keyText(r[s.rowKey]);
  switch (op) {
    case 'setRows':
      return { ...s, rows: args.rows as Row[] };
    case 'upsertRows': {
      const incoming = new Map((args.rows as Row[]).map((r) => [key(r), r]));
      const rows = s.rows.map((r) => (incoming.has(key(r)) ? { ...r, ...incoming.get(key(r)) } : r));
      const known = new Set(s.rows.map(key));
      const all = [...rows, ...(args.rows as Row[]).filter((r) => !known.has(key(r)))];
      // `keep` bounds a live feed: the last N rows stay.
      return { ...s, rows: typeof args.keep === 'number' ? all.slice(-args.keep) : all };
    }
    case 'removeRows': {
      const gone = new Set(args.keys as string[]);
      return { ...s, rows: s.rows.filter((r) => !gone.has(key(r))), marks: s.marks.filter((m) => !gone.has(m.row)) };
    }
    case 'setCell': {
      const { row, column, value } = args as { row: string; column: string; value: unknown };
      if (!s.rows.some((r) => key(r) === row)) throw new TableCallError(`no row "${row}"`);
      return { ...s, rows: s.rows.map((r) => (key(r) === row ? { ...r, [column]: value } : r)) };
    }
    case 'mark': {
      // A mark replaces the one on the same row and column.
      const next = args.marks as TableMark[];
      return { ...s, marks: [...s.marks.filter((m) => !next.some((n) => sameSpot(m, n))), ...next] };
    }
    case 'unmark': {
      // No args clears every mark; a row clears that row's; a row and a column, that cell's.
      const { row, column } = args as { row?: string; column?: string };
      if (row === undefined) return { ...s, marks: [] };
      return { ...s, marks: s.marks.filter((m) => m.row !== row || (column !== undefined && m.column !== column)) };
    }
  }
  return s;
}

export const tableOps: OpSet<TableState> = { kind: 'table', ops: TABLE_OPS, check, apply };
