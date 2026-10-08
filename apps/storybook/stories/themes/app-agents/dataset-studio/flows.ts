import type { AskSpec, BlockSpec } from '@invana/assistant';

import type { Call } from '../playbook/playbook';
import { COPY, DATA, plural, say, sourceOf, type GraphModel, type StudioColumn, type StudioRow, type Value } from './data';
import { cellKey, nextVersion, sourceCount, type DatasetState } from './ops/dataset-ops';
import { buildGraph, neighbours, type CanvasState, type GraphState } from './ops/graph-ops';
import { LABEL, proposedModel, validateModel, type ModelState } from './ops/model-ops';
import { Writer } from './script';

/**
 * The assistant, as the API would be: an event in, a script out — the thread's patches and
 * the steps that change the work. It reads the work as it stands (the latest step, not the
 * step the reader is looking at) and never changes anything but through the script.
 */

export interface Work {
  dataset: DatasetState;
  model: ModelState;
  graph: GraphState;
  /** The current session's canvas. */
  canvas: CanvasState;
  /** Whether the columns have been proposed yet, in any session. */
  proposed: boolean;
}

export interface FlowContext {
  work: Work;
  session: { id: string; name: string };
  /** A fresh turn id, its purpose first — `schema-4`. */
  turnId: (purpose: string) => string;
}

/** What one turn carries for later: the node ids a `Show on canvas` loads, the model a proposal holds. */
export type TurnMeta = { ids?: string[]; model?: GraphModel; choice?: string };

export interface Response {
  writer: Writer;
  meta: Record<string, TurnMeta>;
  /** Open this page when the script starts — `Accept and edit` opens the model. */
  open?: string;
}

/** How far along the work is: 0 nothing, 1 columns proposed, 2 rows, 3 saved, 4 model, 5 graph. */
export function progressOf(work: Pick<Work, 'dataset' | 'model' | 'graph' | 'proposed'>): number {
  if (work.graph.graph) return 5;
  if (work.model.model) return 4;
  if (work.dataset.saved) return 3;
  if (work.dataset.rows.length) return 2;
  return work.proposed ? 1 : 0;
}

const canvasTarget = (sid: string) => `canvas:${sid}`;
const column = (s: DatasetState, key: string) => s.columns.find((c) => c.key === key) ?? DATA.columns.find((c) => c.key === key)!;
const fmt = (v: Value | undefined, key: string) =>
  v === '' || v == null ? '' : key === 'yield' && typeof v === 'number' ? v.toFixed(1) : String(v);
/** A form field's name for a cell — a dot would nest it. */
export const fieldOf = (key: string) => key.replace('.', '__');
const keyOf = (field: string) => field.replace('__', '.');

function begin(ctx: FlowContext) {
  const writer = new Writer(() => ctx.turnId('a'));
  const meta: Record<string, TurnMeta> = {};
  const id = (purpose: string) => ctx.turnId(purpose);
  // Asks and actionable answers carry their purpose in their id, so a reply finds its flow.
  const ask = (purpose: string, spec: AskSpec, after?: number) => {
    const turn = id(purpose);
    writer.patch(
      { op: 'add-turn', turn: { id: turn, role: 'assistant', kind: 'ask', stage: 'scope', state: 'pending', ask: spec } },
      after ?? 400,
    );
    return turn;
  };
  return { writer, meta, ask, id };
}

const need = (ctx: FlowContext, stage: number): Response => {
  const { writer, meta } = begin(ctx);
  writer.say(COPY.need[String(stage)]!, {}, 400);
  return { writer, meta };
};

const needFor = (p: number) => (p < 2 ? 2 : p < 3 ? 3 : p < 4 ? 4 : 5);

// ── research and the dataset ────────────────────────────────────────────────

function proposeSchema(ctx: FlowContext): Response {
  const { writer, meta, ask } = begin(ctx);
  const { dataset } = ctx.work;
  if (dataset.rows.length) {
    writer.say('The dataset already exists.', {
      outcome: {
        text: `${dataset.name} · ${plural(dataset.rows.length, 'row')} · ${plural(sourceCount(dataset), 'source')}`,
        actions: [{ id: 'open-dataset', label: 'Open' }],
      },
    });
    return { writer, meta };
  }
  ask(
    'schema',
    {
      kind: 'multi',
      question: COPY.schema,
      options: DATA.columns.map((c) => ({
        value: c.key,
        label: c.label,
        ...(c.key === 'name' ? { disabled: true, note: 'required' } : {}),
      })),
      default: DATA.columns.filter((c) => !DATA.proposedOff.includes(c.key)).map((c) => c.key),
      min: 1,
      submit: 'Accept and collect',
    },
    900,
  );
  return { writer, meta };
}

