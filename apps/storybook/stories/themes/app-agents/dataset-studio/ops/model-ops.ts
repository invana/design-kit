import type { Call, OpSet } from '../../playbook/playbook';
import type { GraphModel, StudioColumn } from '../data';

/**
 * What the graph model can be told. The model page's own edits arrive the same way — a step
 * by the reader — so the model at any step is the calls up to it.
 */

export interface ModelState {
  model: GraphModel | null;
}

export const EMPTY_MODEL: ModelState = { model: null };

export const MODEL_OPS = ['setModel', 'renameNode', 'setKey', 'addRelationship', 'addProperty'] as const;

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';
export const LABEL = /^[A-Za-z][A-Za-z0-9_]*$/;

function check({ op, args = {} }: Call): string[] {
  const p: string[] = [];
  if (op === 'setModel') {
    const m = args.model as GraphModel | undefined;
    if (!m || !Array.isArray(m.nodes) || !Array.isArray(m.rels) || !m.nodes.length)
      p.push('`model` needs a `nodes` list and a `rels` list');
  }
  if (op === 'renameNode') {
    if (!isText(args.from)) p.push('`from` must be a node label');
    if (!(isText(args.to) && LABEL.test(args.to))) p.push('`to` must be letters, digits and underscores, starting with a letter');
  }
  if (op === 'setKey' && !(isText(args.node) && isText(args.key))) p.push('`node` and `key` are needed');
  if (op === 'addRelationship' && !(isText(args.from) && isText(args.type) && isText(args.to)))
    p.push('`from`, `type` and `to` are needed');
  if (op === 'addProperty' && !(isText(args.node) && isText(args.name) && isText(args.column)))
    p.push('`node`, `name` and `column` are needed');
  return p;
}

function onModel(s: ModelState, fn: (m: GraphModel) => GraphModel): ModelState {
  if (!s.model) throw new Error('there is no model yet');
  return { model: fn(s.model) };
}

function apply(s: ModelState, { op, args = {} }: Call): ModelState {
  switch (op) {
    case 'setModel':
      return { model: args.model as GraphModel };
    case 'renameNode': {
      const { from, to } = args as { from: string; to: string };
      return onModel(s, (m) => {
        if (m.nodes.some((n) => n.label === to)) throw new Error(`“${to}” is already a node type`);
        return {
          nodes: m.nodes.map((n) => (n.label === from ? { ...n, label: to } : n)),
          rels: m.rels.map((r) => ({ ...r, from: r.from === from ? to : r.from, to: r.to === from ? to : r.to })),
        };
      });
    }
    case 'setKey': {
      const { node, key } = args as { node: string; key: string };
      return onModel(s, (m) => ({
        ...m,
        nodes: m.nodes.map((n) =>
          n.label !== node
            ? n
            : { ...n, key, props: n.props.some((p) => p.column === key) ? n.props : [{ name: 'name', column: key }, ...n.props] },
        ),
      }));
    }
    case 'addRelationship': {
      const { from, type, to } = args as { from: string; type: string; to: string };
      return onModel(s, (m) => {
        if (m.rels.some((r) => r.from === from && r.to === to && r.type === type)) throw new Error('that relationship exists already');
        return { ...m, rels: [...m.rels, { from, type, to }] };
      });
    }
    case 'addProperty': {
      const { node, name, column } = args as { node: string; name: string; column: string };
      return onModel(s, (m) => ({
        ...m,
        nodes: m.nodes.map((n) => (n.label === node ? { ...n, props: [...n.props, { name, column }] } : n)),
      }));
    }
  }
  return s;
}

export const modelOps: OpSet<ModelState> = { kind: 'model', ops: MODEL_OPS, check, apply };

/** What is wrong with a model against the dataset's columns — empty when it can be imported. */
export function validateModel(m: GraphModel, columns: StudioColumn[]): string[] {
  const e: string[] = [];
  const labels = m.nodes.map((n) => n.label);
  const keys = new Set(columns.map((c) => c.key));
  m.nodes.forEach((n, i) => {
    if (!n.label) e.push(`Node ${i + 1} needs a label.`);
    if (!keys.has(n.key)) e.push(`${n.label || `Node ${i + 1}`}: key column “${n.key}” isn't in the dataset.`);
    n.props.forEach((p) => {
      if (!p.name) e.push(`${n.label}: a property needs a name.`);
      if (!keys.has(p.column)) e.push(`${n.label}.${p.name}: column “${p.column}” isn't in the dataset.`);
    });
  });
  labels.forEach((l, i) => l && labels.indexOf(l) !== i && e.push(`Label “${l}” is used twice.`));
  m.rels.forEach((r) => {
    if (!r.type) e.push('A relationship needs a type.');
    if (!labels.includes(r.from) || !labels.includes(r.to)) e.push(`${r.type || 'Relationship'} points at a node that doesn't exist.`);
  });
  return [...new Set(e)];
}

/** The model the assistant proposes, over the columns the dataset has. */
export function proposedModel(base: GraphModel, columns: StudioColumn[]): GraphModel {
  const has = new Set(columns.map((c) => c.key));
  const [row, ...rest] = base.nodes;
  const extra = columns
    .filter((c) => c.key === 'drought' || c.custom)
    .map((c) => ({ name: c.key === 'drought' ? 'droughtTolerance' : c.key, column: c.key }));
  return {
    nodes: [{ ...row!, props: [...row!.props.filter((p) => has.has(p.column)), ...extra] }, ...rest.filter((n) => has.has(n.key))],
    rels: base.rels.filter((r) => rest.some((n) => n.label === r.to && has.has(n.key))),
  };
}
