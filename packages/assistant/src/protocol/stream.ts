import type { ConversationPatch } from "./reduce"
import type { AnswerTurn, ConversationSpec } from "./types"

/**
 * A conversation arrives as a spec, then as patches. These are the ways the
 * patches can arrive — one at a time or in batches, from a fetch body, an
 * EventSource, a generator, or a recorded script — all read the same way by
 * `<ChatSession stream>` and `useChatSession().stream()`.
 */
export type PatchChunk = ConversationPatch | ConversationPatch[]
export type PatchSource = AsyncIterable<PatchChunk> | Iterable<PatchChunk>

const toArray = (chunk: PatchChunk) => (Array.isArray(chunk) ? chunk : [chunk])

/** Every patch of a source, flattened, in order. */
export async function* patchesOf(source: PatchSource): AsyncGenerator<ConversationPatch[]> {
  for await (const chunk of source as AsyncIterable<PatchChunk>) yield toArray(chunk)
}

// ── wire adapters ───────────────────────────────────────────────────────────

/**
 * Patches from a newline-delimited JSON body: one patch, or an array of them,
 * per line. Pass the `Response` of a streaming `fetch`, or its body.
 */
export async function* fromNdjson(
  input: Response | ReadableStream<Uint8Array>,
): AsyncGenerator<PatchChunk> {
  const body = input instanceof Response ? input.body : input
  if (!body) return
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffered = ""
  try {
    for (;;) {
      const { value, done } = await reader.read()
      buffered += decoder.decode(value, { stream: !done })
      let newline = buffered.indexOf("\n")
      while (newline >= 0) {
        const line = buffered.slice(0, newline).trim()
        buffered = buffered.slice(newline + 1)
        if (line) yield JSON.parse(line) as PatchChunk
        newline = buffered.indexOf("\n")
      }
      if (done) break
    }
    const rest = buffered.trim()
    if (rest) yield JSON.parse(rest) as PatchChunk
  } finally {
    reader.releaseLock()
  }
}

export interface EventSourceOptions {
  /** The event whose data is a patch. @default "message" */
  event?: string
  /** The event that ends the stream. @default "done" */
  done?: string
  /** Close the EventSource when the stream ends. @default true */
  close?: boolean
}

/** Patches from Server-Sent Events: each event's `data` is a patch, or an array of them. */
export async function* fromEventSource(
  source: EventSource,
  { event = "message", done = "done", close = true }: EventSourceOptions = {},
): AsyncGenerator<PatchChunk> {
  const queue: PatchChunk[] = []
  let finished = false
  let failure: unknown
  let wake: (() => void) | undefined
  const notify = () => {
    wake?.()
    wake = undefined
  }
  const onData = (e: MessageEvent) => {
    try {
      queue.push(JSON.parse(e.data as string) as PatchChunk)
    } catch (error) {
      failure = error
    }
    notify()
  }
  const onDone = () => {
    finished = true
    notify()
  }
  const onError = () => {
    // EventSource reconnects on its own while CONNECTING; CLOSED is the end.
    if (source.readyState === EventSource.CLOSED) onDone()
  }
  source.addEventListener(event, onData as EventListener)
  source.addEventListener(done, onDone)
  source.addEventListener("error", onError)
  try {
    for (;;) {
      if (failure) throw failure
      const next = queue.shift()
      if (next) {
        yield next
        continue
      }
      if (finished) return
      await new Promise<void>((resolve) => (wake = resolve))
    }
  } finally {
    source.removeEventListener(event, onData as EventListener)
    source.removeEventListener(done, onDone)
    source.removeEventListener("error", onError)
    if (close) source.close()
  }
}

// ── recorded scripts ────────────────────────────────────────────────────────

/** A patch and when it lands, in ms from the start of the script. */
export interface ScriptStep {
  at: number
  patch: PatchChunk
}

/** A recorded run: plain JSON, replayed by {@link playScript}. */
export type PatchScript = ScriptStep[]

export interface PlayOptions {
  /** 2 plays twice as fast. @default 1 */
  speed?: number
  signal?: AbortSignal
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted || ms <= 0) return resolve()
    const timer = setTimeout(done, ms)
    function done() {
      clearTimeout(timer)
      signal?.removeEventListener("abort", done)
      resolve()
    }
    signal?.addEventListener("abort", done, { once: true })
  })
}

/**
 * A script as a stream: each step is yielded when it is due. Steps due at the
 * same moment are yielded together; aborting ends the stream where it stands.
 */
