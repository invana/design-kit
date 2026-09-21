import type {
  LayerBand,
  LayerBracket,
  LayerItem,
  LayerPalette,
} from '@invana/ui';

/**
 * How these stories paint the layers — passed to the component as `palette`,
 * because the kit ships no hues of its own.
 *
 * Four are the data-palette slots `BoundChip` leaves free, so a layer and a
 * bound can sit in one row without sharing a hue between two vocabularies. Two
 * are deliberate:
 *
 * - `llm` takes `data-7`, the slot `BoundChip` gives the `llm` **bound**. Same
 *   concept, same hue.
 * - `agent` is left out. The spine is never governed and must not read as a
 *   bound somebody could set, so it falls through to the neutral — the token
 *   `BoundChip` spends on `none`, for the same reason: *nothing to set here*.
 *
 * `text` writes a participant's address in its layer's colour, so
 * `model/Orders@v2` and the `graph data` dot above it read as one thing. It is
 * the entry with a contrast floor to clear: `data-palette.css` carries a
 * light-mode WARN on aqua, yellow and magenta, so `cache` is the slot to watch
 * — and it is a layer that, here, declares nothing anyway.
 */
export const LAYER_PALETTE: LayerPalette = {
  graph_data: {
    swatch: 'bg-data-1',
    text: 'text-data-1',
  },
  llm: {
    swatch: 'bg-data-7',
    text: 'text-data-7',
  },
  third_party: {
    swatch: 'bg-data-8',
    text: 'text-data-8',
  },
  cache: {
    swatch: 'bg-data-3',
    text: 'text-data-3',
  },
  human: {
    swatch: 'bg-data-6',
    text: 'text-data-6',
  },
};

/**
 * `escalate-late-orders@7`, run twice — the same plan under two lenses.
 *
 * The plan cannot act until it knows **which** supplier is meant, so it comes
 * back to a person for it. `may_ask` and `max_rounds` are not the plan's: they
 * are the lens's, because a 3am scheduled run and an interactive question run
 * the same plan and its author cannot know which is happening. So the two runs
 * below differ in the lens alone, and the drawing shows what that one setting
 * costs in wall-clock time.
 *
 * Every figure is milliseconds from the run opening — `scale="elapsed"`, the
 * run tense. A plan of the same flow would be `scale="seq"` and read as order.
 */

/** The attended run — a person is reachable, and the rounds are drawn. */
export const RUN_BANDS: LayerBand[] = [
  {
    layer: 'human',
    note: '3 rounds · 6m 01s',
    parts: [
      {
        id: 'clarify',
        label: 'human/form/clarify',
        note: 'lens: max_rounds 3',
      },
    ],
  },
  { layer: 'agent', spine: true },
  { layer: 'cache', note: 'nothing declared' },
  {
    layer: 'llm',
    note: '2 roles · 57s',
    parts: [
      { id: 'decide', label: 'role: decide' },
      { id: 'extract', label: 'role: extract', note: 'reads each reply' },
    ],
  },
  {
    layer: 'graph_data',
    note: '1 · 42s',
    parts: [{ id: 'orders', label: 'model/Orders@v2' }],
  },
  {
    layer: 'third_party',
    note: '1 · 12s',
    parts: [
      { id: 'email', label: 'third_party/app/email', note: 'egress: the note' },
    ],
  },
];