function buildDataset(ctx: FlowContext, turn: string, picked: string[]): Response {
  const { writer, meta } = begin(ctx);
  const keep = picked.includes('name') ? picked : ['name', ...picked];
  const columns = DATA.columns.filter((c) => keep.includes(c.key));
  writer.answered(turn, keep);
  writer.say(
    COPY.collecting,
    { outcome: { text: 'Chickpea varieties · draft, filling in', actions: [{ id: 'open-dataset', label: 'Open' }] } },
    200,
  );
  writer.step({
    title: `Collect ${plural(columns.length, 'column')}`,
    actor: 'assistant',
    turn,
    calls: [{ target: 'dataset', op: 'setColumns', args: { columns } }],
  });
  const run = writer.run('Building dataset');
  run.start('search', 'Search sources', 100).settle('search', { detail: '7 sources' }, 800).start('extract', 'Extract rows');
  // The rows arrive in three batches, each a step the table plays.
  const rows = DATA.rows.map(
    (r) => Object.fromEntries(Object.entries(r).filter(([k]) => k === 'id' || k === 'src' || keep.includes(k))) as StudioRow,
  );
  for (let i = 0; i < rows.length; i += 4) {
    const batch = rows.slice(i, i + 4);
    writer.step(
      {
        title: `Extract ${batch.map((r) => r.name).join(', ')}`,
        actor: 'assistant',
        turn: run.id,
        calls: [{ target: 'dataset', op: 'upsertRows', args: { rows: batch } }],
      },
      600,
    );
    writer.patch({ op: 'update-trace-step', turn: run.id, step: 'extract', fields: { detail: plural(i + batch.length, 'row') } });
  }
  run
    .settle('extract', {}, 200)
    .start('reconcile', 'Reconcile duplicates')
    .settle('reconcile', { detail: '2 merged' }, 650)
    .start('verify', 'Verify citations');
  const conflicts = Object.fromEntries(Object.entries(DATA.conflicts).filter(([k]) => keep.includes(k.split('.')[1]!)));
  const n = Object.keys(conflicts).length;
  writer.step(
    {
      title: n ? `Flag ${plural(n, 'cell')} whose sources disagree` : 'Every value agrees across its sources',
      actor: 'assistant',
      turn: run.id,
      calls: [{ target: 'dataset', op: 'setConflicts', args: { conflicts } }],
    },
    700,
  );
  run.settle('verify', { detail: plural(n, 'conflict') });
  run.done();
  const sources = new Set(rows.flatMap((r) => r.src)).size;
  writer.say(say(COPY.draft, { rows: rows.length, sources, conflicts: n ? say(COPY.draftConflicts, { n }) : '' }), {
    outcome: n ? { actions: [{ id: 'resolve', label: 'Resolve conflicts' }] } : undefined,
  });
  return { writer, meta };
}

function addDrought(ctx: FlowContext, writer = begin(ctx).writer): Response {
  const { dataset, model } = ctx.work;
  if (dataset.columns.some((c) => c.key === 'drought')) {
    writer.say(COPY.droughtThere, {}, 300);
    return { writer, meta: {} };
  }
  const run = writer.run('Adding drought tolerance', 500);
  run.start('search', 'Search germplasm passport data').settle('search', { detail: '1 source' }, 700).start('fill', 'Fill column');
  const drought = DATA.columns.find((c) => c.key === 'drought')!;
  const values = Object.fromEntries(DATA.rows.map((r) => [r.id, r.drought as Value]));
  const calls: Call[] = [{ target: 'dataset', op: 'addColumn', args: { column: { ...drought, source: DATA.droughtSource }, values } }];
  if (model.model)
    calls.push({
      target: 'model',
      op: 'addProperty',
      args: { node: model.model.nodes[0]!.label, name: 'droughtTolerance', column: 'drought' },
    });
  writer.step({ title: 'Add drought tolerance', actor: 'assistant', turn: run.id, calls }, 500);
  run.settle('fill', { detail: `${dataset.rows.length} of ${dataset.rows.length}` }).done();
  writer.say(say(COPY.drought, { rows: dataset.rows.length }));
  return { writer, meta: {} };
}

function columnForm(ctx: FlowContext, name = ''): Response {
  const { writer, meta, ask } = begin(ctx);
  const has = (n: string) => ctx.work.dataset.columns.some((c) => c.label.toLowerCase() === n.toLowerCase());
  const presets = DATA.presets.filter((p) => !has(p.name));
  ask(
    'column',
    {
      kind: 'form',
      question: COPY.colAsk,
      labels: 'top',
      fields: [
        {
          name: 'preset',
          label: 'Column',
          type: 'radio',
          options: [
            ...presets.map((p) => ({ value: p.name, label: p.name, description: 'Researched from the germplasm database' })),
            { value: 'other', label: 'Something else', description: 'Name it below' },
          ],
          default: name ? 'other' : (presets[0]?.name ?? 'other'),
        },
        { name: 'name', label: 'Column name', type: 'text', placeholder: 'Flower colour', default: name, hint: 'Only for something else' },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
          ],
          default: 'text',
        },
        {
          name: 'fill',
          label: 'Fill',
          type: 'select',
          options: [
            { value: 'research', label: 'Research with sources' },
            { value: 'empty', label: 'Leave empty' },
          ],
          default: 'research',
        },
      ],
      submit: 'Add column',
    },
    300,
  );
  return { writer, meta };
}

