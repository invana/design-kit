import type { ConversationEvent } from "../../protocol/events"
import { applyPatches, type ConversationPatch } from "../../protocol/reduce"
import { type PatchScript, type ScriptStep, textDeltas, thinkingDeltas } from "../../protocol/stream"
import type {
  AnswerTurn,
  AskTurn,
  BlockSpec,
  ComposerSpec,
  ConversationSpec,
  TraceIoRow,
  TraceStep,
} from "../../protocol/types"

/*
 * An analyst's session on an airports graph, with a local Qwen model — the
 * Session Task Trace walkthrough as data. Each scenario is a recorded run: a
 * script of patches with the time each lands, as the API would stream them.
 * `respond` is the API's side of the conversation: given what the analyst did,
 * the script that answers it.
 *
 * Every time in a script is a moment after `start`, the ms the play began, so
 * elapsed times read true against the session's clock.
 */

const CYPHER = `MATCH (a:Airline)-[:OPERATES]->(r:Route)-[:FROM]->(:Airport {iata: "FRA"})
MATCH (r)-[:TO]->(:Airport)-[:IN]->(c:Country)
WITH a, count(DISTINCT c) AS countries
WHERE countries > 20
RETURN a.name, countries ORDER BY countries DESC`

const PROMPT = "Which airlines connect Frankfurt to more than 20 countries?"

export const AIRPORTS_COMPOSER: ComposerSpec = {
  placeholder: "Ask anything about your graph…",
  controls: [
    {
      id: "mode",
      label: "Mode",
      options: [
        { value: "nl", label: "Natural Language" },
        { value: "ql", label: "Query Language", placeholder: "MATCH (n) WHERE … RETURN n", mono: true },
      ],
    },
    {
      id: "model",
      label: "Model",
      quiet: true,
      options: [
        { value: "qwen", label: "local · qwen3-27b" },
        { value: "gpt", label: "openai · gpt-4o-mini" },
        { value: "claude", label: "anthropic · claude-sonnet-5" },
      ],
    },
    {
      id: "timeout",
      label: "LLM + query timeout",
      align: "end",
      quiet: true,
      default: "120",
      // A stopwatch, as path data: the kit ships no icons.
      icon: "M8 14a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM8 5.5V8.5l1.8 1.2M6.5 1.5h3",
      options: [
        { value: "30", label: "30s" },
        { value: "60", label: "1m" },
        { value: "120", label: "2m" },
      ],
    },
  ],
  attach: true,
}

const iso = (ms: number) => new Date(ms).toISOString()

// ── the four steps behind every reply ───────────────────────────────────────

type StepId = "understand" | "validate" | "execute" | "project"
const STEPS: { id: StepId; key: string; label: string }[] = [
  { id: "understand", key: "translate_thought", label: "Understand" },
  { id: "validate", key: "validate_query", label: "Validate" },
  { id: "execute", key: "execute_graph_query", label: "Execute" },
  { id: "project", key: "shape_for_canvas", label: "Project" },
]
const queued = (): TraceStep[] => STEPS.map((s) => ({ ...s, attempts: 3, state: "pending" }))

const io = (input: TraceIoRow[], output: TraceIoRow[]) => ({ input, output })
const RECORD: Record<StepId, (prompt: string) => TraceStep["io"]> = {
  understand: (prompt) =>
    io(
      [
        { label: "prompt", value: prompt },
        { label: "schema", value: "model v7 · 5 node types · 6 relationship types" },
        { label: "context", value: "3 prior turns (2 queries, 1 clarification)" },
        { label: "model", value: "local · qwen3-27b · timeout 120s" },
      ],
      [
        { label: "query", value: CYPHER, code: true },
        { label: "tokens", value: "1,240 in · 96 out" },
      ],
    ),
  validate: () =>
    io(
      [{ label: "query", value: "sha256:9f2c…a71b" }],
      [
        { label: "verdict", value: "read-only · no CREATE / MERGE / DELETE / SET" },
        { label: "labels", value: "Airline, Route, Airport, Country — all in model v7" },
      ],
    ),
  execute: () =>
    io(
      [
        { label: "query", value: "sha256:9f2c…a71b" },
        { label: "connection", value: "neo4j · airports-prod · read replica" },
        { label: "limits", value: "timeout 30s · page 500" },
      ],
      [
        { label: "rows", value: "14 · 3 batches" },
        { label: "emitted", value: "graph.delta ×3" },
      ],
    ),
  project: () =>
    io(
      [{ label: "rows", value: "sha256:44e0…c210" }],
      [{ label: "canvas", value: "14 nodes · 212 relationships · layout: force" }],
    ),
}

