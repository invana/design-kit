import type { ConversationEvent } from "../../protocol/events"
import { applyPatches, type ConversationPatch } from "../../protocol/reduce"
import { type PatchScript, type ScriptStep, textDeltas, thinkingDeltas } from "../../protocol/stream"
import type {
  ActionOption,
  AnswerTurn,
  AskSpec,
  AskTurn,
  BlockSpec,
  ConversationSpec,
  Envelope,
  Outcome,
  SuggestionsOptions,
  TraceIoRow,
  TraceStep,
} from "../../protocol/types"
import type { FlowId, PatternId, StageId } from "../../grammar"

/*
 * A user's conversation as data: the thread they open on, and the runs the
 * API records for them — a prompt answered, a question asked back, a costly
 * run confirmed, a failure, a run long enough to stop. Each run is JSON in
 * `data/conversations/<user>.json`; this file turns it into a script of
 * patches with the time each lands, as the API would stream them.
 * `respond` is the API's side: given what the analyst did, the script that
 * answers it.
 *
 * Every time in a script is a moment after `start`, the ms the play began, so
 * elapsed times read true against the session's clock.
 */

// ── the data ────────────────────────────────────────────────────────────────

/** The four steps behind every reply. */
export type StepId = "understand" | "validate" | "execute" | "project"
const STEP_IDS: StepId[] = ["understand", "validate", "execute", "project"]

/** What an answer settles to: its prose, its blocks, and the envelope around them. */
export interface AnswerData {
  /** Streamed in word by word, as the answer's first block. */
  text: string
  blocks: BlockSpec[]
  label?: string
  title?: string
  flow?: FlowId
  pattern?: PatternId
  envelope?: Envelope
  outcome?: Outcome
  /** The run's facts in one line — `local · qwen3-27b · 14 rows · query 1.4 s`. */
  meta: string
  /** Follow-ups offered under the answer, as a `suggestions` ask. */
  followUps?: SuggestionsOptions
  /** @default "complete" */
  state?: "complete" | "partial" | "cannot"
}

/** What each step says as it runs and when it is done. */
export interface Progress {
  understood: string
  validating: string
  validated: string
  /** What execute says as each batch lands; the last one is its settled line. */
  batches: string[]
  projecting: string
  projected: string
}

export interface SendRun {
  prompt: string
  /** Understand's reasoning, streamed under it. */
  thinking: string
  progress: Progress
  answer: AnswerData
}

/** Understand asks back before it queries; the reply resumes the same run. */
export interface ClarifyRun {
  prompt: string
  thinking: string
  /** Understand's line while it waits — `which "Frankfurt"?`. */
  waiting: string
  stage?: StageId
  ask: AskSpec
  progress: Progress
  answer: AnswerData
}

/** A costly run: the assistant states what yes costs and asks. */
export interface ConfirmRun {
  prompt: string
  thinking: string
  waiting: string
  ask: AskSpec & { kind: "confirm" }
  /** Yes: the full run. */
  progress: Progress
  answer: AnswerData
  /** No: the narrower run, said as such. */
  narrowed: { understood: string; answer: AnswerData }
}

/** Execute times out, retries, and fails; the reply says why and what to do next. */
export interface FailRun {
  prompt: string
  understood: string
  validated: string
  retrying: string
  failed: string
  error: string
  text: string
  meta: string
  actions: ActionOption[]
}

/** A run long enough to stop: execute counts up until the analyst stops it. */
export interface LongRun {
  prompt: string
  understood: string
  validated: string
  /** Execute's line, `{n}` standing for the percentage done. */
  progress: string
}

export interface UserData {
  id: string
  /** Who they are — `Equity Trader`. */
  name: string
  /** What they do, in a line. */
  role: string
  /** The model named on every step. */
  model: string
  /** Each step's machine name and label, when not the defaults. */
  steps?: Partial<Record<StepId, { key?: string; label?: string }>>
  /** What each step read and wrote, for the step's record. The prompt is added to understand's input. */
  record: Record<StepId, { input: TraceIoRow[]; output: TraceIoRow[] }>
  /**
   * The thread they open on. With no turns, it opens on the send run, played
   * eight minutes before.
   */
  session: ConversationSpec
  runs: {
    send: SendRun
    clarify: ClarifyRun
    confirm: ConfirmRun
    fail: FailRun
    long: LongRun
  }
}

