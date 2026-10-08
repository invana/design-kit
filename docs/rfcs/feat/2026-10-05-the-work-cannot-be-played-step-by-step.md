---
id: feat-2026-10-05-the-work-cannot-be-played-step-by-step
type: feat
title: A table or a canvas is told what to do by its id, in JSON steps that can be played, stepped back through and attributed
status: proposed
opened: 2026-10-05
decided: null
landed: null
packages: [pkg:@invana/ui, pkg:@invana/tables, pkg:@invana/blocks, pkg:@invana/boards, pkg:@invana/stoybook, ext:@invana/canvas-ui]
design_of_record: null
relations:
  - { predicate: generalises, object: "ext:canvas/rfc:feat-2026-09-28-an-analysis-cannot-be-recorded-or-replayed" }
  - { predicate: relates-to, object: story:Themes/AppAgents/Default }
---

# A table or a canvas is told what to do by its id, in JSON steps

| | |
|---|---|
| **Motivation** | In the agents shell the agent's work opens beside the conversation. Turn after turn the agent changes it: updates a table's cells, marks rows and cells and says why, adds nodes to a graph and focuses them. Today none of that can be sent: a table cannot be marked by cell or annotated, rows are addressed by index, a canvas on a board cannot be reached, and nothing records the changes as steps a reader can step back through |
| **Design** | **The component owns the capability; the playbook only calls it.** A table and a canvas each declare an **op set** — the things they can be told (`setCell`, `mark`, `addData`, `focus`, …). A **step** is a list of **calls**: `{ target: <id>, op, args }`. The **playbook** is a script, a position and a router: it hands each target, by id, the calls addressed to it up to the position — and nothing else. How a target gets there is the target's own business: a table folds its calls over its rows (so stepping back is folding fewer); a canvas turns them into its engine's own playbook steps and goes to one |
| **Scope** | Table and canvas. A board, dashboard or chart becomes a target the same way later (§4, deferred) — the playbook does not change for them |
| **Design discussion** | This document; revision 2 (2026-10-05) replaces revision 1, which made steps patches to the board spec |
| **Row status** | proposed 15 · accepted 0 · implemented 0 · landed 0 · deferred 9 · rejected 0 |
| **Open decisions** | D-8 (revised), D-9, D-10 (§7) |

## 0. The big picture

```
┌─ AppLayoutAgents ──────────────────────────────────────────────────────────────┐
│ ChatSession                         │ BoardPages                               │
│                                     │ ┌ Top accounts  (id: top-accounts) ────┐ │
│ answer a2 ──────────────────────────┼▶│ Initech Cloud │ $1.2M │  -4%  ◉ note │ │
│                                     │ └──────────────────────────────────────┘ │
│ answer a5 ──────────────────────────┼▶┌ Graph  (id: graph) ──────────────────┐ │
│                                     │ │ + Sequoia, a16z — focused            │ │
│                                     │ └──────────────────────────────────────┘ │
│                                     │  ◀  Step 4 / 5 · Initech's investors  ▶  │
└─────────────────────────────────────┴──────────────────────────────────────────┘

API ─▶ host ─┬─ ConversationPatch ─────────▶ ChatSession                 (exists)
             └─ Step { calls: [{ target, op, args }] }
                    │ appendStep — checked against the targets' op sets, then recorded
                    ▼
             Playbook  (script + position + router — knows no table, no canvas)
                    │ usePlayable(id) → the calls for `id`, up to the position
          ┌─────────┴───────────┐
   DataTable id="top-accounts"   Canvas id="graph"
   folds calls over its rows     turns them into canvas.playbook steps, goTo
   (tableOps — @invana/tables)   (canvasOps — @invana/canvas-ui)
```

- **One concept everywhere**: a component that can be told things declares them; anything that has an id and an op set can be played. The agent, a recorded walkthrough and a live feed all speak the same calls.
- **The playbook never asks how.** It does not know what a row, a mark or a node is. Whether `mark` can be done is the table's question, answered once by its op set.

## 1. Motivation

| ID | Observation | Where | Evidence |
|---|---|---|---|
| M1 | A table highlights whole rows **by index**, one style, no reason. No cell, no tone, no note | `table.highlight: number[]` (`file:packages/blocks/src/types.ts#L103`); `DataTable`'s `isCellHighlighted` (`file:packages/tables/src/core/table-grid.tsx#L423`) unused by the block | The agent cannot point at one cell or say why |
| M2 | A table's rows cannot be addressed by what names them. Patches find list items by `key` / `id`; a table's rows are named by `rowKey` (`account`) | `identity()` in `file:packages/blocks/src/stream/patch.ts#L45` | "Set Initech's growth" can only be sent by index, which a pushed or removed row breaks |
| M3 | The canvas has a full playbook, but only code holding the `Canvas` can drive it. A canvas on a board receives JSON options only | `ext:canvas` `sym:Playbook`; `CanvasPanel` reads `dataRef` / `config` | "Add these investors and focus them" cannot reach a canvas on a board |
| M4 | Changes to the work only stream forward, with no title, no author and no way back | `useStreamedSpec` (`file:packages/blocks/src/stream/use-stream.ts`) | A reader cannot step back to "before the agent marked Initech"; nobody can tell the agent's change from the user's |
| M5 | Nothing says which component an id names. On a board, two panels with one id are both patched, silently | `onRows` in `file:packages/boards/src/stream.ts#L32` | A call "to `q3`" could land on a table and a chart at once |