export async function* playScript(
  script: PatchScript,
  { speed = 1, signal }: PlayOptions = {},
): AsyncGenerator<ConversationPatch[]> {
  const steps = [...script].sort((a, b) => a.at - b.at)
  let clock = 0
  let i = 0
  while (i < steps.length) {
    if (signal?.aborted) return
    const at = steps[i].at
    await sleep((at - clock) / speed, signal)
    if (signal?.aborted) return
    clock = at
    const batch: ConversationPatch[] = []
    while (i < steps.length && steps[i].at === at) batch.push(...toArray(steps[i++].patch))
    yield batch
  }
}

/** Shift every step of a script by `ms` — to chain scripts one after another. */
export const offsetScript = (script: PatchScript, ms: number): PatchScript =>
  script.map((s) => ({ ...s, at: s.at + ms }))

/** When a script's last step lands. */
export const scriptLength = (script: PatchScript) => script.reduce((m, s) => Math.max(m, s.at), 0)

export interface DeltaOptions {
  /** When the first delta lands, in ms. @default 0 */
  from?: number
  /** The gap between deltas, in ms. @default 40 */
  every?: number
  /** Stream word by word, or a few characters at a time. @default "word" */
  by?: "word" | "char"
}

function deltas(text: string, by: "word" | "char"): string[] {
  if (by === "char") return text.match(/[\s\S]{1,3}/g) ?? []
  // Keep each word's trailing space with it, so the deltas join back exactly.
  return text.match(/\S+\s*|\s+/g) ?? []
}

/**
 * A block's words, streamed: `append-text` steps, one per word, into `field`
 * (default `text`) of block `block` (default the last).
 */
export function textDeltas(
  turn: string,
  text: string,
  { from = 0, every = 40, by = "word", block, field }: DeltaOptions & { block?: number; field?: string } = {},
): PatchScript {
  return deltas(text, by).map((piece, i) => ({
    at: from + i * every,
    patch: {
      op: "append-text",
      turn,
      text: piece,
      ...(block === undefined ? {} : { block }),
      ...(field === undefined ? {} : { field }),
    },
  }))
}

/** A step's reasoning, streamed: `append-thinking` steps, one per word. */
export function thinkingDeltas(
  turn: string,
  step: string,
  text: string,
  { from = 0, every = 40, by = "word" }: DeltaOptions = {},
): PatchScript {
  return deltas(text, by).map((piece, i) => ({
    at: from + i * every,
    patch: { op: "append-thinking", turn, step, text: piece },
  }))
}

// ── state helpers ───────────────────────────────────────────────────────────

const LIVE_STEP = new Set(["running", "retrying"])

/**
 * Whether an answer is still being produced. `partial` is not: it is an
 * answer given in part — the rest in the background, or not to be had.
 */
export const isLive = (turn: AnswerTurn) => turn.state === "running"

/** Whether anything in the conversation is still running. */
export function isRunning(spec: ConversationSpec): boolean {
  return spec.turns.some((t) => t.role === "assistant" && t.kind === "answer" && isLive(t))
}

/**
 * What stopping does, as patches: each running answer is marked `stopped`,
 * its running step `stopped` with the time it had run, the steps after it left
 * as they were — so the record shows how far it got. `now` is in ms.
 */
export function stopPatches(spec: ConversationSpec, now: number = Date.now()): ConversationPatch[] {
  const patches: ConversationPatch[] = []
  for (const turn of spec.turns) {
    if (turn.role !== "assistant" || turn.kind !== "answer" || !isLive(turn)) continue
    for (const step of turn.trace ?? []) {
      if (!step.id || !LIVE_STEP.has(step.state)) continue
      const started = step.startedAt ? Date.parse(step.startedAt) : NaN
      patches.push({
        op: "update-trace-step",
        turn: turn.id,
        step: step.id,
        fields: {
          state: "stopped",
          thinking: undefined,
          ...(Number.isNaN(started) ? {} : { duration: now - started }),
        },
      })
    }
    const started = turn.startedAt ? Date.parse(turn.startedAt) : NaN
    patches.push({
      op: "update-turn",
      turn: turn.id,
      fields: {
        at: new Date(now).toISOString(),
        ...(Number.isNaN(started) ? {} : { duration: now - started }),
      },
    })
    patches.push({ op: "set-state", turn: turn.id, state: "stopped" })
  }
  return patches
}