function addColumn(ctx: FlowContext, turn: string, value: Record<string, unknown>): Response {
  const { writer, meta } = begin(ctx);
  writer.answered(turn, value);
  const name = String(value.preset !== 'other' ? value.preset : (value.name ?? '')).trim();
  const { dataset, model } = ctx.work;
  if (!name || dataset.columns.some((c) => c.label.toLowerCase() === name.toLowerCase())) {
    writer.say(name ? `There's already a “${name}” column.` : 'Enter a column name.', {}, 250);
    return { ...columnForm(ctx, name), meta };
  }
  const preset = DATA.presets.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (preset?.column === 'drought') return addDrought(ctx, writer);
  const key = `c-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const type = (preset?.type ?? value.type ?? 'text') as StudioColumn['type'];
  const empty = Object.fromEntries(dataset.rows.map((r) => [r.id, '' as Value]));
  const add = (column: StudioColumn, values: Record<string, Value>, title: string, runId?: string) => {
    const calls: Call[] = [{ target: 'dataset', op: 'addColumn', args: { column, values } }];
    if (model.model && column.source != null)
      calls.push({ target: 'model', op: 'addProperty', args: { node: model.model.nodes[0]!.label, name: key, column: key } });
    writer.step({ title, actor: 'assistant', turn: runId ?? turn, calls }, 300);
  };
  if (value.fill === 'empty') {
    add({ key, label: name, type, custom: true }, empty, `Add an empty ${name} column`);
    writer.say(say(COPY.colEmpty, { name }));
    return { writer, meta };
  }
  const run = writer.run(`Researching ${name}`);
  run.start('search', 'Search sources').settle('search', { detail: preset ? '1 source' : '0 matches' }, 800);
  if (preset) {
    run.start('fill', 'Fill column');
    const values = Object.fromEntries(
      dataset.rows.map((r, i) => [r.id, preset.values ? preset.values[String(r.type)]! : preset.cycle![i % preset.cycle!.length]!]),
    );
    add({ key, label: preset.name, type, custom: true, source: DATA.droughtSource }, values, `Add ${preset.name}`, run.id);
    run.settle('fill', { detail: `${dataset.rows.length} of ${dataset.rows.length}` }).done();
    writer.say(say(COPY.colPreset, { name: preset.name, rows: dataset.rows.length }));
  } else {
    add({ key, label: name, type, custom: true }, empty, `Add an empty ${name} column`, run.id);
    run.done();
    writer.say(say(COPY.colNone, { name }));
  }
  return { writer, meta };
}

function conflictForm(ctx: FlowContext): Response {
  const { writer, meta, ask } = begin(ctx);
  const { dataset } = ctx.work;
  const keys = Object.keys(dataset.conflicts);
  if (!keys.length) {
    writer.say(COPY.noConflicts, {}, 400);
    return { writer, meta };
  }
  ask(
    'conflicts',
    {
      kind: 'form',
      question: COPY.conflictAsk,
      labels: 'top',
      fields: keys.map((key) => {
        const [rid, k] = key.split('.') as [string, string];
        const row = dataset.rows.find((r) => r.id === rid)!;
        return {
          name: fieldOf(key),
          label: `${row.name} · ${column(dataset, k).label}`,
          type: 'radio' as const,
          options: [
            ...dataset.conflicts[key]!.map((o, i) => ({
              value: String(i),
              label: fmt(o.value, k),
              description: `source [${o.source}] ${sourceOf(o.source).kind}`,
            })),
            { value: 'later', label: 'Decide later' },
          ],
          default: 'later',
        };
      }),
      submit: 'Apply choices',
    },
    400,
  );
  return { writer, meta };
}

/** The steps that settle conflicts on the picked values — by the assistant from a form, or the reader in the table. */
export function resolveCalls(dataset: DatasetState, picks: [key: string, index: number][]): { calls: Call[]; done: string[] } {
  const calls: Call[] = [];
  const done: string[] = [];
  for (const [key, i] of picks) {
    const option = dataset.conflicts[key]?.[i];
    if (!option) continue;
    const [row, col] = key.split('.') as [string, string];
    calls.push({ target: 'dataset', op: 'resolve', args: { row, column: col, value: option.value, source: option.source } });
    done.push(`${dataset.rows.find((r) => r.id === row)!.name} ${fmt(option.value, col)}`);
  }
  return { calls, done };
}

function resolveConflicts(ctx: FlowContext, turn: string, value: Record<string, unknown>): Response {
  const { writer, meta } = begin(ctx);
  writer.answered(turn, value);
  const { dataset } = ctx.work;
  const picks = Object.entries(value)
    .filter(([, v]) => v !== 'later' && v != null)
    .map(([f, v]) => [keyOf(f), Number(v)] as [string, number]);
  const { calls, done } = resolveCalls(dataset, picks);
  if (!calls.length) {
    writer.say('Nothing changed — every cell is left to decide later.', {}, 300);
    return { writer, meta };
  }
  writer.step({ title: `Resolve ${plural(calls.length, 'conflict')}`, actor: 'assistant', turn, calls }, 300);
  const left = Object.keys(dataset.conflicts).length - calls.length;
  writer.say(
    say(COPY.resolved, {
      n: calls.length,
      s: calls.length === 1 ? '' : 's',
      list: done.join(' · '),
      left: left ? ` ${plural(left, 'conflict')} left.` : '',
    }),
  );
  return { writer, meta };
}

function saveForm(ctx: FlowContext): Response {
  const { writer, meta, ask } = begin(ctx);
  const { dataset } = ctx.work;
  const version = nextVersion(dataset);
  const open = Object.keys(dataset.conflicts).length;
  ask(
    'save',
    {
      kind: 'form',
      question: COPY.saveAsk,
      labels: 'top',
      fields: [
        { name: 'name', label: 'Name', type: 'text', default: dataset.name, required: true },
        {
          name: 'version',
          label: 'Version',
          type: 'select',
          options: [{ value: version, label: version }],
          default: version,
          disabled: true,
          aside: `${plural(dataset.rows.length, 'row')} · ${plural(dataset.columns.length, 'column')} · ${plural(sourceCount(dataset), 'source')}`,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          rows: 2,
          placeholder: 'Released chickpea varieties with agronomic traits, for parent selection',
          default: dataset.description,
        },
        { name: 'citations', label: 'Keep sources and citations', type: 'checkbox', default: true },
      ],
      hint: open ? `**${plural(open, 'conflict')}** still open. The values shown in the table will be saved.` : undefined,
      submit: `Save ${version}`,
    },
    300,
  );
  return { writer, meta };
}

function save(ctx: FlowContext, turn: string, value: Record<string, unknown>): Response {
  const { writer, meta } = begin(ctx);
  writer.answered(turn, value);
  const { dataset } = ctx.work;
  const name = String(value.name ?? dataset.name).trim() || dataset.name;
  const version = nextVersion(dataset);
  const citations = value.citations !== false;
  writer.step(
    {
      title: `Save ${name} ${version}`,
      actor: 'assistant',
      turn,
      calls: [{ target: 'dataset', op: 'save', args: { name, description: String(value.description ?? ''), citations } }],
    },
    300,
  );
  const open = Object.keys(dataset.conflicts).length;
  writer.say(
    say(COPY.saved, {
      name,
      version,
      rows: dataset.rows.length,
      columns: dataset.columns.length,
      sources: citations ? `, ${sourceCount(dataset)} sources kept with it` : '',
      open: open ? ` ${plural(open, 'conflict')} still open; I kept the values shown in the table.` : '',
    }),
  );
  return { writer, meta };
}

function researchCell(ctx: FlowContext): Response {
  const { writer, meta } = begin(ctx);
  const run = writer.run('Searching again', 500);
  run.start('query', 'Query 3 more sources').settle('query', { detail: '0 matches' }, 900).done();
  writer.say(COPY.searchAgain);
  return { writer, meta };
}

// ── the model ───────────────────────────────────────────────────────────────

function proposeModel(ctx: FlowContext): Response {
  const { writer, meta, id } = begin(ctx);
  const model = proposedModel(DATA.model, ctx.work.dataset.columns);
  const turn = id('model');
  writer.patch(
    {
      op: 'add-turn',
      turn: {
        id: turn,
        role: 'assistant',
        kind: 'answer',
        state: 'complete',
        title: 'Proposed graph model',
        blocks: [
          { kind: 'narrative', text: COPY.model },
          {
            kind: 'table',
            columns: [
              { key: 'from', label: 'From' },
              { key: 'type', label: 'Relationship', mono: true },
              { key: 'to', label: 'To' },
            ],
            rows: model.rels.map((r) => ({ from: r.from, type: r.type, to: r.to === 'ParentLine' ? 'ParentLine or Variety' : r.to })),
            noun: 'relationships',
            note: `${plural(model.nodes.length, 'node type')} · ${model.nodes.map((n) => n.label).join(', ')}`,
          },
        ],
        outcome: {
          actions: [
            { id: 'accept-model', label: 'Accept model', variant: 'primary' },
            { id: 'accept-model-edit', label: 'Accept and edit', variant: 'secondary' },
          ],
        },
      },
    },
    900,
  );
  meta[turn] = { model };
  return { writer, meta };
}

export function acceptModel(ctx: FlowContext, turn: string, model: GraphModel, edit: boolean): Response {
  const { writer, meta } = begin(ctx);
  writer.patch({ op: 'update-turn', turn, fields: { outcome: { text: edit ? 'Accepted · editing' : 'Accepted' } } });
  writer.step(
    {
      title: `Create the graph model: ${plural(model.nodes.length, 'node type')}`,
      actor: 'assistant',
      turn,
      calls: [{ target: 'model', op: 'setModel', args: { model } }],
    },
    200,
  );
  writer.say(COPY.modelReady, {
    outcome: {
      text: `Chickpea graph model · ${plural(model.nodes.length, 'node type')} · ${plural(model.rels.length, 'relationship')}`,
      actions: [{ id: 'open-model', label: 'Open' }],
    },
  });
  return { writer, meta, open: edit ? 'model' : undefined };
}

function modelChangeAsk(ctx: FlowContext): Response {
  const { writer, meta, ask } = begin(ctx);
  ask(
    'medit',
    {
      kind: 'single',
      question: COPY.meditAsk,
      options: [
        { value: 'rename', label: 'Rename a node type', description: 'Its relationships follow the new name' },
        { value: 'key', label: 'Change a key', description: 'One node is made for each distinct value of the key' },
        { value: 'rel', label: 'Add a relationship', description: 'Between two node types' },
      ],
      default: 'rename',
      submit: 'Next',
    },
    300,
  );
  return { writer, meta };
}

function modelChangeForm(ctx: FlowContext, turn: string, choice: string): Response {
  const { writer, meta, ask } = begin(ctx);
  writer.answered(turn, choice);
  const model = ctx.work.model.model!;
  const nodes = model.nodes.map((n) => ({ value: n.label, label: n.label }));
  const columns = ctx.work.dataset.columns.map((c) => ({ value: c.key, label: c.label }));
  const second = model.nodes[1]?.label ?? model.nodes[0]!.label;
  const fields =
    choice === 'rename'
      ? [
          { name: 'node', label: 'Node type', type: 'select' as const, options: nodes, default: second },
          { name: 'label', label: 'New label', type: 'text' as const, placeholder: 'Breeder', required: true },
        ]
      : choice === 'key'
        ? [
            { name: 'node', label: 'Node type', type: 'select' as const, options: nodes, default: second },
            { name: 'key', label: 'Key column', type: 'select' as const, options: columns, default: model.nodes[1]?.key },
          ]
        : [
            { name: 'from', label: 'From', type: 'select' as const, options: nodes, default: model.nodes[0]!.label },
            { name: 'type', label: 'Type', type: 'text' as const, placeholder: 'BRED_AT', required: true },
            { name: 'to', label: 'To', type: 'select' as const, options: nodes, default: second },
          ];
  const id = ask(
    'medit2',
    {
      kind: 'form',
      question: {
        rename: 'Rename which node type, and to what?',
        key: 'Key which node type on which column?',
        rel: 'Which relationship should I add?',
      }[choice]!,
      labels: 'top',
      fields,
      submit: 'Apply change',
    },
    300,
  );
  meta[id] = { choice };
  return { writer, meta };
}

function changeModel(ctx: FlowContext, turn: string, choice: string, value: Record<string, string>): Response {
  const { writer, meta } = begin(ctx);
  const model = ctx.work.model.model!;
  const retry = (problem: string) => {
    writer.say(problem, {}, 250);
    const again = modelChangeForm(ctx, turn, choice);
    return { writer, meta: { ...meta, ...again.meta }, entries: again.writer.entries };
  };
  let call: Call;
  let summary: string;
  if (choice === 'rename') {
    const to = (value.label ?? '').trim();
    if (!LABEL.test(to)) return merge(retry('Use letters, digits and underscores, starting with a letter.'));
    if (model.nodes.some((n) => n.label === to)) return merge(retry(`“${to}” is already a node type.`));
    call = { target: 'model', op: 'renameNode', args: { from: value.node, to } };
    summary = `Renamed ${value.node} to ${to}`;
  } else if (choice === 'key') {
    call = { target: 'model', op: 'setKey', args: { node: value.node, key: value.key } };
    summary = `${value.node} now keyed on ${column(ctx.work.dataset, value.key!).label}`;
  } else {
    const type = (value.type ?? '').trim().toUpperCase().replace(/\s+/g, '_');
    if (!type) return merge(retry('Enter a relationship type.'));
    if (model.rels.some((r) => r.from === value.from && r.to === value.to && r.type === type))
      return merge(retry('That relationship already exists.'));
    call = { target: 'model', op: 'addRelationship', args: { from: value.from, type, to: value.to } };
    summary = `Added (${value.from})-[${type}]->(${value.to})`;
  }
  writer.answered(turn, value);
  writer.step({ title: summary, actor: 'assistant', turn, calls: [call] }, 250);
  writer.say(`${summary}. ${ctx.work.graph.graph ? 'Re-import to apply this to the graph.' : 'The model page is updated.'}`);
  return { writer, meta };

  // A retry writes its own turns after the explanation.
  function merge(r: { writer: Writer; meta: Record<string, TurnMeta>; entries: Writer['entries'] }): Response {
    const offset = r.writer.entries.at(-1)?.at ?? 0;
    r.entries.forEach((e) => r.writer.entries.push({ ...e, at: e.at + offset }));
    return { writer: r.writer, meta: r.meta };
  }
}

// ── import ──────────────────────────────────────────────────────────────────

function importForm(ctx: FlowContext): Response {
  const { writer, meta, ask } = begin(ctx);
  const { dataset, model, graph } = ctx.work;
  const issues = validateModel(model.model!, dataset.columns);
  if (issues.length) {
    writer.say(
      say(COPY.importIssues, { n: issues.length, s: issues.length === 1 ? '' : 's', list: issues.join(' ') }),
      { outcome: { actions: [{ id: 'open-model', label: 'Open model' }] } },
      400,
    );
    return { writer, meta };
  }
  const has = graph.graph != null;
  const versions = [...dataset.versions].reverse();
  ask(
    'import',
    {
      kind: 'form',
      question: COPY.importAsk,
      labels: 'top',
      fields: [
        {
          name: 'version',
          label: 'Dataset version',
          type: 'select',
          options: versions.map((v, i) => ({ value: v, label: i === 0 ? `${v} (latest)` : v })),
          default: versions[0],
        },
        {
          name: 'mode',
          label: 'Graph',
          type: 'radio',
          options: [
            {
              value: 'replace',
              label: has ? 'Replace the graph' : 'Create a new graph',
              description: has ? 'Clears the current nodes and relationships first' : undefined,
            },
            {
              value: 'merge',
              label: 'Merge into the existing graph',
              description: has ? 'Adds new nodes, updates matching ones by key' : 'No graph yet',
              disabled: !has,
            },
          ],
          default: has ? 'merge' : 'replace',
        },
        {
          name: 'onError',
          label: 'When a row has a missing value',
          type: 'radio',
          options: [
            { value: 'skip', label: 'Skip it and report', description: 'The rest of the import continues' },
            { value: 'stop', label: 'Stop the import', description: 'Nothing is written until the data is fixed' },
          ],
          default: 'skip',
        },
      ],
      submit: 'Start import',
    },
    350,
  );
  return { writer, meta };
}

export function runImport(ctx: FlowContext, turn: string | null, value: { version?: string; mode?: string; onError?: string }): Response {
  const { writer, meta } = begin(ctx);
  if (turn) writer.answered(turn, value);
  const { dataset, model, graph: before } = ctx.work;
  const graph = buildGraph(model.model!, dataset.rows);
  const nodes = Object.keys(graph.nodes).length;
  const run = writer.run(`Importing ${value.version ?? `${dataset.name} ${dataset.version}`}`, 200);
  const stages: [string, string, string][] = [
    ['validate', 'Validate model', plural(model.model!.nodes.length, 'node type')],
    ['transform', 'Transform rows', plural(dataset.rows.length, 'row')],
    ['nodes', 'Create nodes', plural(nodes, 'node')],
    ['rels', 'Create relationships', `${graph.edges.length} created`],
    ['indexes', 'Build indexes', '3 indexes'],
  ];
  const stops = value.onError === 'stop' && graph.skipped.length > 0;
  for (const [i, [id, label, detail]] of stages.entries()) {
    run.start(id, label, i ? 0 : 100);
    if (stops && id === 'transform') {
      writer.patch(
        {
          op: 'update-trace-step',
          turn: run.id,
          step: id,
          fields: { state: 'failed', error: `${plural(graph.skipped.length, 'row')} with a missing value` },
        },
        600,
      );
      run.done(undefined, 'error');
      const rows = graph.skipped.map((s) => ({
        cell: cellKey(s.row, s.column),
        variety: dataset.rows.find((r) => r.id === s.row)!.name as string,
        column: column(dataset, s.column).label,
        value: 'empty',
      }));
      const n = graph.skipped.length;
      writer.say(say(COPY.importStopped, { n, s: n === 1 ? '' : 's', have: n === 1 ? 'has' : 'have' }), {
        blocks: [
          {
            kind: 'table',
            columns: [
              { key: 'variety', label: 'Variety' },
              { key: 'column', label: 'Column' },
              { key: 'value', label: 'Value' },
            ],
            rows,
            rowKey: 'cell',
            note: 'pick a row to open its cell',
          } as BlockSpec,
        ],
      });
      return { writer, meta };
    }
    if (id === 'rels')
      writer.step(
        {
          title: `Import ${plural(nodes, 'node')} and ${plural(graph.edges.length, 'relationship')}`,
          actor: 'assistant',
          turn: run.id,
          calls: [{ target: 'graph', op: 'import', args: { graph, mode: value.mode ?? 'replace' } }],
        },
        300,
      );
    run.settle(id, { detail }, 600);
  }
  let text = COPY.imported;
  if (value.mode === 'merge' && before.graph) {
    const fresh = Object.keys(graph.nodes).filter((id) => !before.graph!.nodes[id]).length;
    const key = (e: { source: string; type: string; target: string }) => `${e.source}|${e.type}|${e.target}`;
    const old = new Set(before.graph.edges.map(key));
    const edges = graph.edges.filter((e) => !old.has(key(e))).length;
    text = say(COPY.merged, { nodes: fresh, ns: fresh === 1 ? '' : 's', edges, es: edges === 1 ? '' : 's' });
  }
  run.block({ kind: 'narrative', text });
  run.block({
    kind: 'grid',
    tiles: [
      { label: 'nodes', value: nodes },
      { label: 'relationships', value: graph.edges.length },
      { label: 'skipped', value: graph.skipped.length, tone: graph.skipped.length ? 'warn' : undefined },
    ],
  });
  const first = graph.skipped[0];
  if (first) {
    const row = dataset.rows.find((r) => r.id === first.row)!;
    run.block({
      kind: 'table',
      columns: [{ key: 'note', label: 'Skipped' }],
      rows: [
        {
          cell: cellKey(first.row, first.column),
          note: `${row.name}: ${first.rel} skipped, ${column(dataset, first.column).label.toLowerCase()} is empty`,
        },
      ],
      rowKey: 'cell',
      note: 'pick it to open the cell',
    } as BlockSpec);
  }
  run.done({ actions: [{ id: 'show-all', label: 'Show the whole graph' }] });
  return { writer, meta };
}

// ── explore ─────────────────────────────────────────────────────────────────

const varietyIds = (rows: StudioRow[]) => rows.map((r) => `Variety:${r.name}`);
const SHOW = { id: 'show', label: 'Show on canvas' };

function institutions(ctx: FlowContext): Response {
  const { writer, meta, id } = begin(ctx);
  const graph = ctx.work.graph.graph!;
  const count: Record<string, number> = {};
  graph.edges
    .filter((e) => e.type === 'DEVELOPED_BY')
    .forEach((e) => (count[graph.nodes[e.target]!.name] = (count[graph.nodes[e.target]!.name] ?? 0) + 1));
  const items = Object.entries(count)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  const tied = items.filter((x) => x.value === items[0]!.value).length;
  const turn = id('a');
  writer.patch(
    {
      op: 'add-turn',
      turn: {
        id: turn,
        role: 'assistant',
        kind: 'answer',
        state: 'complete',
        title: 'Varieties per institution',
        blocks: [
          {
            kind: 'narrative',
            text: say(COPY.institutions, {
              lead: tied > 1 ? `${tied} institutions are tied at ${items[0]!.value}.` : `${items[0]!.label} leads with ${items[0]!.value}.`,
            }),
          },
          { kind: 'ranked', items },
        ],
        outcome: { actions: [SHOW] },
      },
    },
    700,
  );
  meta[turn] = {
    ids: neighbours(
      graph,
      items.map((x) => `Institution:${x.label}`),
    ),
  };
  return { writer, meta };
}

function decades(ctx: FlowContext): Response {
  const { writer, meta, id } = begin(ctx);
  const rows = ctx.work.dataset.rows;
  const by: Record<string, number[]> = {};
  rows.forEach((r) => (by[`${Math.floor(Number(r.year) / 10) * 10}s`] ??= []).push(Number(r.yield)));
  const points = Object.keys(by)
    .sort()
    .map((d) => [d, Number((by[d]!.reduce((a, x) => a + x, 0) / by[d]!.length).toFixed(1))] as [string, number]);
  const [first, last] = [points[0]!, points.at(-1)!];
  const turn = id('a');
  writer.patch(
    {
      op: 'add-turn',
      turn: {
        id: turn,
        role: 'assistant',
        kind: 'answer',
        state: 'complete',
        title: 'Average yield by release decade',
        blocks: [
          {
            kind: 'narrative',
            text: say(COPY.decades, { first: first[1].toFixed(1), firstLabel: first[0], last: last[1].toFixed(1), lastLabel: last[0] }),
          },
          { kind: 'timeseries', series: [{ name: 'Average yield', points }], unit: 'q/ha' },
        ],
        outcome: { actions: [SHOW] },
      },
    },
    700,
  );
  meta[turn] = { ids: varietyIds(rows) };
  return { writer, meta };
}

function wilt(ctx: FlowContext): Response {
  const { writer, meta, id } = begin(ctx);
  const graph = ctx.work.graph.graph!;
  const rows = ctx.work.dataset.rows
    .filter((r) => r.type === 'Kabuli' && /fusarium wilt/i.test(String(r.res)) && Number(r.yield) >= 18)
    .sort((a, b) => Number(b.yield) - Number(a.yield));
  const turn = id('a');
  writer.patch(
    {
      op: 'add-turn',
      turn: {
        id: turn,
        role: 'assistant',
        kind: 'answer',
        state: 'complete',
        title: 'Wilt-resistant kabuli above 18 q/ha',
        blocks: [
          { kind: 'narrative', text: say(COPY.wilt, { n: rows.length, top: rows[0] ? `${rows[0].name} is the highest yielding.` : '' }) },
          {
            kind: 'table',
            columns: [
              { key: 'name', label: 'Variety' },
              { key: 'inst', label: 'Released by' },
              { key: 'yield', label: 'Yield', align: 'right', mono: true },
            ],
            rows: rows.map((r) => ({ name: r.name as string, inst: r.inst as string, yield: Number(r.yield).toFixed(1) })),
            noun: 'varieties',
          },
        ],
        outcome: { actions: [SHOW, { id: 'open-dataset', label: 'Open in table', variant: 'ghost' }] },
      },
    },
    800,
  );
  meta[turn] = { ids: neighbours(graph, varietyIds(rows)) };
  return { writer, meta };
}

export function showAll(ctx: FlowContext, turn?: string): Response {
  const { writer, meta } = begin(ctx);
  const graph = ctx.work.graph.graph!;
  const ids = Object.keys(graph.nodes);
  writer.step(
    {
      title: `Show the whole graph on ${ctx.session.name}`,
      actor: 'assistant',
      turn,
      calls: [{ target: canvasTarget(ctx.session.id), op: 'load', args: { ids, replace: true } }],
    },
    400,
  );
  writer.say(say(COPY.whole, { canvas: ctx.session.name, n: ids.length }));
  return { writer, meta };
}

function about(ctx: FlowContext, name: string): Response {
  const { writer, meta, id } = begin(ctx);
  const graph = ctx.work.graph.graph!;
  const wanted = name.trim().toLowerCase().replace(/[?.]$/, '');
  const node = Object.values(graph.nodes).find((n) => n.name.toLowerCase() === wanted);
  if (!node) {
    writer.say(say(COPY.notFound, { name }), {}, 600);
    return { writer, meta };
  }
  const out = graph.edges
    .filter((e) => e.source === node.id)
    .map((e) => `${e.type.toLowerCase().replace(/_/g, ' ')} ${graph.nodes[e.target]!.name}`);
  const into = graph.edges.filter((e) => e.target === node.id).map((e) => graph.nodes[e.source]!.name);
  let text = `**${node.name}** is a ${node.label} node.`;
  if (node.label === 'Variety') {
    const p = node.props;
    text += ` ${p.type}, released ${p.releaseYear}, ${Number(p.yieldQHa).toFixed(1)} q/ha, ${p.maturityDays} days to maturity. It is ${out.join(', ')}.`;
  }
  if (into.length) text += ` Linked from ${plural(into.length, 'variety', 'varieties')}: ${into.join(', ')}.`;
  const turn = id('a');
  writer.patch(
    {
      op: 'add-turn',
      turn: {
        id: turn,
        role: 'assistant',
        kind: 'answer',
        state: 'complete',
        blocks: [
          { kind: 'narrative', text },
          {
            kind: 'record',
            header: { title: node.name, status: { label: node.label } },
            rows: Object.entries(node.props).map(([label, v]) => ({ label, value: String(v ?? '—') })),
          },
        ],
        outcome: { actions: [SHOW] },
      },
    },
    600,
  );
  meta[turn] = { ids: neighbours(graph, [node.id]) };
  return { writer, meta };
}

/** Load a turn's nodes on the current canvas. */
export function showOnCanvas(ctx: FlowContext, turn: string, ids: string[]): Response {
  const { writer, meta } = begin(ctx);
  writer.step({
    title: `Show ${plural(ids.length, 'node')} on ${ctx.session.name}`,
    actor: 'you',
    turn,
    calls: [{ target: canvasTarget(ctx.session.id), op: 'load', args: { ids, replace: true } }],
  });
  return { writer, meta };
}

// ── routing ─────────────────────────────────────────────────────────────────

/** A prompt, routed the way the prototype's scripted assistant routes it. */
export function respondToPrompt(ctx: FlowContext, text: string): Response {
  const s = text.toLowerCase();
  const p = progressOf(ctx.work);
  let m: RegExpMatchArray | null;
  if ((m = s.match(/tell me about (.+)/))) return p < 5 ? need(ctx, 5) : about(ctx, m[1]!);
  if (/search again|find the/.test(s)) return researchCell(ctx);
  if (p < 2 && /chickpea|variet|list|dataset/.test(s)) return proposeSchema(ctx);
  if (/drought/.test(s)) return p < 2 ? need(ctx, 2) : addDrought(ctx);
  if (/column/.test(s)) return p < 2 ? need(ctx, 2) : columnForm(ctx);
  if (/conflict|resolve/.test(s)) return p < 2 ? need(ctx, 2) : conflictForm(ctx);
  if (/\bsave\b/.test(s)) return p < 2 ? need(ctx, 2) : saveForm(ctx);
  if (/import/.test(s)) return p < 4 ? need(ctx, needFor(p)) : importForm(ctx);
  if (/quick change|edit the model|rename|change the key|relationship/.test(s)) return p < 4 ? need(ctx, needFor(p)) : modelChangeAsk(ctx);
  if (/model/.test(s)) return p < 3 ? need(ctx, needFor(p)) : proposeModel(ctx);
  if (/institution/.test(s)) return p < 5 ? need(ctx, 5) : institutions(ctx);
  if (/decade|trend/.test(s)) return p < 5 ? need(ctx, 5) : decades(ctx);
  if (/wilt|kabuli|resistan/.test(s)) return p < 5 ? need(ctx, 5) : wilt(ctx);
  if (/whole graph|everything|all nodes|canvas/.test(s)) return p < 5 ? need(ctx, 5) : showAll(ctx);
  const { writer, meta } = begin(ctx);
  writer.say(COPY.fallback, {}, 400);
  return { writer, meta };
}

/** A reply to one of the assistant's asks, by the ask's purpose. */
export function respondToReply(ctx: FlowContext, turn: string, value: unknown, meta: TurnMeta | undefined): Response | null {
  const purpose = turn.split('-')[0];
  const v = (value ?? {}) as Record<string, unknown>;
  switch (purpose) {
    case 'schema':
      return buildDataset(ctx, turn, value as string[]);
    case 'column':
      return addColumn(ctx, turn, v);
    case 'conflicts':
      return resolveConflicts(ctx, turn, v);
    case 'save':
      return save(ctx, turn, v);
    case 'medit':
      return modelChangeForm(ctx, turn, String(value));
    case 'medit2':
      return changeModel(ctx, turn, meta?.choice ?? 'rename', v as Record<string, string>);
    case 'import':
      return runImport(ctx, turn, v as { version?: string; mode?: string; onError?: string });
  }
  return null;
}

/** The asks the dataset page's buttons start, as if the reader had typed them. */
export const PAGE_PROMPTS = {
  save: 'Save this dataset',
  column: 'Add a column',
  import: 'Import the dataset into the graph model',
} as const;