export const RUN_ITEMS: LayerItem[] = [
  { id: 'open', label: 'open', layer: 'agent', start: 0, end: 3_000, state: 'out' },
  {
    id: 'plan',
    label: 'plan',
    layer: 'llm',
    part: 'decide',
    start: 3_000,
    end: 25_000,
    state: 'out',
    note: 'decide',
  },
  {
    id: 'fetch_orders',
    label: 'fetch',
    layer: 'graph_data',
    part: 'orders',
    start: 25_000,
    end: 55_000,
    state: 'in',
    note: 'late',
  },

  // Round 1 — the agent dispatches, then holds for 2m 33s.
  {
    id: 'ask_1',
    label: 'ask',
    layer: 'agent',
    start: 60_000,
    end: 62_000,
    state: 'out',
    note: 'round 1',
  },
  {
    id: 'clarify_1',
    label: 'clarify',
    layer: 'human',
    part: 'clarify',
    start: 62_000,
    end: 215_000,
    state: 'in',
    note: '2m 33s waited',
  },
  {
    id: 'read_1',
    label: 'read',
    layer: 'llm',
    part: 'extract',
    start: 215_000,
    end: 222_000,
    state: 'out',
    note: 'vague',
  },

  // Round 2 — the reply named two suppliers, so the slice widens.
  {
    id: 'ask_2',
    label: 'ask',
    layer: 'agent',
    start: 223_000,
    end: 225_000,
    state: 'out',
    note: 'round 2',
  },
  {
    id: 'clarify_2',
    label: 'clarify',
    layer: 'human',
    part: 'clarify',
    start: 225_000,
    end: 378_000,
    state: 'in',
    note: '2m 33s waited',
  },
  {
    id: 'read_2',
    label: 'read',
    layer: 'llm',
    part: 'extract',
    start: 378_000,
    end: 385_000,
    state: 'out',
    note: '2 more',
  },
  {
    id: 'widen_slice',
    label: 'widen',
    layer: 'graph_data',
    part: 'orders',
    start: 385_000,
    end: 397_000,
    state: 'in',
    note: '+2',
  },

  // Round 3 — the last one the lens allows.
  {
    id: 'ask_3',
    label: 'ask',
    layer: 'agent',
    start: 398_000,
    end: 400_000,
    state: 'out',
    note: 'round 3',
  },
  {
    id: 'clarify_3',
    label: 'clarify',
    layer: 'human',
    part: 'clarify',
    start: 400_000,
    end: 455_000,
    state: 'in',
    note: '55s waited',
  },
  {
    id: 'read_3',
    label: 'read',
    layer: 'llm',
    part: 'extract',
    start: 455_000,
    end: 462_000,
    state: 'out',
    note: 'narrow',
  },

  // Round 4 — asked, and refused by the bound the lens set.
  {
    id: 'clarify_4',
    label: 'clarify',
    layer: 'human',
    part: 'clarify',
    start: 515_000,
    end: 517_000,
    state: 'refused',
    note: 'round 4',
    ruleMatched: 'human/** · max_rounds 3',
  },

  {
    id: 'decide',
    label: 'decide',
    layer: 'llm',
    part: 'decide',
    start: 518_000,
    end: 532_000,
    state: 'out',
    note: 'anyway',
  },
  {
    id: 'send',
    label: 'send',
    layer: 'third_party',
    part: 'email',
    start: 533_000,
    end: 545_000,
    state: 'out',
    note: 'note',
  },
  {
    id: 'answer',
    label: 'answer',
    layer: 'agent',
    start: 546_000,
    end: 549_000,
    state: 'out',
  },
];

/**
 * A round is dispatch → reply → read, not just the wait — the bracket spans
 * what the repetition actually costs, which is what makes *max 3* a number
 * with a price rather than a setting.
 */
export const RUN_BRACKETS: LayerBracket[] = [
  { id: 'r1', start: 60_000, end: 222_000, label: 'round 1' },
  { id: 'r2', start: 223_000, end: 385_000, label: 'round 2' },
  { id: 'r3', start: 398_000, end: 462_000, label: 'round 3' },
];

/** The same plan, same question, under a lens that says `may_ask: false`. */
export const UNATTENDED_BANDS: LayerBand[] = [
  {
    layer: 'human',
    note: '0 rounds',
    parts: [
      {
        id: 'clarify',
        label: 'human/form/clarify',
        note: 'lens: may_ask false',
      },
    ],
  },
  { layer: 'agent', spine: true },
  { layer: 'cache', note: 'nothing declared' },
  {
    layer: 'llm',
    note: '1 role · 16s',
    parts: [
      { id: 'decide', label: 'role: decide' },
      { id: 'extract', label: 'role: extract', note: 'never reached' },
    ],
  },
  {
    layer: 'graph_data',
    note: '1 · 26s',
    parts: [{ id: 'orders', label: 'model/Orders@v2' }],
  },
  {
    layer: 'third_party',
    note: '1 · none',
    parts: [
      { id: 'email', label: 'third_party/app/email', note: 'never reached' },
    ],
  },
];

export const UNATTENDED_ITEMS: LayerItem[] = [
  { id: 'open', label: 'open', layer: 'agent', start: 0, end: 600, state: 'out' },
  {
    id: 'plan',
    label: 'plan',
    layer: 'llm',
    part: 'decide',
    start: 600,
    end: 17_000,
    state: 'out',
    note: 'decide',
  },
  {
    id: 'fetch_orders',
    label: 'fetch',
    layer: 'graph_data',
    part: 'orders',
    start: 17_000,
    end: 43_000,
    state: 'in',
    note: 'late',
  },
  {
    id: 'clarify_1',
    label: 'clarify',
    layer: 'human',
    part: 'clarify',
    start: 43_000,
    end: 43_400,
    state: 'refused',
    note: 'round 1',
    ruleMatched: 'human/** · may_ask false',
  },
  {
    id: 'answer',
    label: 'answer',
    layer: 'agent',
    start: 44_000,
    end: 46_500,
    state: 'out',
    note: 'no ask',
  },
];
