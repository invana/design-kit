import type { Call, OpSet } from '../../playbook/playbook';
import type { GraphModel, StudioRow, Value } from '../data';

/**
 * The imported graph, and what each canvas shows of it. The graph is built by the import (the
 * API) and sent whole; a canvas is told which of its nodes to show.
 */

export interface GraphNodeRecord {
  /** `Variety:Anvaya`. */
  id: string;
  label: string;
  name: string;
  props: Record<string, Value>;
  /** The dataset rows it came from. */
  rows: string[];
}
export interface GraphEdgeRecord {
  source: string;
  target: string;
  type: string;
  /** The dataset row it came from, and the column that named its far end. */
  row: string;
  column: string;
}
export interface Skipped {
  row: string;
  column: string;
  rel: string;
}
export interface Graph {
  nodes: Record<string, GraphNodeRecord>;
  edges: GraphEdgeRecord[];
  skipped: Skipped[];
}

export interface GraphState {
  graph: Graph | null;
}
export const EMPTY_GRAPH: GraphState = { graph: null };

export const GRAPH_OPS = ['import'] as const;

export const graphOps: OpSet<GraphState> = {
  kind: 'graph',
  ops: GRAPH_OPS,
  check: ({ args = {} }) => (args.graph && typeof args.graph === 'object' ? [] : ['`graph` must be the built graph']),
  apply: (_s, { args = {} }: Call) => ({ graph: args.graph as Graph }),
};

/** What one canvas shows: node ids of the graph. */
export interface CanvasState {
  ids: string[];
}
export const EMPTY_CANVAS: CanvasState = { ids: [] };

export const CANVAS_OPS = ['load', 'clear'] as const;

export const canvasOps: OpSet<CanvasState> = {
  kind: 'canvas',
  ops: CANVAS_OPS,
  check: ({ op, args = {} }) =>
    op === 'load' && !(Array.isArray(args.ids) && args.ids.every((x) => typeof x === 'string')) ? ['`ids` must be a list of node ids'] : [],
  apply: (s, { op, args = {} }: Call) => {
    if (op === 'clear') return EMPTY_CANVAS;
    const ids = args.ids as string[];
    // `replace` shows only these; otherwise they join what is shown.
    return { ids: args.replace ? [...new Set(ids)] : [...new Set([...s.ids, ...ids])] };
  },
};

const split = (v: unknown) =>
  String(v ?? '')
    .split(/,|×/)
    .map((x) => x.trim())
    .filter(Boolean);

/** The graph the model makes of the rows: a node per distinct key value, an edge per relationship. */
export function buildGraph(model: GraphModel, rows: StudioRow[]): Graph {
  const [row] = model.nodes;
  const nodes: Record<string, GraphNodeRecord> = {};
  const edges: GraphEdgeRecord[] = [];
  const skipped: Skipped[] = [];
  const add = (label: string, name: string, props: Record<string, Value>, rowId: string) => {
    const id = `${label}:${name}`;
    nodes[id] ??= { id, label, name, props, rows: [] };
    if (!nodes[id].rows.includes(rowId)) nodes[id].rows.push(rowId);
    return id;
  };
  const rowNames = new Set(rows.map((r) => String(r[row!.key])));
  rows.forEach((r) => {
    const props: Record<string, Value> = {};
    row!.props.forEach((p) => (props[p.name] = r[p.column] as Value));
    add(row!.label, String(r[row!.key]), props, r.id);
  });
  const idsFor = (label: string, r: StudioRow): string[] => {
    const n = model.nodes.find((x) => x.label === label)!;
    if (n.label === row!.label) return [`${row!.label}:${r[row!.key]}`];
    return split(r[n.key]).map((v) => {
      // A parent line that is itself a variety is that variety.
      if (n.key === 'parent' && rowNames.has(v)) return `${row!.label}:${v}`;
      const props: Record<string, Value> = {};
      n.props.forEach((p) => (props[p.name] = p.column === n.key ? v : (r[p.column] as Value)));
      return add(n.label, v, props, r.id);
    });
  };
  const seen = new Set<string>();
  rows.forEach((r) =>
    model.rels.forEach((rel) => {
      if (!model.nodes.some((n) => n.label === rel.from) || !model.nodes.some((n) => n.label === rel.to)) return;
      const from = idsFor(rel.from, r);
      const to = idsFor(rel.to, r);
      if (!from.length || !to.length) {
        const missing = model.nodes.find((n) => n.label === (!from.length ? rel.from : rel.to))!;
        skipped.push({ row: r.id, column: missing.key, rel: rel.type });
        return;
      }
      // The column that named the far end — the row node's own key names nothing new.
      const far = model.nodes.find((n) => n.label === (rel.to === row!.label ? rel.from : rel.to))!;
      from.forEach((a) =>
        to.forEach((b) => {
          const k = `${a}|${rel.type}|${b}`;
          if (a === b || seen.has(k)) return;
          seen.add(k);
          edges.push({ source: a, target: b, type: rel.type, row: r.id, column: far.key });
        }),
      );
    }),
  );
  return { nodes, edges, skipped };
}

/** The ids plus every node one hop away. */
export function neighbours(graph: Graph, ids: string[]): string[] {
  const set = new Set(ids);
  graph.edges.forEach((e) => {
    if (ids.includes(e.source)) set.add(e.target);
    if (ids.includes(e.target)) set.add(e.source);
  });
  return [...set];
}
