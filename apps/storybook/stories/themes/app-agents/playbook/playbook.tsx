import * as React from 'react';
import type { BoardPagesSpec } from '@invana/boards';

/**
 * A story-only prototype of the playbook (RFC `feat-2026-10-05-the-work-cannot-be-played-step-by-step`,
 * revision 2). It knows no table and no canvas: a step is calls by a target's id, and the
 * playbook only holds the script, the position, and hands each target the calls addressed to
 * it. What a call does is the target's own business — see `table-ops.ts`.
 */

/** One thing a target is told: its id, the op, and the op's JSON arguments. */
export interface Call {
  target: string;
  op: string;
  args?: Record<string, unknown>;
}

/** One step: what should happen, as plain JSON. */
export interface Step {
  id: string;
  /** In the reader's words — `Mark Initech's growth`. */
  title: string;
  narration?: string;
  /** Who made the change — `assistant`, `user`, an agent's name. */
  actor?: string;
  /** The conversation turn the step answers. */
  turn?: string;
  calls: Call[];
}

export interface Playbook {
  version: 1;
  title?: string;
  steps: Step[];
}

/** What a target has been told: one entry per step that addressed it, in order. */
export interface Received {
  step: string;
  title: string;
  calls: Call[];
}

/** What a kind of component can be told — declared by the component, never by the playbook. */
export interface OpSet<S = unknown> {
  kind: string;
  ops: readonly string[];
  /** Problems with one call's args; empty means it can be played. */
  check(call: Call): string[];
  /** A pure target's state after one call. */
  apply?(state: S, call: Call): S;
}

/** Record a step — or say why not, and record nothing. */
export function appendStep(
  playbook: Playbook,
  step: Step,
  // All the playbook reads of an op set: what it takes, and whether a call's args do.
  { kindOf, ops }: { kindOf: (id: string) => string | undefined; ops: Record<string, Pick<OpSet, 'ops' | 'check'>> },
): { playbook: Playbook } | { problems: string[] } {
  const problems: string[] = [];
  if (playbook.steps.some((s) => s.id === step.id)) problems.push(`step id "${step.id}" is taken`);
  for (const call of step.calls) {
    const kind = kindOf(call.target);
    const set = kind ? ops[kind] : undefined;
    if (!kind) problems.push(`no target "${call.target}"`);
    else if (!set) problems.push(`"${call.target}" is a ${kind}, which takes no calls`);
    else if (!set.ops.includes(call.op)) problems.push(`a ${kind} has no op "${call.op}"`);
    else problems.push(...set.check(call).map((p) => `${call.target}.${call.op}: ${p}`));
  }
  return problems.length ? { problems } : { playbook: { ...playbook, steps: [...playbook.steps, step] } };
}

/** Every panel on every page, by id — what the host's `kindOf` reads — and the ids found twice. */
export function panelsOf(spec: BoardPagesSpec) {
  const panels = new Map<string, { page: string; kind: string }>();
  const duplicates: string[] = [];
  type Rows = { panels: { id?: string; kind: string }[] }[];
  type Board = { rows: Rows; tabs?: { rows: Rows }[]; inspector?: { spec: Board } };
  const walk = (page: string, board: Board) => {
    const rows = [...board.rows, ...(board.tabs ?? []).flatMap((t) => t.rows)];
    for (const panel of rows.flatMap((r) => r.panels)) {
      if (!panel.id) continue;
      if (panels.has(panel.id)) duplicates.push(panel.id);
      else panels.set(panel.id, { page, kind: panel.kind });
    }
    if (board.inspector) walk(page, board.inspector.spec);
  };
  for (const page of spec.pages) walk(page.id, page.board as unknown as Board);
  return { panels, duplicates };
}

// ── The router: the position, and each target's calls up to it ─────────────

const NONE: Received[] = [];

/** One step's calls grouped by target — the same objects every time, so a view can be compared by identity. */
const grouped = new WeakMap<Step, Map<string, Received>>();
function receivedOf(step: Step): Map<string, Received> {
  let byTarget = grouped.get(step);
  if (byTarget) return byTarget;
  byTarget = new Map();
  for (const call of step.calls) {
    const entry = byTarget.get(call.target) ?? { step: step.id, title: step.title, calls: [] };
    entry.calls.push(call);
    byTarget.set(call.target, entry);
  }
  grouped.set(step, byTarget);
  return byTarget;
}

class Router {
  private steps: readonly Step[] = [];
  private index = -1;
  private views = new Map<string, Received[]>();
  private owners = new Map<string, string>();
  private listeners = new Set<() => void>();

  update(steps: readonly Step[], index: number) {
    if (steps === this.steps && index === this.index) return;
    this.steps = steps;
    this.index = index;
    this.notify();
  }

  /** The current step's id, or `null` before the first. */
  current = () => this.steps[this.index]?.id ?? null;