// ── recording ───────────────────────────────────────────────────────────────

const iso = (ms: number) => new Date(ms).toISOString()

/** Only the fields that are set, so an update never clears one the turn already has. */
const defined = <T extends object>(fields: T) =>
  Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)) as Partial<T>

const DEFAULT_STEPS: Record<StepId, { key: string; label: string }> = {
  understand: { key: "translate_thought", label: "Understand" },
  validate: { key: "validate_query", label: "Validate" },
  execute: { key: "execute_query", label: "Execute" },
  project: { key: "shape_result", label: "Project" },
}

const queued = (user: UserData): TraceStep[] =>
  STEP_IDS.map((id) => ({ id, ...DEFAULT_STEPS[id], ...user.steps?.[id], attempts: 3, state: "pending" }))

function record(user: UserData, step: StepId, prompt: string): TraceStep["io"] {
  const { input, output } = user.record[step]
  return step === "understand" ? { input: [{ label: "prompt", value: prompt }, ...input], output } : { input, output }
}

/** The patches a script is built from, each at its moment. */
class Recorder {
  readonly steps: ScriptStep[] = []
  constructor(
    readonly user: UserData,
    readonly turn: string,
    readonly start: number,
    readonly prompt: string,
  ) {}
  at(ms: number, ...patch: ConversationPatch[]) {
    this.steps.push({ at: ms, patch })
    return this
  }
  step(ms: number, step: StepId, fields: Partial<TraceStep>) {
    return this.at(ms, { op: "update-trace-step", turn: this.turn, step, fields })
  }
  run(ms: number, step: StepId, detail: string, fields: Partial<TraceStep> = {}) {
    return this.step(ms, step, { state: "running", detail, startedAt: iso(this.start + ms), ...fields })
  }
  done(ms: number, step: StepId, detail: string, duration: number) {
    return this.step(ms, step, {
      state: "done",
      detail,
      duration,
      thinking: undefined,
      io: record(this.user, step, this.prompt),
    })
  }
  detail(ms: number, step: StepId, detail: string) {
    return this.step(ms, step, { detail })
  }
  think(ms: number, step: StepId, text: string) {
    this.steps.push(...thinkingDeltas(this.turn, step, text, { from: ms, every: 38 }))
    return this
  }
  write(ms: number, text: string, every = 30) {
    this.at(ms, { op: "add-block", turn: this.turn, block: { kind: "narrative", text: "" } })
    this.steps.push(...textDeltas(this.turn, text, { from: ms + 1, every }))
    return ms + 1 + text.split(/\s+/).length * every
  }
  block(ms: number, block: BlockSpec) {
    return this.at(ms, { op: "add-block", turn: this.turn, block })
  }
  settle(ms: number, state: AnswerTurn["state"], fields: Partial<AnswerTurn> = {}) {
    return this.at(
      ms,
      { op: "update-turn", turn: this.turn, fields: { at: iso(this.start + ms), duration: ms, ...fields } },
      { op: "set-state", turn: this.turn, state },
    )
  }
  /** Understand waits on the analyst: the step turns amber and the ask appears. */
  ask(ms: number, id: string, waiting: string, stage: StageId, ask: AskSpec) {
    const turn: AskTurn = { id, role: "assistant", kind: "ask", stage, state: "pending", ask }
    return this.at(
      ms,
      { op: "update-trace-step", turn: this.turn, step: "understand", fields: { state: "waiting", detail: waiting, thinking: undefined } },
      { op: "add-turn", turn },
    )
  }
}