### Ruled out

| ID | Option | Why not |
|---|---|---|
| R1 | **Steps as patches to the board spec** (revision 1: `patch-panel` with paths like `["rows", { "account": … }, …]`) | The step language leaks every component's spec shape; the board — and so the playbook — must know how a table's options are laid out. A component cannot change its internals without breaking recorded steps. The maintainer's rule: the playbook calls what a component supports and does no component logic |
| R2 | A playbook per component kind | Three scripts, three positions, three bars; one agent turn that marks a cell and focuses nodes would be steps in two places |
| R3 | Calls as imperative methods on a ref (`tableRef.current.mark(…)`) | Nothing survives a remount or a page shown later; stepping back needs every component to write an undo; the work can no longer be saved as JSON. Calls stay **data**, delivered by id, folded by the component |
| R4 | An operation log for the work, like the canvas's | A table folds its calls again from its base — exact, cheap, no undo code. Only an engine (the canvas) needs a log, and it has its own |

## 2. Design

| Step | Mechanism | Consequence |
|---|---|---|
| G1 | **A component declares its op set** — `OpSet { kind, ops, check(call), apply?(state, call), merge?(a, b) }` — in its own package: `tableOps` in `@invana/tables`, `canvasOps` in `@invana/canvas-ui` | The capability lives with the component; a table used anywhere (a board, an answer, Studio) is playable |
| G2 | **A step is calls by id**: `Step { id, title, narration?, actor?, turn?, live?, calls: Call[] }`, `Call { target, op, args }` — the canvas `StepSpec`'s names wherever they mean the same | The agent's language is the components' own verbs, never their internals |
| G3 | **The playbook is a script, a position and a router.** `usePlaybook(playbook)` holds the position; `<PlaybookProvider>` routes; `usePlayable(id)` gives a target the calls addressed to it, grouped by step, up to the position | The playbook has no table or canvas logic |
| G4 | **A target reaches its position its own way.** A *pure* target (table) folds its calls over its base with its `apply` — stepping back is folding fewer, cached per step. An *engine* target (canvas) turns each step's calls into one engine step and goes to it with its own playbook | No undo code in the kit; the canvas keeps its log |
| G5 | **Check before recording.** `appendStep(playbook, step, { kindOf, ops })` returns the problems — unknown target, an op the target's kind does not declare, args its `check` rejects, a duplicate step id — and records nothing if there are any | A bad step never enters the record, so it cannot break the steps after it; the host sends the problems back to the agent |
| G6 | **An id names one target.** A target registers its id with the provider on mount; a second registration of one id is an error in development and receives no calls | A call lands on exactly one component |
| G7 | **Follow the latest.** At the newest step a new step plays; stepped back, new steps wait (pending on the bar) | The agent never moves the work away from a reader who is looking back |
| G8 | **A live feed merges into an open step** (D-6). `feedStep(playbook, source, calls)` appends to the last step while it is that source's live step; any other step seals it; sealing merges consecutive calls with the target's `merge`; a step holds at most `maxCalls` (default 1,000) before a new one opens | Live data and the agent's steps share one record and one position |
| G9 | **Only touched targets re-render.** The provider's store is stable; `usePlayable(id)` subscribes with a per-target selector that returns the same array until that target's calls change | A step that marks one of thirty tables re-draws one table |
| G10 | **The host shows the change.** The playbook reports the current step's targets; the host shows the page that holds them (`BoardPages` is controlled by `active` + `selectAction`, as today) | No board change in phase 1 |
| G11 | **Headless hook + one bar.** `PlaybookBar` (title, narration, actor, `n / N`, ◀ ▶, a dot per step — played / current / pending / live) | Studio and the stories compose it alike |

### 2.1 The playbook core (`@invana/ui`, `src/lib/playbook/`)

```ts
/** One thing a target is told: its id, the op, and the op's JSON arguments. */
export interface Call {
  target: string
  op: string
  args?: Record<string, unknown>
}

/** One step: what should happen, as plain JSON. */
export interface Step {
  id: string
  /** In the reader's words — `Mark Initech's growth`. */
  title: string
  narration?: string
  /** Who made the change — `assistant`, `user`, an agent's name. */
  actor?: string
  /** The conversation turn the step answers. */
  turn?: string
  /** The engine's own data; never read here. */
  meta?: unknown
  /** Set while a live feed writes this step: the feed's source (G8). */
  live?: string
  calls: Call[]
}

