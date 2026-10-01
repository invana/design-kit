import type { Layer } from "../layer-chip"

/**
 * What a touch did. `read` · `write` · `egress` are the ones drawn specially;
 * anything else is accepted and drawn as a read.
 */
export type AccessOp = "read" | "write" | "egress" | (string & {})

/** One target's total for one window — `graph_data · Company · read · 1,204`. */
export interface AccessCount {
  layer: Layer
  /** The target's identifier inside its layer — `Company.revenue`, `websearch`. */
  target: string
  /** What to call it, when the identifier is not what a reader says. */
  label?: string
  op: AccessOp
  count: number
}

/**
 * Which individual events matter enough to travel one by one. **Suggestions,
 * not a limit** — an unknown kind is listed with its own name.
 */
export type AccessEventKind =
  | "egress"
  | "refused"
  | "first_seen"
  | "error"
  | (string & {})

/** One individual event: rare, and never summed away. */
export interface AccessEvent {
  id: string
  at: string
  kind: AccessEventKind
  layer: Layer
  target: string
  label?: string
  /** Where it went, for an egress — `api.crunchbase.com`. */
  to?: string
  /** What was carried or why it was stopped — `property_values`, `bound: no-pii`. */
  detail?: string
}

/** The step the agent is in, as the server marks it. */
export interface AccessStepMark {
  id: string
  label: string
  state: "open" | "closed"
}

/**
 * One window of access, **summed by the server**. The browser never receives
 * the raw touches — at 10k/s that would be bandwidth and parsing spent on
 * something no reader could see. Counts arrive per window; the few events
 * worth reading one by one ride along in `events`.
 */
export interface AccessWindow {
  /** Increments by one per window. A jump is a gap, drawn as such. */
  seq: number
  /** When the window started. */
  at: string
  /** How long the window is — `250`. Carried, never assumed. */
  windowMs: number
  counts: AccessCount[]
  events?: AccessEvent[]
  step?: AccessStepMark
}

/** A target the board should show before anything touches it. */
export interface AccessDeclared {
  layer: Layer
  target: string
  label?: string
}

export interface AccessTargetState {
  key: string
  layer: Layer
  target: string
  label: string
  /** 0…1, on a log scale of rate, decaying between windows. What a tile glows. */
  heat: number
  /** Touches per second in the latest window. */
  rate: number
  total: number
  /** The ops seen in the latest window with a count. */
  ops: AccessOp[]
  /** Rate per window, oldest first — for a sparkline. */
  history: number[]
  /** A guardrail said no at least once. Kept, never faded. */
  refused: boolean
  /** Named before anything touched it. */
  declared: boolean
  /** The `seq` at which this target last went from cold to active. */
  wokeAt?: number
}

export interface AccessStepState extends AccessStepMark {
  at: string
  total: number
}

export interface AccessSnapshot {
  /** In declared order, then in order of first touch. */
  targets: AccessTargetState[]
  /** Newest first. */
  events: AccessEvent[]
  /** Newest first. */
  steps: AccessStepState[]
  seq: number
  /** Windows the stream skipped over. */
  gaps: number
  windowMs: number
  /** Touches per second across every target, latest window. */
  rate: number
  /** `Date.now()` when the latest window arrived; `0` before the first. */
  receivedAt: number
}

export interface AccessStoreOptions {
  declared?: AccessDeclared[]
  /** The rate that glows full — heat is `log(1+rate) / log(1+maxRate)`. */
  maxRate?: number
  /** How long a target takes to cool to ~37% once it stops. */
  decayMs?: number
  /** Windows of rate kept per target. */
  historyLength?: number
  /** Individual events kept. */
  maxEvents?: number
  /** Steps kept. */
  maxSteps?: number
}

export interface AccessStore {
  push(window: AccessWindow): void
  reset(): void
  subscribe(listener: () => void): () => void
  getSnapshot(): AccessSnapshot
}

/** The identity of a target across layers — two layers may share a name. */
export const accessKey = (layer: Layer, target: string) => `${layer}␟${target}`

const COLD = 0.01

const EMPTY: AccessSnapshot = {
  targets: [],
  events: [],
  steps: [],
  seq: 0,
  gaps: 0,
  windowMs: 0,
  rate: 0,
  receivedAt: 0,
}

/**
 * Folds summed windows into what a board and a stream draw.
 *
 * Outside React on purpose: a window lands, the snapshot is rebuilt once, and
 * every subscriber reads the same frame through `useSyncExternalStore`. Nothing
 * here is per touch — the server has already summed them.
 */
