import type { Call, OpSet } from '../../playbook/playbook';
import type { ConflictOption, StudioColumn, StudioRow, Value } from '../data';

/**
 * What the dataset can be told. A cell is named `row.column` — `r3.yield` — by the row's id
 * and the column's key. Every value keeps where it came from: a picked conflict its source,
 * a value typed by the reader an edit mark.
 */

export interface DatasetState {
  name: string;
  /** `draft`, then `v1`, `v2`… as it is saved. */
  version: string;
  saved: boolean;
  description: string;
  /** Every saved version, `Chickpea varieties v1`, oldest first. */
  versions: string[];
  citations: boolean;
  columns: StudioColumn[];
  rows: StudioRow[];
  /** Cells whose sources disagree, by `row.column`. */
  conflicts: Record<string, ConflictOption[]>;
  /** The source a resolved conflict was settled on, by `row.column`. */
  picked: Record<string, number>;
  /** Cells the reader changed, by `row.column`. */
  edits: Record<string, true>;
}

export const EMPTY_DATASET: DatasetState = {
  name: 'Chickpea varieties',
  version: 'draft',
  saved: false,
  description: '',
  versions: [],
  citations: true,
  columns: [],
  rows: [],
  conflicts: {},
  picked: {},
  edits: {},
};

export const DATASET_OPS = ['setColumns', 'upsertRows', 'setConflicts', 'addColumn', 'resolve', 'setCell', 'save'] as const;

export const cellKey = (row: string, column: string) => `${row}.${column}`;

/** The version the next save makes. */
export const nextVersion = (s: DatasetState) => (s.saved ? `v${Number(s.version.slice(1)) + 1}` : 'v1');

const isText = (v: unknown): v is string => typeof v === 'string';
const isValue = (v: unknown): v is Value => typeof v === 'string' || typeof v === 'number';

function check({ op, args = {} }: Call): string[] {
  const p: string[] = [];
  if (op === 'setColumns' && !Array.isArray(args.columns)) p.push('`columns` must be a list');
  if (op === 'upsertRows' && !Array.isArray(args.rows)) p.push('`rows` must be a list');
  if (op === 'setConflicts' && (typeof args.conflicts !== 'object' || args.conflicts == null)) p.push('`conflicts` must be an object');
  if (op === 'addColumn') {
    if (!args.column || !isText((args.column as StudioColumn).key)) p.push('`column` needs a `key`');
    if (typeof args.values !== 'object') p.push('`values` must be an object by row id');
  }
  if (op === 'resolve' || op === 'setCell') {
    if (!isText(args.row)) p.push('`row` must be a row id');
    if (!isText(args.column)) p.push('`column` must be a column key');
    if (!isValue(args.value)) p.push('`value` must be text or a number');
  }
  if (op === 'resolve' && typeof args.source !== 'number') p.push('`source` must be a source number');
  if (op === 'save' && !(isText(args.name) && args.name.trim())) p.push('`name` must not be empty');
  return p;
}

function withoutKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  const rest = { ...record };
  delete rest[key];
  return rest;
}

function setValue(s: DatasetState, row: string, column: string, value: Value): StudioRow[] {
  if (!s.rows.some((r) => r.id === row)) throw new Error(`no row "${row}"`);
  return s.rows.map((r) => (r.id === row ? { ...r, [column]: value } : r));
}

function apply(s: DatasetState, { op, args = {} }: Call): DatasetState {
  switch (op) {
    case 'setColumns':
      return { ...s, columns: args.columns as StudioColumn[] };
    case 'upsertRows': {
      const incoming = args.rows as StudioRow[];
      const byId = new Map(incoming.map((r) => [r.id, r]));
      const known = new Set(s.rows.map((r) => r.id));
      return {
        ...s,
        rows: [...s.rows.map((r) => (byId.has(r.id) ? { ...r, ...byId.get(r.id) } : r)), ...incoming.filter((r) => !known.has(r.id))],
      };
    }
    case 'setConflicts': {
      // Only the cells of columns the dataset has.
      const columns = new Set(s.columns.map((c) => c.key));
      const all = args.conflicts as Record<string, ConflictOption[]>;
      return { ...s, conflicts: Object.fromEntries(Object.entries(all).filter(([k]) => columns.has(k.split('.')[1]!))) };
    }
    case 'addColumn': {
      const column = args.column as StudioColumn;
      if (s.columns.some((c) => c.key === column.key)) throw new Error(`column "${column.key}" is there already`);
      const values = args.values as Record<string, Value>;
      return { ...s, columns: [...s.columns, column], rows: s.rows.map((r) => ({ ...r, [column.key]: values[r.id] ?? '' })) };
    }
    case 'resolve': {
      const { row, column, value, source } = args as { row: string; column: string; value: Value; source: number };
      const key = cellKey(row, column);
      return {
        ...s,
        rows: setValue(s, row, column, value),
        conflicts: withoutKey(s.conflicts, key),
        picked: { ...s.picked, [key]: source },
      };
    }
    case 'setCell': {
      const { row, column, value } = args as { row: string; column: string; value: Value };
      const key = cellKey(row, column);
      return { ...s, rows: setValue(s, row, column, value), conflicts: withoutKey(s.conflicts, key), edits: { ...s.edits, [key]: true } };
    }
    case 'save': {
      const { name, description = '', citations = true } = args as { name: string; description?: string; citations?: boolean };
      const version = nextVersion(s);
      return { ...s, name, description, citations, version, saved: true, versions: [...s.versions, `${name} ${version}`] };
    }
  }
  return s;
}

export const datasetOps: OpSet<DatasetState> = { kind: 'dataset', ops: DATASET_OPS, check, apply };

/** What a cell is: where its value came from, as the table and the provenance panel say it. */
export type CellStatus =
  | { status: 'ok'; confidence: number; sources: number[] }
  | { status: 'conflict'; options: ConflictOption[] }
  | { status: 'edited' }
  | { status: 'missing' }
  | { status: 'manual' };

export function cellStatus(s: DatasetState, row: StudioRow, columnKey: string): CellStatus {
  const key = cellKey(row.id, columnKey);
  const column = s.columns.find((c) => c.key === columnKey);
  const value = row[columnKey];
  if (s.edits[key]) return { status: 'edited' };
  if (s.conflicts[key]) return { status: 'conflict', options: s.conflicts[key]! };
  if (s.picked[key] != null) return { status: 'ok', confidence: 0.9, sources: [s.picked[key]!] };
  if (column?.custom) {
    if (column.source != null && value !== '') return { status: 'ok', confidence: 0.78, sources: [column.source] };
    return value === '' || value == null ? { status: 'missing' } : { status: 'manual' };
  }
  if (value === '' || value == null) return { status: 'missing' };
  const sources = column?.source != null ? [column.source] : row.src;
  return { status: 'ok', confidence: sources.length > 1 ? 0.94 : 0.78, sources };
}

/** How many sources the dataset rests on. */
export function sourceCount(s: DatasetState): number {
  const all = new Set<number>();
  s.rows.forEach((r) => r.src.forEach((x) => all.add(x)));
  s.columns.forEach((c) => c.source != null && all.add(c.source));
  return all.size;
}