export interface Playbook {
  version: 1
  title?: string
  steps: Step[]
}

/** What a target has been told, one entry per step that addressed it, in order. */
export interface Received {
  step: string
  title: string
  calls: Call[]
}

/**
 * What a kind of component can be told — declared by the component's own
 * package. The playbook reads only `ops` and `check`; the component uses the rest.
 */
export interface OpSet<S = unknown> {
  kind: string
  ops: readonly string[]
  /** Problems with one call's args; empty means it can be played. */
  check(call: Call): string[]
  /** A pure target's state after one call. An engine target has none. */
  apply?(state: S, call: Call): S
  /** Two consecutive calls as one, when a live step is sealed; `undefined` when they cannot merge. */
  merge?(a: Call, b: Call): Call | undefined
}
```

```ts
/** Record a step — or say why not, and record nothing (G5). */
export function appendStep(
  playbook: Playbook,
  step: Step,
  { kindOf, ops }: { kindOf: (id: string) => string | undefined; ops: Record<string, OpSet<any>> },
): { playbook: Playbook } | { problems: string[] } {
  const problems: string[] = []
  if (playbook.steps.some((s) => s.id === step.id)) problems.push(`step id "${step.id}" is taken`)
  for (const call of step.calls) {
    const kind = kindOf(call.target)
    const set = kind ? ops[kind] : undefined
    if (!kind) problems.push(`no target "${call.target}"`)
    else if (!set) problems.push(`"${call.target}" is a ${kind}, which takes no calls`)
    else if (!set.ops.includes(call.op)) problems.push(`a ${kind} has no op "${call.op}"`)
    else problems.push(...set.check(call).map((p) => `${call.target}.${call.op}: ${p}`))
  }
  return problems.length ? { problems } : { playbook: { ...playbook, steps: [...playbook.steps, step] } }
}
```

```ts
/** The position over the host's script (D-3). Headless. */
export function usePlaybook(playbook: Playbook, { follow = true } = {}) {
  const { steps } = playbook
  // "latest" follows new steps; a step id holds still; null is before the first.
  const [at, setAt] = React.useState<"latest" | string | null>(follow ? "latest" : (steps.at(-1)?.id ?? null))
  const index = at === "latest" ? steps.length - 1 : at === null ? -1 : steps.findIndex((s) => s.id === at)
  const store = useRouter(steps, index) // stable object; notifies only targets whose slice changed (G9)
  const go = (to: number) => setAt(follow && to === steps.length - 1 ? "latest" : (steps[to]?.id ?? null))
  return {
    store,
    steps,
    index,
    current: steps[index],
    atLatest: index === steps.length - 1,
    canNext: index + 1 < steps.length,
    canPrevious: index >= 0,
    next: () => go(Math.min(index + 1, steps.length - 1)),
    previous: () => go(index - 1),
    goTo: (id: string | null) => go(id === null ? -1 : steps.findIndex((s) => s.id === id)),
    latest: () => go(steps.length - 1),
    /** The current step's targets — what the host brings into view (G10). */
    targets: [...new Set(steps[index]?.calls.map((c) => c.target) ?? [])],
  }
}

/** The calls for `id` up to the position. Registers `id` (G6). Outside a provider: none. */
export function usePlayable(id: string | undefined, kind: string): Received[]

/** A pure target's state: `base` with every received call applied, cached per step (G4). */
export function useReduced<S>(base: S, received: Received[], apply: (state: S, call: Call) => S): S {
  const cache = React.useRef<{ base: S; received: Received[]; states: S[] }>()
  return React.useMemo(() => {
    const prior = cache.current?.base === base ? cache.current : undefined
    let keep = 0
    while (prior && keep < prior.received.length && keep < received.length && prior.received[keep] === received[keep]) keep++
    const states = prior ? prior.states.slice(0, keep) : []
    for (let i = keep; i < received.length; i++) {
      states.push(received[i]!.calls.reduce(apply, i === 0 ? base : states[i - 1]!))
    }
    cache.current = { base, received, states }
    return received.length ? states[received.length - 1]! : base
  }, [base, received, apply])
}
```

### 2.2 The table (`@invana/tables`)

Marks and notes are the **table component's** feature: `DataTable` draws them from props, with or without a playbook. The op set is the table's too, so any `DataTable` with an `id` and a `rowKey` is playable.

```ts
// packages/tables/src/marks.ts
import type { MarkTone } from "@invana/ui" // the tone MarkChip already uses (D-9)