export function createAccessStore(options: AccessStoreOptions = {}): AccessStore {
  const {
    declared = [],
    maxRate = 10_000,
    decayMs = 1_500,
    historyLength = 40,
    maxEvents = 200,
    maxSteps = 50,
  } = options

  let snapshot = EMPTY
  const listeners = new Set<() => void>()

  const seed = (): AccessSnapshot => ({
    ...EMPTY,
    targets: declared.map((d) => ({
      key: accessKey(d.layer, d.target),
      layer: d.layer,
      target: d.target,
      label: d.label ?? d.target,
      heat: 0,
      rate: 0,
      total: 0,
      ops: [],
      history: [],
      refused: false,
      declared: true,
    })),
  })
  snapshot = seed()

  const emit = () => listeners.forEach((l) => l())

  const push = (w: AccessWindow) => {
    const prev = snapshot
    const perSecond = 1_000 / w.windowMs
    const decay = Math.exp(-w.windowMs / decayMs)

    // Sum this window's counts per target; a target can arrive once per op.
    const inWindow = new Map<string, { c: AccessCount; count: number; ops: AccessOp[] }>()
    for (const c of w.counts) {
      const key = accessKey(c.layer, c.target)
      const hit = inWindow.get(key)
      if (hit) {
        hit.count += c.count
        if (!hit.ops.includes(c.op)) hit.ops.push(c.op)
      } else {
        inWindow.set(key, { c, count: c.count, ops: [c.op] })
      }
    }

    const refusedNow = new Set(
      (w.events ?? [])
        .filter((e) => e.kind === "refused")
        .map((e) => accessKey(e.layer, e.target)),
    )

    const next = (t: AccessTargetState): AccessTargetState => {
      const hit = inWindow.get(t.key)
      const rate = hit ? hit.count * perSecond : 0
      const instant = Math.min(1, Math.log1p(rate) / Math.log1p(maxRate))
      const cooled = t.heat * decay
      const heat = Math.max(instant, cooled < COLD ? 0 : cooled)
      const history = [...t.history, rate]
      return {
        ...t,
        heat,
        rate,
        total: t.total + (hit?.count ?? 0),
        ops: hit?.ops ?? [],
        history: history.length > historyLength ? history.slice(-historyLength) : history,
        refused: t.refused || refusedNow.has(t.key),
        wokeAt: t.heat === 0 && heat > 0 ? w.seq : t.wokeAt,
      }
    }

    const known = new Set(prev.targets.map((t) => t.key))
    const fresh: AccessTargetState[] = []
    const addFresh = (layer: Layer, target: string, label?: string) => {
      const key = accessKey(layer, target)
      if (known.has(key)) return
      known.add(key)
      fresh.push({
        key,
        layer,
        target,
        label: label ?? target,
        heat: 0,
        rate: 0,
        total: 0,
        ops: [],
        history: [],
        refused: false,
        declared: false,
      })
    }
    // A target nobody declared still gets a tile — it is never dropped.
    for (const { c } of inWindow.values()) addFresh(c.layer, c.target, c.label)
    for (const e of w.events ?? []) addFresh(e.layer, e.target, e.label)

    const targets = [...prev.targets, ...fresh].map(next)
    const windowTotal = w.counts.reduce((sum, c) => sum + c.count, 0)

    let steps = prev.steps
    if (w.step) {
      const at = steps.findIndex((s) => s.id === w.step!.id)
      if (at === -1) {
        steps = [{ ...w.step, at: w.at, total: windowTotal }, ...steps].slice(0, maxSteps)
      } else {
        steps = steps.map((s, i) =>
          i === at ? { ...s, ...w.step!, total: s.total + windowTotal } : s,
        )
      }
    }

    snapshot = {
      targets,
      events: [...(w.events ?? []).slice().reverse(), ...prev.events].slice(0, maxEvents),
      steps,
      seq: w.seq,
      gaps: prev.gaps + (prev.seq && w.seq > prev.seq + 1 ? w.seq - prev.seq - 1 : 0),
      windowMs: w.windowMs,
      rate: windowTotal * perSecond,
      receivedAt: Date.now(),
    }
    emit()
  }

  return {
    push,
    reset: () => {
      snapshot = seed()
      emit()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
  }
}

const compact = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
})

/** `8.2K/s`; `—` for nothing, so an idle tile does not read as a measured zero. */
export const formatRate = (rate: number) =>
  rate > 0 ? `${compact.format(rate < 1 ? Math.round(rate * 10) / 10 : Math.round(rate))}/s` : "—"

/** A total, compact — `1.2M`. */
export const formatCount = (n: number) => compact.format(n)