  /**
   * The calls for `id` up to the position. The same array until they change, so only the
   * targets a move touched re-render. A second component under one id receives nothing.
   */
  received(id: string, owner: string): Received[] {
    const holder = this.owners.get(id);
    if (holder !== undefined && holder !== owner) return NONE;
    const next: Received[] = [];
    for (let i = 0; i <= this.index; i++) {
      const entry = receivedOf(this.steps[i]!).get(id);
      if (entry) next.push(entry);
    }
    const prior = this.views.get(id);
    if (prior && prior.length === next.length && prior.every((r, i) => r === next[i])) return prior;
    this.views.set(id, next);
    return next;
  }

  register(id: string, owner: string): () => void {
    const holder = this.owners.get(id);
    if (holder !== undefined && holder !== owner) {
      console.error(`Playbook: two components answer to "${id}"; the second receives no calls.`);
      return () => {};
    }
    this.owners.set(id, owner);
    this.notify();
    return () => {
      if (this.owners.get(id) === owner) this.owners.delete(id);
    };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => void this.listeners.delete(listener);
  };

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

const RouterContext = React.createContext<Router | null>(null);

export function PlaybookProvider({ router, children }: { router: Router; children: React.ReactNode }) {
  return <RouterContext.Provider value={router}>{children}</RouterContext.Provider>;
}

/** The position over the host's script. Headless: the host draws the controls. */
export function usePlaybook(playbook: Playbook, { follow = true } = {}) {
  const { steps } = playbook;
  // "latest" follows new steps; a step id holds still; null is before the first.
  const [at, setAt] = React.useState<'latest' | string | null>(follow ? 'latest' : (steps.at(-1)?.id ?? null));
  const index = at === 'latest' ? steps.length - 1 : at === null ? -1 : steps.findIndex((s) => s.id === at);
  const [router] = React.useState(() => new Router());
  // Before paint, so a target never shows a step it is not at.
  React.useLayoutEffect(() => router.update(steps, index), [router, steps, index]);
  const go = (to: number) => setAt(follow && to === steps.length - 1 ? 'latest' : (steps[to]?.id ?? null));
  const current = steps[index];
  return {
    router,
    steps,
    index,
    current,
    atLatest: index === steps.length - 1,
    canNext: index + 1 < steps.length,
    canPrevious: index >= 0,
    next: () => go(Math.min(index + 1, steps.length - 1)),
    previous: () => go(index - 1),
    goTo: (id: string | null) => go(id === null ? -1 : steps.findIndex((s) => s.id === id)),
    latest: () => go(steps.length - 1),
    /** The current step's targets — what the host brings into view. */
    targets: [...new Set(current?.calls.map((c) => c.target) ?? [])],
  };
}

export type PlaybookControls = ReturnType<typeof usePlaybook>;

/** The calls for `id` up to the position, and the step the playbook is at. Outside a provider: none. */
export function usePlayable(id: string | undefined): { received: Received[]; current: string | null } {
  const router = React.useContext(RouterContext);
  const owner = React.useId();
  React.useEffect(() => (router && id ? router.register(id, owner) : undefined), [router, id, owner]);
  const subscribe = React.useCallback((l: () => void) => router?.subscribe(l) ?? (() => {}), [router]);
  const received = React.useSyncExternalStore(
    subscribe,
    React.useCallback(() => (router && id ? router.received(id, owner) : NONE), [router, id, owner]),
  );
  const current = React.useSyncExternalStore(subscribe, router?.current ?? (() => null));
  return { received, current };
}

/** The state after a step, by the state before it and the step's entry — each fold done once. */
const folds = new WeakMap<object, WeakMap<Received, object>>();

/**
 * `base` with every received call applied. Each step's result is kept against the state it
 * started from, so moving back and forth refolds nothing already folded. A call that throws is
 * skipped alone and reported; the rest of its step applies.
 */
export function fold<S extends object>(
  base: S,
  received: readonly Received[],
  apply: (state: S, call: Call) => S,
  onError?: (call: Call, error: unknown) => void,
): S {
  let state = base;
  for (const entry of received) {
    let after = folds.get(state);
    if (!after) folds.set(state, (after = new WeakMap()));
    let next = after.get(entry) as S | undefined;
    if (!next) {
      next = entry.calls.reduce((s, call) => {
        try {
          return apply(s, call);
        } catch (error) {
          onError?.(call, error);
          return s;
        }
      }, state);
      after.set(entry, next);
    }
    state = next;
  }
  return state;
}

/** A pure target's state at the playbook's position. */
export function useReduced<S extends object>(
  base: S,
  received: readonly Received[],
  apply: (state: S, call: Call) => S,
  onError?: (call: Call, error: unknown) => void,
): S {
  // `onError` is a report, not an input.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => fold(base, received, apply, onError), [base, received, apply]);
}