/** A row — or, with `column`, one cell — called out, and why. */
export interface TableMark {
  /** The row's `rowKey` value. */
  row: string
  column?: string
  tone?: MarkTone
  /** Why — a popover on the cell, or on the row's first cell. */
  note?: string
  /** The note is open. A new mark opens; the reader can close it. One open at a time. */
  open?: boolean
}

// DataTable gains:
//   id?: string             — playable under this id inside a PlaybookProvider
//   rowKey?: string         — the column whose value names a row (required for marks and calls)
//   marks?: TableMark[]     — drawn with or without a playbook
//   selectedKey?: string | null
```

```ts
// packages/tables/src/playbook.ts — what a table can be told
type Row = Record<string, unknown>
export interface TableState { rowKey: string; rows: Row[]; marks: TableMark[]; selected?: string | null }

export const TABLE_OPS = ["setRows", "upsertRows", "removeRows", "setCell", "mark", "unmark", "select"] as const

export const tableOps: OpSet<TableState> = {
  kind: "table",
  ops: TABLE_OPS,
  check: checkTableCall, // args shape per op — `setCell` needs row, column, value; `upsertRows.keep` a positive integer
  apply(s, { op, args = {} }) {
    const key = (r: Row) => String(r[s.rowKey])
    switch (op) {
      case "setRows":
        return { ...s, rows: args.rows as Row[] }
      case "upsertRows": {
        const incoming = new Map((args.rows as Row[]).map((r) => [key(r), r]))
        const rows = s.rows.map((r) => (incoming.has(key(r)) ? { ...r, ...incoming.get(key(r)) } : r))
        const known = new Set(s.rows.map(key))
        const all = [...rows, ...(args.rows as Row[]).filter((r) => !known.has(key(r)))]
        // `keep` bounds a live feed: the last N rows stay.
        return { ...s, rows: typeof args.keep === "number" ? all.slice(-args.keep) : all }
      }
      case "removeRows": {
        const gone = new Set(args.keys as string[])
        return { ...s, rows: s.rows.filter((r) => !gone.has(key(r))), marks: s.marks.filter((m) => !gone.has(m.row)) }
      }
      case "setCell": {
        const { row, column, value } = args as { row: string; column: string; value: unknown }
        if (!s.rows.some((r) => key(r) === row)) throw new TableCallError(`no row "${row}"`)
        return { ...s, rows: s.rows.map((r) => (key(r) === row ? { ...r, [column]: value } : r)) }
      }
      case "mark": {
        // A mark replaces the one on the same row and column.
        const next = args.marks as TableMark[]
        const same = (a: TableMark, b: TableMark) => a.row === b.row && (a.column ?? null) === (b.column ?? null)
        return { ...s, marks: [...s.marks.filter((m) => !next.some((n) => same(m, n))), ...next] }
      }
      case "unmark": {
        // No args clears every mark; a row clears that row's; a row and column, that cell's.
        const { row, column } = args as { row?: string; column?: string }
        if (row === undefined) return { ...s, marks: [] }
        return { ...s, marks: s.marks.filter((m) => m.row !== row || (column !== undefined && m.column !== column)) }
      }
      case "select":
        return { ...s, selected: (args.row as string | null) ?? null }
    }
    return s
  },
  merge(a, b) {
    if (a.target !== b.target || a.op !== b.op) return undefined
    if (a.op === "setCell" && a.args?.row === b.args?.row && a.args?.column === b.args?.column) return b
    if (a.op === "upsertRows") return { ...b, args: { ...b.args, rows: [...(a.args!.rows as Row[]), ...(b.args!.rows as Row[])] } }
    if (a.op === "mark") return { ...b, args: { marks: [...(a.args!.marks as TableMark[]), ...(b.args!.marks as TableMark[])] } }
    return undefined
  },
}
```

```tsx
// packages/tables/src/data-table.tsx — the parts that change
const received = usePlayable(id, "table")
const live = useReduced<TableState>(
  React.useMemo(() => ({ rowKey, rows: data, marks: marks ?? [], selected: selectedKey }), [rowKey, data, marks, selectedKey]),
  received,
  tableOps.apply!,
)
// Draw `live.rows`, `live.marks` and `live.selected`. A cell's mark outranks its row's;
// the tone is a token class (`bg-info/10`, `bg-destructive/10`, …); a note wraps the cell's
// text in a `Popover` trigger with a dot. A call that throws is skipped and reported
// through `onPlaybackError` — the rest of the step still applies.
```

The `table` block passes its panel or answer `id`, `rowKey`, `marks` and `selected` through to `DataTable`, and retires `highlight` for `marks` (D-1). A table in a conversation answer is playable by the same calls.

A step the agent sends, by the table's id:

```json
{
  "id": "s2", "title": "Initech turned negative", "actor": "assistant", "turn": "a2",
  "narration": "Initech's growth fell from +6% to −4% this quarter.",
  "calls": [
    { "target": "top-accounts", "op": "setCell",
      "args": { "row": "Initech Cloud", "column": "growth", "value": { "value": "-4%", "tone": "bad" } } },
    { "target": "top-accounts", "op": "mark", "args": { "marks": [
      { "row": "Initech Cloud", "column": "growth", "tone": "destructive", "open": true,
        "note": "Down from +6% last quarter — the only account shrinking." },
      { "row": "Acme Robotics", "tone": "info" } ] } },
    { "target": "funding", "op": "upsertRows", "args": { "rows": [
      { "account": "Initech Cloud", "round": "Bridge", "amount": "$8M", "date": "2026-09-30" } ] } }
  ]
}
```

### 2.3 The canvas (`@invana/canvas-ui`, phase 2)

The canvas's op set is its own `StepSpec`, verb by verb. The canvas turns one step's calls into one engine step (id = the step's id) and steers its own playbook — its log does the going back.

```ts
// ext: packages/canvas-ui/src/playbook/canvasOps.ts
export const CANVAS_OPS = ["addData", "removeData", "hide", "show", "focus", "select", "inspect", "camera", "settings", "command"] as const