/** The patches a script is built from, each at its moment. */
class Recorder {
  readonly steps: ScriptStep[] = []
  constructor(
    readonly turn: string,
    readonly start: number,
  ) {}
  at(ms: number, ...patch: ConversationPatch[]) {
    this.steps.push({ at: ms, patch })
    return this
  }
  run(ms: number, step: StepId, detail: string, fields: Partial<TraceStep> = {}) {
    return this.at(ms, {
      op: "update-trace-step",
      turn: this.turn,
      step,
      fields: { state: "running", detail, startedAt: iso(this.start + ms), ...fields },
    })
  }
  done(ms: number, step: StepId, detail: string, duration: number, prompt = PROMPT) {
    return this.at(ms, {
      op: "update-trace-step",
      turn: this.turn,
      step,
      fields: { state: "done", detail, duration, thinking: undefined, io: RECORD[step](prompt) },
    })
  }
  detail(ms: number, step: StepId, detail: string) {
    return this.at(ms, { op: "update-trace-step", turn: this.turn, step, fields: { detail } })
  }
  think(ms: number, step: StepId, text: string) {
    this.steps.push(...thinkingDeltas(this.turn, step, text, { from: ms, every: 38 }))
    return this
  }
  write(ms: number, text: string, every = 30) {
    this.at(ms, { op: "add-block", turn: this.turn, block: { preset: "narrative", text: "" } })
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
}

function openRun(id: string, prompt: string, start: number): Recorder {
  const r = new Recorder(`${id}-a`, start)
  const answer: AnswerTurn = {
    id: r.turn,
    role: "assistant",
    kind: "answer",
    state: "running",
    label: "records",
    startedAt: iso(start),
    trace: queued(),
    blocks: [],
  }
  return r.at(0, { op: "add-turn", turn: { id, role: "analyst", text: prompt, at: iso(start) } }, { op: "add-turn", turn: answer })
}

const AIRLINES: BlockSpec = {
  preset: "table",
  columns: [
    { key: "airline", label: "Airline" },
    { key: "countries", label: "Countries", align: "right" },
    { key: "routes", label: "Routes", align: "right" },
  ],
  rows: [
    { airline: "Lufthansa", countries: 74, routes: 212 },
    { airline: "Condor", countries: 41, routes: 88 },
    { airline: "Turkish Airlines", countries: 33, routes: 12 },
    { airline: "United", countries: 24, routes: 9 },
    { airline: "Emirates", countries: 22, routes: 4 },
  ],
  total: 14,
  noun: "airlines",
  sort: { key: "countries", dir: "desc" },
}

const followUps = (answerId: string): AskTurn => ({
  id: `${answerId}-next`,
  role: "assistant",
  kind: "ask",
  stage: "explain",
  state: "pending",
  ask: {
    preset: "suggestions",
    items: ["Which of these fly to Asia?", "Rank airports by betweenness", "How many routes leave Frankfurt?"],
  },
})

/** The rest of a run once Understand is done: validate, execute in batches, project, write. */
function finish(r: Recorder, from: number, prompt: string) {
  r.done(from, "understand", "proposed Cypher · 5 lines · confidence 0.86", from - 350, prompt)
    .run(from, "validate", "checking the query is read-only")
    .done(from + 50, "validate", "read-only ✓ · Airline, Route, Airport, Country", 12)
    .run(from + 50, "execute", "waiting for the first batch")
    .detail(from + 400, "execute", "5 rows so far · batch 1")
    .detail(from + 700, "execute", "10 rows so far · batch 2")
    .detail(from + 1050, "execute", "14 rows so far · batch 3")
    .done(from + 1450, "execute", "14 rows · 3 batches", 1400)
    .run(from + 1450, "project", "shaping 14 rows for the canvas")
    .done(from + 1530, "project", "14 nodes · 212 relationships → canvas", 48)
  const written = r.write(
    from + 1550,
    "Found **14 airlines**. Lufthansa alone reaches 74 countries from Frankfurt; the next, Condor, 41. Added 14 nodes and 212 relationships to the canvas.",
  )
  r.block(written + 60, AIRLINES)
  r.settle(written + 120, "complete", {
    meta: "local · qwen3-27b · 14 rows · LLM 0.9s · query 1.4s",
    envelope: { grounding: { records: 212, noun: "routes" }, method: CYPHER },
    outcome: {
      text: "14 nodes · 212 relationships",
      actions: [{ id: "load-canvas", label: "Load to canvas", variant: "secondary" }],
    },
  })
  r.at(written + 160, { op: "add-turn", turn: followUps(r.turn) })
  return r.steps
}

// ── scenarios ───────────────────────────────────────────────────────────────

const UNDERSTAND_THOUGHT =
  "Airlines operate routes; a route runs FROM one airport TO another; countries hang off airports — so count distinct destination countries per airline."

/** Send → Understand → Validate → Execute → Project, then the answer streams in. */
export function askScenario(id: string, start: number, prompt = PROMPT): PatchScript {
  const r = openRun(id, prompt, start)
    .run(350, "understand", "local · qwen3-27b · reading 3 prior turns")
    .think(420, "understand", UNDERSTAND_THOUGHT)
  return finish(r, 1250, prompt)
}

/** Understand asks back: which Frankfurt? The run waits on the analyst's reply. */
export function clarifyScenario(id: string, start: number): PatchScript {
  const prompt = "How many routes leave Frankfurt?"
  const r = openRun(id, prompt, start)
    .run(350, "understand", "local · qwen3-27b · reading 3 prior turns")
    .think(
      420,
      "understand",
      '"Frankfurt" matches two Airport nodes — FRA and HHN. The question needs one of them before a query makes sense.',
    )
    .at(
      1500,
      {
        op: "update-trace-step",
        turn: `${id}-a`,
        step: "understand",
        fields: { state: "waiting", detail: 'which "Frankfurt"?', thinking: undefined },
      },
      {
        op: "add-turn",
        turn: {
          id: `${id}-q`,
          role: "assistant",
          kind: "ask",
          stage: "frame",
          state: "pending",
          ask: {
            preset: "single",
            question: "Frankfurt matches two airports here. **Which one do you mean?**",
            options: [
              { value: "FRA", label: "Frankfurt am Main", detail: "FRA", description: "Hub · 3,504 routes" },
              { value: "HHN", label: "Frankfurt-Hahn", detail: "HHN", description: "Regional · 212 routes" },
            ],
            other: true,
            label: "Airport",
          },
        },
      },
    )
  return r.steps
}

/** Execute times out, retries, and fails; the reply says why and what to do next. */
export function failScenario(id: string, start: number): PatchScript {
  const prompt = "List every route between two European hubs with a layover"
  const r = openRun(id, prompt, start)
    .run(350, "understand", "local · qwen3-27b · reading 3 prior turns")
    .done(1250, "understand", "proposed Cypher · 9 lines · confidence 0.71", 900, prompt)
    .run(1250, "validate", "checking the query is read-only")
    .done(1300, "validate", "read-only ✓ · Route, Airport", 12)
    .run(1300, "execute", "waiting for the first batch")
    .run(2700, "execute", "timeout after 30s", { state: "retrying", attempt: 2 })
    .at(4200, {
      op: "update-trace-step",
      turn: `${id}-a`,
      step: "execute",
      fields: {
        state: "failed",
        detail: "failed · timeout after 30s · 2 attempts",
        error: "transient · the graph did not respond within the timeout",
        duration: 61000,
        io: io(
          [
            { label: "query", value: "sha256:9f2c…a71b" },
            { label: "limits", value: "timeout 30s · page 500" },
          ],
          [
            { label: "attempt 1", value: "timeout · 30.0s" },
            { label: "attempt 2", value: "timeout · 30.0s" },
          ],
        ),
      },
    })
  const written = r.write(
    4250,
    "The graph did not answer within 30s, twice. The query joins four labels without an index on Airport.iata.",
  )
  r.settle(written + 60, "error", {
    meta: "local · qwen3-27b · LLM 0.9s · query timed out ×2",
    outcome: {
      actions: [
        { id: "retry", label: "Try again", variant: "secondary" },
        { id: "add-index", label: "Add an index in Modeller", variant: "secondary" },
        { id: "narrow", label: "Narrow to one airline", variant: "secondary" },
      ],
    },
  })
  return r.steps
}

/** A long run, for stopping: Execute counts batches until you press esc or stop. */
export function longScenario(id: string, start: number): PatchScript {
  const prompt = "Rank airports by betweenness across the whole graph"
  const r = openRun(id, prompt, start)
    .run(350, "understand", "local · qwen3-27b · reading 3 prior turns")
    .done(1100, "understand", "proposed Cypher · betweenness · confidence 0.9", 750, prompt)
    .run(1100, "validate", "checking the query is read-only")
    .done(1150, "validate", "read-only ✓ · Airport, Route", 10)
    .run(1150, "execute", "3,504 airports · 0% scored")
  for (let i = 1; i <= 40; i++) r.detail(1150 + i * 500, "execute", `3,504 airports · ${i * 2}% scored`)
  return r.steps
}

/** A costly question: the assistant states the cost and asks before it runs. */
export function confirmScenario(id: string, start: number): PatchScript {
  const prompt = "Which airports would strand the most passengers if they closed?"
  const r = openRun(id, prompt, start)
    .run(350, "understand", "local · qwen3-27b · reading 3 prior turns")
    .think(420, "understand", "This is betweenness over the whole route network, weighted by seats — a full scan.")
    .at(
      1400,
      {
        op: "update-trace-step",
        turn: `${id}-a`,
        step: "understand",
        fields: { state: "waiting", detail: "this reads the whole graph", thinking: undefined },
      },
      {
        op: "add-turn",
        turn: {
          id: `${id}-q`,
          role: "assistant",
          kind: "ask",
          stage: "check",
          state: "pending",
          ask: {
            preset: "confirm",
            question: "This scores **every airport** against every route. Run it?",
            cost: [
              { label: "rows scanned", value: "2.3M" },
              { label: "about", value: "40 s" },
              { label: "writes", value: "nothing" },
            ],
            costAs: "strip",
            yes: "Run it",
            no: "Just the top hubs",
            default: true,
          },
        },
      },
    )
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
 * a run; a reply to an ask resumes the run that asked; `retry` runs the prompt
 * again; a follow-up is a prompt of its own.
 */
export function respond(event: ConversationEvent, spec: ConversationSpec, start: number): PatchScript | undefined {
  switch (event.type) {
    case "prompt":
      return event.text ? askScenario(nextId(), start, event.text) : undefined
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
      if (ask.ask.preset === "suggestions") return [answered, ...askScenario(nextId(), start + 50, String(event.value))]
      const answer = answerOf(ask.id)
      const prompt = promptOf(spec, answer)
      const r = new Recorder(answer, start)
      r.steps.push(answered)
      if (ask.ask.preset === "confirm" && event.value === false) {
        r.done(200, "understand", "narrowed to the 20 busiest hubs", 900)
        const written = r.write(250, "Scoring only the 20 busiest hubs instead: this reads 4% of the graph.")
        r.block(written + 40, {
          preset: "ranked",
          items: [
            { label: "FRA · Frankfurt", value: 0.31, display: "0.31" },
            { label: "IST · Istanbul", value: 0.27, display: "0.27" },
            { label: "DXB · Dubai", value: 0.24, display: "0.24" },
            { label: "17 others", value: 0.09, display: "≤ 0.09", muted: true },
          ],
        })
        r.settle(written + 80, "partial", { meta: "local · qwen3-27b · 20 hubs · query 3.1s" })
        return r.steps
      }
      r.run(0, "understand", `resumed with "${String(event.value)}"`)
      return finish(r, 900, prompt?.role === "analyst" ? prompt.text : PROMPT)
    }
    case "retry":
    case "action": {
      if (event.type === "action" && event.action !== "retry") return undefined
      const prompt = promptOf(spec, event.turn)
      return prompt?.role === "analyst" ? askScenario(nextId(), start, prompt.text) : undefined
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

/** The session as it opens, mid-conversation: one question already answered, eight minutes ago. */
export function airportsSpec(now: number): ConversationSpec {
  return settle(
    { id: "airports", title: "Airlines out of Frankfurt", assistant: "Analyst", composer: AIRPORTS_COMPOSER, turns: [] },
    askScenario("t0", now - 8 * 60_000),
  )
}
