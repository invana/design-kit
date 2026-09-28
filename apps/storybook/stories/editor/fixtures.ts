import type { CodeLanguage } from '@invana/editor';

/**
 * Sample documents for the editor stories, taken from the places Studio shows
 * them. Not a story — shared so each story file stays one story.
 */

/** One real document per language — what `CodeBlock` is actually handed. */
export const SAMPLES: Record<CodeLanguage, string> = {
  python: `from invana.datasets import import_dataset

run = import_dataset("ravi/finance", "bars-5m", "./drop/bars-5m", refresh=True)
run.wait()`,
  cypher: `MATCH (t:Theme)<-[:IN]-(s:Stock)
WHERE t.velocity_5d < 2.0
RETURN s.symbol`,
  shell: `pnpm add github:invana/design-kit#releases/editor
invana run nl-single --arg read_only=true`,
  javascript: `const run = await client.runs.create({ plan: "nl-single", args: { read_only: true } })
for await (const event of run.events()) console.log(event.kind, event.at)`,
  json: `{
  "task": "import_dataset",
  "status": "ok",
  "outputs": {
    "written": 1204,
    "reported": 47,
    "dataset_id": "ds_9f2c"
  },
  "graph": {
    "nodes": { "Order": 1204 },
    "edges": { "FOR": 1204 }
  },
  "artifacts": ["orders.csv", "rejects.csv"],
  "timing": { "ms": 3402 }
}`,
  yaml: `key: nl-single
version: 2
args:
  read_only: {type: bool, default: true, label: Refuse anything that writes}
tasks:
  - key: translate_thought
    run: translate_thought
  - key: execute_graph_query
    run: execute_graph_query
    args: {query: \${steps.translate_thought.query}, read_only: \${args.read_only}}
    depends_on: [translate_thought, validate_query]
`,
  plain: `import_dataset  ok   1204 written   47 reported   3.4s
validate_graph  ok   0 violations               0.8s`,
};

/**
 * The tasks of a run in the order they finish. Each one merges its key into
 * `result.json`, so the document grows as the run proceeds.
 */
export const RUN_STEPS: Array<[string, unknown]> = [
  ['task', 'import_dataset'],
  ['status', 'running'],
  ['outputs', { written: 1204, reported: 47, dataset_id: 'ds_9f2c' }],
  ['graph', { nodes: { Order: 1204 }, edges: { FOR: 1204 } }],
  ['artifacts', ['orders.csv', 'rejects.csv']],
  ['validation', { violations: 0, checked: ['Order', 'FOR'] }],
  ['timing', { ms: 3402 }],
];

/** Graph rules — the prose an author writes for an agent to read. */
export const RULES_V4 = `## Gap playbook

- Gap >= 1.5% with a news catalyst and volume >= 2x the 20-day average
  -> continuation candidate (gap-continuation).
- Stop = VWAP; target = 1.5R; size from position-sizing.`;

/** The next version of {@link RULES_V4}, mid-edit. */
export const RULES_V5 = `## Gap playbook

- Gap >= 1.5% with a news catalyst and volume >= 2x the 20-day average
  -> continuation candidate (gap-continuation).
- Delivery % must be >= 40; below that the gap is a fade candidate
  (gap-no-delivery), never a long.
- Stop = VWAP; target = 1.5R; size from position-sizing.`;

/** An agent's default voice — what the reader gets when nothing is written. */
export const DEFAULT_VOICE =
  'You are a colleague who knows this graph well. Speak in the first person, warmly and plainly.';