/** One step's calls to this canvas as one canvas `StepSpec`. */
export function toStepSpec(r: Received): StepSpec<CanvasConfig> {
  const spec: StepSpec<CanvasConfig> = { id: r.step, title: r.title }
  const view = (spec.view ??= {})
  for (const { op, args = {} } of r.calls) {
    if (op === "addData") spec.data = mergeDelta(spec.data, { added: args })
    if (op === "removeData") spec.data = mergeDelta(spec.data, { removed: args })
    if (op === "hide") spec.data = mergeDelta(spec.data, { hidden: args })
    if (op === "show") spec.data = mergeDelta(spec.data, { shown: args })
    if (op === "focus") view.focus = (args.ids ? args : null) as never
    if (op === "select") view.select = args.ids as string[]
    if (op === "inspect") view.inspect = (args.id as string | undefined) ?? null
    if (op === "camera") view.camera = args.intent as CameraIntent
    if (op === "settings") spec.settings = deepMerge(spec.settings ?? {}, args)
    if (op === "command") (spec.do ??= []).push({ command: args.name as string, args: args.args as never })
  }
  return spec
}

/** Steer `canvas.playbook` to the position (G4). */
export function useCanvasPlayback(canvas: Canvas | null, id: string | undefined) {
  const received = usePlayable(id, "canvas")
  React.useEffect(() => {
    if (!canvas) return
    let stale = false
    const pb = canvas.playbook
    // The engine's list only grows (`addStep` appends; `load` would reset its position).
    for (const r of received) if (!pb.steps.some((s) => s.id === r.step)) pb.addStep(toStepSpec(r))
    const at = received.at(-1)?.step ?? null
    void (async () => {
      if (at !== null) return void (stale || (await pb.goTo(at)))
      while (!stale && pb.index >= 0) await pb.previous()
    })()
    return () => {
      stale = true // a newer position supersedes this one between moves
    }
  }, [canvas, received])
}
```

```json
{
  "id": "s5", "title": "Initech's investors", "actor": "assistant", "turn": "a5",
  "calls": [
    { "target": "graph", "op": "addData", "args": {
      "nodes": [ { "id": "inv:sequoia", "type": "investor", "label": "Sequoia" },
                 { "id": "inv:a16z", "type": "investor", "label": "a16z" } ],
      "edges": [ { "id": "e1", "source": "inv:sequoia", "target": "acc:initech", "type": "invested" },
                 { "id": "e2", "source": "inv:a16z", "target": "acc:initech", "type": "invested" } ] } },
    { "target": "graph", "op": "focus", "args": { "ids": ["inv:sequoia", "inv:a16z", "acc:initech"], "dim": true } },
    { "target": "graph", "op": "camera", "args": { "intent": "focus" } }
  ]
}
```

One step may call a table and a canvas together — `s2` and `s5` could be one step; each target receives only its own calls.

### 2.4 The host (the AppAgents story; Studio alike)

```tsx
const [playbook, setPlaybook] = React.useState<Playbook>({ version: 1, steps: [] })
const play = usePlaybook(playbook)
const panels = React.useMemo(() => panelsOf(FIXTURE.boards), []) // id → { page, kind }; duplicates reported (G6)

// A settled answer's steps, as the API would send them beside the turn.
const record = (step: Step) => {
  const result = appendStep(playbook, step, { kindOf: (id) => panels.get(id)?.kind, ops: { table: tableOps } })
  if ("problems" in result) reportToAgent(step, result.problems)
  else setPlaybook(result.playbook)
}

// Show the page that holds the current step's first target (G10).
const page = panels.get(play.targets[0] ?? "")?.page

