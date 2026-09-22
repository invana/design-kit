import type { LayerPalette } from '@invana/ui';

/**
 * `run:7d3184f1` — one execution of `nl-query@5`: nine steps, one clarification
 * loop that took two rounds, one approval gate and one step that needed two
 * attempts. Every story on this component reads this one record; only the
 * reading changes.
 */
export interface Step {
  seq: number;
  name: string;
  description: string;
  layer: string;
  role: string;
  duration: string;
  note: string;
}

/** The hues are the caller's — the kit ships none. Matching `LayerStrip`'s. */
export const LAYER_PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1', text: 'text-data-1' },
  llm: { swatch: 'bg-data-7', text: 'text-data-7' },
  third_party: { swatch: 'bg-data-8', text: 'text-data-8' },
  cache: { swatch: 'bg-data-3', text: 'text-data-3' },
  human: { swatch: 'bg-data-6', text: 'text-data-6' },
};

/** The clarification loop — two of the three rounds it was allowed. */
export const ROUNDS: Step[] = [
  {
    seq: 1,
    name: 'parse_intent',
    description: 'Two readings: late by ship date, or by promise date',
    layer: 'llm',
    role: 'extract',
    duration: '0.9s',
    note: 'round 1',
  },
  {
    seq: 2,
    name: 'ask_user',
    description: 'ravi chose — by promise date',
    layer: 'human',
    role: 'clarification',
    duration: '41.2s',
    note: 'answered',
  },
  {
    seq: 3,
    name: 'parse_intent',
    description: 'One reading now — 12 entities named',
    layer: 'llm',
    role: 'extract',
    duration: '0.7s',
    note: 'round 2',
  },
];

/** After the loop, and before the gate. */
export const BEFORE_GATE: Step[] = [
  {
    seq: 4,
    name: 'resolve_schema',
    description: 'Routes@v4, Carriers@v2 — Deal@v3 allowed, never needed',
    layer: 'graph_data',
    role: 'schema',
    duration: '0.2s',
    note: '2 models',
  },
  {
    seq: 5,
    name: 'build_query',
    description: 'A read over Routes · H1 2026 · IE·DE·FR',
    layer: 'llm',
    role: 'decide',
    duration: '1.4s',
    note: 'ok',
  },
  {
    seq: 6,
    name: 'validate_query',
    description: 'Inside the read subset',
    layer: 'agent',
    role: 'check',
    duration: '0.1s',
    note: 'passed',
  },
];

/** After the gate a person held open for two minutes. */
export const AFTER_GATE: Step[] = [
  {
    seq: 7,
    name: 'execute_query',
    description: 'The first try timed out; the second returned',
    layer: 'graph_data',
    role: 'read_only',
    duration: '2.1s',
    note: '1,284 rows',
  },
  {
    seq: 8,
    name: 'summarise',
    description: 'Six carriers account for 71% of the lateness',
    layer: 'llm',
    role: 'extract',
    duration: '0.9s',
    note: 'ok',
  },
  {
    seq: 9,
    name: 'deliver',
    description: 'Rows and summary handed to the canvas',
    layer: 'agent',
    role: 'spine',
    duration: '0.1s',
    note: 'done',
  },
];