function openRun(user: UserData, id: string, prompt: string, start: number): Recorder {
  const r = new Recorder(user, `${id}-a`, start, prompt)
  const answer: AnswerTurn = {
    id: r.turn,
    role: "assistant",
    kind: "answer",
    state: "running",
    label: "records",
    startedAt: iso(start),
    trace: queued(user),
    blocks: [],
  }
  return r
    .at(0, { op: "add-turn", turn: { id, role: "analyst", text: prompt, at: iso(start) } }, { op: "add-turn", turn: answer })
    .run(350, "understand", `${user.model} · reading the thread`)
}

/** Validate, execute in batches, project, then write the answer, its blocks and its follow-ups. */
function finish(r: Recorder, from: number, progress: Progress, answer: AnswerData) {
  r.done(from, "understand", progress.understood, from - 350)
    .run(from, "validate", progress.validating)
    .done(from + 50, "validate", progress.validated, 12)
    .run(from + 50, "execute", "waiting for the first batch")
  const every = Math.round(1400 / Math.max(progress.batches.length, 1))
  progress.batches.slice(0, -1).forEach((line, i) => r.detail(from + 50 + every * (i + 1), "execute", line))
  r.done(from + 1450, "execute", progress.batches.at(-1) ?? "done", 1400)
    .run(from + 1450, "project", progress.projecting)
    .done(from + 1530, "project", progress.projected, 48)
  write(r, from + 1550, answer)
  return r.steps
}

/** The answer itself: prose streamed in, then each block, then the settle and follow-ups. */
function write(r: Recorder, from: number, answer: AnswerData) {
  const { label, title, flow, pattern } = answer
  r.at(from, { op: "update-turn", turn: r.turn, fields: defined({ label, title, flow, pattern }) })
  let ms = r.write(from, answer.text)
  for (const block of answer.blocks) r.block((ms += 60), block)
  const { meta, envelope, outcome } = answer
  r.settle((ms += 60), answer.state ?? "complete", defined({ meta, envelope, outcome }))
  if (answer.followUps) {
    const next: AskTurn = {
      id: `${r.turn}-next`,
      role: "assistant",
      kind: "ask",
      stage: "explain",
      state: "pending",
      ask: { kind: "suggestions", ...answer.followUps },
    }
    r.at(ms + 40, { op: "add-turn", turn: next })
  }
}

// ── the runs ────────────────────────────────────────────────────────────────

/** Send → Understand → Validate → Execute → Project, then the answer streams in. */
export function sendRun(user: UserData, id: string, start: number, prompt = user.runs.send.prompt): PatchScript {
  const { thinking, progress, answer } = user.runs.send
  return finish(openRun(user, id, prompt, start).think(420, "understand", thinking), 1250, progress, answer)
}

/** Understand asks back. The run waits on the analyst's reply. */
export function clarifyRun(user: UserData, id: string, start: number): PatchScript {
  const run = user.runs.clarify
  return openRun(user, id, run.prompt, start)
    .think(420, "understand", run.thinking)
    .ask(1500, `${id}-q`, run.waiting, run.stage ?? "frame", run.ask).steps
}

/** Before a costly run, the assistant states the cost and asks. */
export function confirmRun(user: UserData, id: string, start: number): PatchScript {
  const run = user.runs.confirm
  return openRun(user, id, run.prompt, start)
    .think(420, "understand", run.thinking)
    .ask(1400, `${id}-q`, run.waiting, "check", run.ask).steps
}

/** Execute times out, retries, and fails; the reply says why and what to do next. */
export function failRun(user: UserData, id: string, start: number): PatchScript {
  const run = user.runs.fail
  const r = openRun(user, id, run.prompt, start)
    .done(1250, "understand", run.understood, 900)
    .run(1250, "validate", "checking the query is read-only")
    .done(1300, "validate", run.validated, 12)
    .run(1300, "execute", "waiting for the first batch")
    .run(2700, "execute", run.retrying, { state: "retrying", attempt: 2 })
    .step(4200, "execute", {
      state: "failed",
      detail: run.failed,
      error: run.error,
      duration: 61000,
      io: record(user, "execute", run.prompt),
    })
  const written = r.write(4250, run.text)
  r.settle(written + 60, "error", { meta: run.meta, outcome: { actions: run.actions } })
  return r.steps
}

