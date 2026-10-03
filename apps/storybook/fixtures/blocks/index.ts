import type { AskState, BlockKind, BlockOptionsByKind, PageSpec } from '@invana/blocks';
import type { AnswerTurn } from '@invana/assistant';

import activity from './activity.json';
import bars from './bars.json';
import cannot from './cannot.json';
import caveat from './caveat.json';
import citations from './citations.json';
import confirm from './confirm.json';
import files from './files.json';
import form from './form.json';
import gantt from './gantt.json';
import grid from './grid.json';
import heatstrip from './heatstrip.json';
import method from './method.json';
import metric from './metric.json';
import multi from './multi.json';
import multistep from './multistep.json';
import narrative from './narrative.json';
import page from './page.json';
import proposal from './proposal.json';
import quick from './quick.json';
import ranked from './ranked.json';
import record from './record.json';
import scope from './scope.json';
import single from './single.json';
import suggestions from './suggestions.json';
import table from './table.json';
import timeline from './timeline.json';
import timeseries from './timeseries.json';
import trace from './trace.json';

/**
 * One variant of a block, as its board on the Design Kit Spec draws it. `spec` is the block's
 * options — exactly what the API sends — so the `Blocks/Components/<Kind>` story, the
 * conversation's board and a dashboard panel all draw the same JSON. The rest is the shell's:
 * `state` and `value` for an answered ask, `turn` and `now` for the conversation.
 */
export interface BlockVariant<K extends BlockKind> {
  caption: string;
  /** Draw the cell at 280px — the board's "At 280px" variant. */
  narrow?: boolean;
  /** A width in px other than the board's 320 — a block the spec draws wider. */
  width?: number;
  /** Take the board's whole row — a strip or a table fitted to a dashboard's width. */
  wide?: boolean;
  spec: BlockOptionsByKind[K];
  state?: AskState;
  value?: unknown;
  /**
   * The conversation turn around it: its id, an ask's stage and answer time, and for an answer
   * the card's own fields (`label`, `title`, `state`, `envelope`, …) — anything `AnswerTurn`
   * takes. An answer whose block sits beside others lists them all in `blocks`.
   */
  turn: { id: string; stage?: string; answeredAt?: string; [field: string]: unknown };
  /** The clock an answered ask's time is read against (ISO 8601), so it reads the same every run. */
  now?: string;
}

// JSON widens `"strip"` to `string`; the shapes are the kinds' own, so this is the one cast.
const as = <K extends BlockKind>(_kind: K, data: unknown) => data as BlockVariant<K>[];

/** Every built kind's variants, keyed by kind. */
export const BLOCK_VARIANTS = {
  activity: as('activity', activity),
  bars: as('bars', bars),
  cannot: as('cannot', cannot),
  caveat: as('caveat', caveat),
  citations: as('citations', citations),
  confirm: as('confirm', confirm),
  files: as('files', files),
  form: as('form', form),
  gantt: as('gantt', gantt),
  grid: as('grid', grid),
  heatstrip: as('heatstrip', heatstrip),
  method: as('method', method),
  metric: as('metric', metric),
  multi: as('multi', multi),
  multistep: as('multistep', multistep),
  narrative: as('narrative', narrative),
  proposal: as('proposal', proposal),
  quick: as('quick', quick),
  ranked: as('ranked', ranked),
  record: as('record', record),
  scope: as('scope', scope),
  single: as('single', single),
  suggestions: as('suggestions', suggestions),
  table: as('table', table),
  timeline: as('timeline', timeline),
  timeseries: as('timeseries', timeseries),
  trace: as('trace', trace),
};

/**
 * A page of blocks: a `PageSpec` as the API sends it, or an answer turn opened in full —
 * the story turns that into a page with `answerToPage`, as a consumer does.
 */
export interface PageVariant {
  caption: string;
  wide?: boolean;
  spec?: PageSpec;
  answer?: AnswerTurn;
}

export const PAGE_VARIANTS = page as unknown as PageVariant[];
