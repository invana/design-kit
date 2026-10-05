import fixture from '../../../../fixtures/themes/dataset-studio.json';

/**
 * The studio's data, typed: what the research finds (rows, sources, conflicts), the model the
 * assistant proposes, and the assistant's words. All of it is fictional sample data.
 */

export type ColumnType = 'text' | 'number';
export type Value = string | number;

export interface StudioColumn {
  key: string;
  label: string;
  type: ColumnType;
  /** Added after the research — by a preset or by hand. */
  custom?: boolean;
  /** The source every value of an added column came from. */
  source?: number;
}

export interface StudioRow {
  id: string;
  /** The sources the row was read from. */
  src: number[];
  [column: string]: Value | number[];
}

export interface Source {
  title: string;
  host: string;
  kind: string;
}

/** One value a source gives for a cell. */
export interface ConflictOption {
  value: Value;
  source: number;
}

export interface ModelProp {
  name: string;
  column: string;
}
export interface ModelNode {
  label: string;
  key: string;
  props: ModelProp[];
}
export interface ModelRel {
  from: string;
  type: string;
  to: string;
}
export interface GraphModel {
  nodes: ModelNode[];
  rels: ModelRel[];
}

export interface Preset {
  name: string;
  type: ColumnType;
  /** The research column it stands for. */
  column?: string;
  /** Its value by the row's type. */
  values?: Record<string, Value>;
  /** Its values, one per row in turn. */
  cycle?: Value[];
}

export const DATA = fixture as unknown as {
  workspace: string;
  agent: { name: string; version: string; model: string };
  budget: { used: number; limit: number };
  stages: string[];
  columns: StudioColumn[];
  proposedOff: string[];
  sources: Record<string, Source>;
  retrieved: string;
  rows: StudioRow[];
  droughtSource: number;
  conflicts: Record<string, ConflictOption[]>;
  presets: Preset[];
  model: GraphModel;
  palette: Record<string, string>;
  suggestions: Record<string, string[]>;
  copy: Record<string, string> & { need: Record<string, string> };
};

export const COPY = DATA.copy;

/** The assistant's words with `{name}` filled in. */
export function say(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''));
}

/** `1 conflict`, `3 conflicts`. */
export const plural = (n: number, word: string, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

export const sourceOf = (id: number) => DATA.sources[String(id)]!;