/** A long run, for stopping: execute counts up until the analyst stops it. */
export function longRun(user: UserData, id: string, start: number): PatchScript {
  const run = user.runs.long
  const r = openRun(user, id, run.prompt, start)
    .done(1100, "understand", run.understood, 750)
    .run(1100, "validate", "checking the query is read-only")
    .done(1150, "validate", run.validated, 10)
    .run(1150, "execute", run.progress.replace("{n}", "0"))
  for (let i = 1; i <= 40; i++) r.detail(1150 + i * 500, "execute", run.progress.replace("{n}", String(i * 2)))
  return r.steps
}

// ── the API's side ──────────────────────────────────────────────────────────

let serial = 0
const nextId = () => `t${Date.now().toString(36)}${(serial++).toString(36)}`

const answerOf = (askId: string) => askId.replace(/-q$/, "-a")
const promptOf = (spec: ConversationSpec, answerId: string) =>
  spec.turns.find((t) => t.id === answerId.replace(/-a$/, ""))

/**
 * What the API streams back when the analyst acts, or nothing. A prompt starts
 * a run; a reply to a run's ask resumes the run that asked; `retry` runs the
 * prompt again; a follow-up is a prompt of its own. A reply to an ask in the
 * opening thread is only recorded: that thread is already settled.
 */
export function respond(
  user: UserData,
  event: ConversationEvent,
  spec: ConversationSpec,
  start: number,
): PatchScript | undefined {
  switch (event.type) {
    case "prompt":
      return event.text ? sendRun(user, nextId(), start, event.text) : undefined
    case "reply": {
      const ask = spec.turns.find((t) => t.id === event.turn)
      if (!ask || ask.role !== "assistant" || ask.kind !== "ask") return undefined
      const answered: ScriptStep = {
        at: 0,
        patch: [
          { op: "set-state", turn: ask.id, state: "answered", value: event.value },
          { op: "update-turn", turn: ask.id, fields: { answeredAt: iso(start) } },
        ],
      }
      if (ask.ask.kind === "suggestions") return [answered, ...sendRun(user, nextId(), start + 50, String(event.value))]
      const answer = answerOf(ask.id)
      const run = spec.turns.find((t) => t.id === answer)
      if (answer === ask.id || !run) return [answered]
      const prompt = promptOf(spec, answer)
      const r = new Recorder(user, answer, start, prompt?.role === "analyst" ? prompt.text : "")
      r.steps.push(answered)
      if (ask.ask.kind === "confirm") {
        const { confirm } = user.runs
        if (event.value === false) {
          r.done(200, "understand", confirm.narrowed.understood, 900)
          write(r, 250, { state: "partial", ...confirm.narrowed.answer })
          return r.steps
        }
        r.run(0, "understand", "confirmed")
        return finish(r, 900, confirm.progress, confirm.answer)
      }
      const { clarify } = user.runs
      r.run(0, "understand", `resumed with ${JSON.stringify(event.value)}`)
      return finish(r, 900, clarify.progress, clarify.answer)
    }
    case "retry":
    case "action": {
      if (event.type === "action" && event.action !== "retry") return undefined
      const prompt = promptOf(spec, event.turn)
      return prompt?.role === "analyst" ? sendRun(user, nextId(), start, prompt.text) : undefined
    }
    default:
      return undefined
  }
}

/** A script played to its end, at once — a run already settled. */
export function settle(spec: ConversationSpec, script: PatchScript): ConversationSpec {
  const ordered = [...script].sort((a, b) => a.at - b.at)
  return applyPatches(spec, ordered.flatMap((s) => (Array.isArray(s.patch) ? s.patch : [s.patch])))
}

/** The thread a user opens on. An empty one opens on their send run, eight minutes ago. */
export function openingSpec(user: UserData, now: number): ConversationSpec {
  return user.session.turns.length ? user.session : settle(user.session, sendRun(user, "t0", now - 8 * 60_000))
}