<PlaybookProvider store={play.store}>
  <BoardPages spec={{ ...FIXTURE.boards, active: page ?? active, selectAction: "page" }} onAction={…} />
  <PlaybookBar {...play} />
</PlaybookProvider>
```

### 2.5 Risks, and how the design meets them

| Risk | Fix (built in) | Row |
|---|---|---|
| A live step grows without bound (D-6) | `upsertRows.keep` keeps the last N rows; a live step holds at most `maxCalls` (1,000) and then a new one opens (the bar clusters one source's live steps as one dot); sealing merges consecutive calls with the target's `merge` — exact: two `setCell`s on one cell are the last, two `upsertRows` are one | F9 |
| A bad step breaks the steps after it | Checked before it is recorded (G5); a call that still fails at play (a row removed meanwhile) is skipped alone and reported, the rest of the step applies | F1, F4 |
| Memory over a long session | A pure target caches one state per step it received — only its own steps, and structurally shared rows. Budget test: 500 steps over 30 tables. Checkpoints only if it fails | F1, V6 |
| Thirty tables re-render on every step | Per-target subscription (G9): only targets whose calls changed re-render. No board memoisation needed | F1, V3 |
| One id on two components | The provider rejects a second registration (G6); `panelsOf` reports duplicates in a board spec before anything mounts | F1, F7 |
| The change happens on a page nobody is looking at | The host shows the current step's page (G10) | F8 |
| A note popover at 280px | Radix `Popover` avoids collisions; width capped by a token; one note open at a time; checked at 280 and 720 | F3, V5 |
| Canvas moves race (a new position while one plays) | The engine already serialises moves; the effect's `stale` flag stops a superseded target between moves | F11 |
| A canvas remount replays every step | Pages stay mounted once shown; canvas keyframes (canvas F21) if replay is measured slow | deferred |
| The board stream's silent double patch (M5) | Out of the playbook's path now (calls go by registered id). Fixed on its own: `applyBoardPatch` throws when a panel id is found twice | F14 |

## 3. Prior art

| Doc | Relation | What survives |
|---|---|---|
| canvas RFC `feat-2026-09-28-an-analysis-cannot-be-recorded-or-replayed` | generalised | Its step vocabulary (`id`, `title`, `narration`, `actor`, `meta`), `next` / `previous` / `goTo`, follow-the-latest, a bad step writes nothing, the presenter bar. The canvas keeps its engine playbook and log; the kit's playbook steers it |
| Revision 1 of this RFC | superseded | Table marks (now a `DataTable` feature), the host owning the list (D-3), the live feed (D-6), the bar's place (D-7), the turn link (D-4) |
| `sym:BlockPatch` and the block stream | unchanged | Still how a conversation streams a block; the playbook does not use it |

## 4. The fix

| ID | Kind | Status | File / target | Change | Effect | Risk | Depends on |
|---|---|---|---|---|---|---|---|
| F1 | feature | proposed | `file:packages/ui/src/lib/playbook/` (new) | `Call`, `Step`, `Playbook`, `Received`, `OpSet`; `appendStep`, `feedStep`; `usePlaybook`, `PlaybookProvider`, `usePlayable` (registers the id, per-target subscription), `useReduced` | G2–G9 | Medium. The router's per-target cache is the one subtle part (V3) | — |
| F2 | feature | proposed | `file:packages/ui/src/components/ui-extended/playbook-bar.tsx` (new) | `PlaybookBar`: title, narration, actor, `n / N`, ◀ ▶, dots (played / current / pending / live, one cluster per live source), `Latest` when stepped back; ← / → while focused only; bar height `sm`; icons as props | G11 | Low | F1 |
| F3 | feature | proposed | `file:packages/tables/src/data-table.tsx`, `file:packages/tables/src/core/table-grid.tsx`, `file:packages/tables/src/marks.ts` (new) | `DataTable` gains `rowKey`, `marks`, `selectedKey`: row and cell marks by tone token (a cell's outranks its row's), a note as a `Popover` on the cell (one open) | M1 | Medium. Popover at 280px (V5) | — |
| F4 | feature | proposed | `file:packages/tables/src/playbook.ts` (new), `file:packages/tables/src/data-table.tsx` | `tableOps` (§2.2) and `DataTable id`: inside a provider the table folds its calls (`useReduced`); a failing call is skipped and reported (`onPlaybackError`) | G1, G4, M2 | Low. Pure, unit-tested | F1, F3 |
| F5 | defect | proposed | `file:packages/blocks/src/types.ts`, `file:packages/blocks/src/blocks/table.tsx` | The `table` block passes `id`, `rowKey`, `marks`, `selected` to `DataTable`; `highlight` retired for `marks` (D-1); the six fixtures that use it migrated | M1 | Medium. Breaking on 0.0.x | F3, F4 |
| F6 | showcase | proposed | `apps/storybook/stories/data-tables/…` (the DataTable story), `fixtures/data-tables/` | The DataTable story gains a playable variant: marks, notes, and a recorded script played by the bar; `play` checks setCell, mark, unmark, step back | V1, V5 | Low | F2–F4 |
| F7 | feature | proposed | `file:packages/boards/src/panels-of.ts` (new) | `panelsOf(spec)` → `Map<id, { page, kind }>` over pages, rows, tabs' rows and inspectors, with the duplicates it found | G6, G10; the host's `kindOf` | Low | — |
| F8 | showcase | proposed | `apps/storybook/stories/themes/app-agents/default.stories.tsx`, `fixtures/themes/app-agents.json` | The fixture's answers carry steps (`turn` linked) that call the Accounts tables by id; the story records them with `appendStep`, shows each step's page and draws `PlaybookBar` over the work's tabs (D-7). The boards stay as they are | The interaction end to end | Low | F1, F2, F5, F7 |
| F9 | feature | proposed | `file:packages/ui/src/lib/playbook/feed.ts` | `feedStep(playbook, source, calls, { maxCalls = 1000 })`, sealing with `merge` (§2.5); `useFeed(stream, source, setPlaybook)` batching ticks per animation frame | G8, D-6 | Medium | F1 |
| F10 | test | proposed | `packages/ui` (vitest added), `packages/tables` (`test` script added) | `appendStep` problems; router: a step re-notifies only its targets; `useReduced` ≡ folding from the base; `tableOps` per op; merge is exact (merged ≡ unmerged, property-tested); duplicate registration | V1–V4, V7 | Low | F1, F4, F9 |
| F11 | feature | proposed | ext: `packages/canvas-ui/src/playbook/` (new); `CanvasPanel`, `GraphCanvasAppRoot` gain `id` | `canvasOps`, `toStepSpec`, `useCanvasPlayback` (§2.3) | G1, G4, M3 | Medium. Engine moves while the reader drags follow the engine's own rules | F1 released |
| F12 | showcase | proposed | ext: canvas storybook `playbook/AgentWork.stories.tsx` | A board with a table and a canvas, played by one script (the kit's storybook cannot import the canvas) | V8 | Low | F11 |
| F13 | docs | proposed | `CLAUDE.md` (Terms), `docs/TODO.md`, Design Kit Spec (table page: marks and notes) | Terms gain **step**, **call**, **op set**, **target**, **playbook**, **mark** | One word per idea | Low | — |
| F14 | defect | proposed | `file:packages/boards/src/stream.ts` | `applyBoardPatch` throws when the panel it names is found twice, instead of patching both (M5) | A silent double write becomes an error | Low. No fixture has a duplicate (scan, 2026-10-05) | — |
| F15 | docs | proposed | the AppAgents and DataTable stories' Code tab | The step JSON and the host bridge (`API → host → ChatSession / appendStep`) | Studio copies one pattern | Low | F8 |
| F16 | feature | deferred | `@invana/boards` | **The board as a target**: `board` op set — `showPage`, `addPage`, `removePage`, `addPanel`, `removePanel` — so the agent can open a new table or canvas page | Unblocked by: the agent creating pages, not only changing them | Medium | F1 |
| F17 | feature | deferred | `@invana/charts`, `@invana/blocks` | Chart op sets (`timeseries`: `appendPoints { keep }`, `mark`; `bars`: `setValues`, `mark`) | Unblocked by: an agent turn that needs it | Low per chart | F1 |
| F18 | feature | deferred | `@invana/assistant` | An answer envelope field linking a turn to its steps (D-4) | Unblocked by: Studio needing the link in the turn | Medium | F8 |
| F19 | feature | deferred | ext: canvas | A note popover on a node — the canvas's `mark` | Unblocked by: canvas RFC | Medium | F11 |
| F20 | feature | deferred | ext: canvas | A live feed into a canvas (its `applyDelta({ coalesce })` from a live step's new calls) | Unblocked by: a canvas fed live while played | Medium | F9, F11 |
| F21 | perf | deferred | `useReduced` | Keep every 20th state plus the recent ones; refold the rest on demand | Unblocked by: V6 failing | Low | F1 |
| F22 | feature | deferred | `@invana/tables` | `rowsRef` resolved by the host, for tables too large to carry in steps | Unblocked by: a step over 1,000 rows | Medium | F4 |
| F23 | defect | deferred | `@invana/blocks`, `@invana/ui` | Two tone vocabularies in the kit — block `Tone` (`good` / `bad` / `warn` / `neutral`) and ui `MarkTone` — reconciled | Unblocked by: D-9 | Low | — |
| F24 | feature | deferred | host (D-5) | A reader's own changes recorded as `actor: "user"` steps, chosen per action | Unblocked by: a reader action worth recording (closing a page — F16) | Low | F1 |

## 5. Blast radius

| Thing | Change | Who notices |
|---|---|---|
| `@invana/ui` | New `lib/playbook`, `PlaybookBar`; no existing export changes | — |
| `DataTable` | New optional props (`id`, `rowKey`, `marks`, `selectedKey`, `onPlaybackError`); without `id` or a provider it behaves as today | — |
| `table` block | `highlight` removed for `marks` (D-1) | Six fixtures here; Studio if it sends `highlight` — scan before release |
| `applyBoardPatch` | Throws on a duplicated panel id (F14) | A spec with a repeated id on one board — none in the kit's fixtures |
| `@invana/canvas-ui` | Phase 2 only; phase 1 changes nothing it reads | — |
| `@invana/assistant` | Nothing | — |

## 6. Verification

| ID | Check | How |
|---|---|---|
| V1 | Moving to step *i* gives each table the state its calls up to *i* fold to from its base, whatever order the moves came in | `useReduced` + `tableOps` tests; the DataTable story's `play` |
| V2 | A step with a bad call is refused whole and nothing is recorded; a call failing at play is skipped alone | `appendStep` tests; story |
| V3 | A step re-renders only its targets | Router test (notification count per target); the AppAgents `play` with a render counter |
| V4 | Following: at the latest a new step plays; stepped back it waits | `renderHook` |
| V5 | Notes at 280px and 720px | DataTable story variants at both widths |
| V6 | Memory: 500 steps over 30 tables within budget | A vitest bench over a generated fixture |
| V7 | Sealing a live step changes no state (merged ≡ unmerged) | Property test over random `setCell` / `upsertRows` / `mark` runs |
| V8 | Phase 2: a canvas stepped back past its step returns to its baseline; forward replays; a remount reaches the same step | canvas storybook `play` |
| V9 | `pnpm check-types`, `pnpm lint`, the packages' `test` | locally |

## 7. Decisions

| ID | Question | Options | Recommendation | Status |
|---|---|---|---|---|
| D-1 | `table.highlight` (by index) once marks exist | retire / deprecate / keep | Retire | decided — retire |
| D-2 | When a step changes a reader-changeable field | step wins once / … | — | **superseded**: calls are events, so a new `mark` reopens its note by itself, and the host — not the board — shows the page (G10). Nothing to steer in phase 1 |
| D-3 | Who owns the step list | host / hook | Host passes it; the hook owns the position | decided — host |
| D-4 | How a turn links to its step | `step.turn` / envelope field | `step.turn` now | decided — `step.turn` (F18 deferred) |
| D-5 | A reader's own changes as steps | per action / never / always | Per action, chosen by the host | decided — per action (F24 deferred: no recordable reader action in scope yet) |
| D-6 | Live feed and playbook together | exclusive / merge into an open step | — | decided — merge (G8, F9) |
| D-7 | Where the bar sits in AppAgents | over the work's tabs / rail / story-only | Over the work's tabs | decided — over the tabs |
| D-8 | Where the playbook core lives | `@invana/blocks/stream` (revision 1's decision) / **`@invana/ui` `lib/playbook`** / a new `@invana/playbook` | **`@invana/ui`** — the table's op set lives in `@invana/tables`, which depends on `ui`, not on `blocks`; `ui` is the one package every component package (tables, blocks, charts, canvas-ui) already depends on. A new package would add an eleventh to every release for ~200 lines | **open — revised** (revision 1 decided `blocks/stream` before the table owned its ops) |
| D-9 | The tone of a table mark | ui `MarkTone` (`muted` / `info` / `success` / `warning` / `destructive`) / block `Tone` (`good` / `bad` / `warn` / `neutral`) | **`MarkTone`** — a mark is a table component's feature and `MarkChip` already defines the mark tone in ui; the block vocabulary stays for cells. Reconcile the two later (F23) | open |
| D-10 | What is playable: `DataTable` itself, or only the `table` block | `DataTable id` / block only | **`DataTable id`** — the capability belongs to the table component; Studio's own tables get it free; the block just passes `id` | open |

## 8. History

| Date | Event |
|---|---|
| 2026-10-05 | Revision 1: steps as patches to the board spec (`WorkPatch`), marks on the block, the core in `@invana/blocks/stream`. Decisions D-1 … D-8 settled with the maintainer |
| 2026-10-05 | **Revision 2**, from maintainer review: the component owns the capability, the playbook only calls it. Steps become calls by id (`{ target, op, args }`) against each component's declared op set; marks and notes move into `DataTable`; scope narrowed to table and canvas (board, charts deferred, F16–F17); risks fixed in the design (§2.5). D-2 superseded; D-8 reopened (`@invana/ui`); D-9, D-10 opened |
