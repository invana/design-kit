import {
  type EventSourceOptions,
  fromEventSource as fromEventSourceOf,
  fromNdjson as fromNdjsonOf,
  offsetScript as offsetScriptOf,
  type PatchChunk as PatchChunkOf,
  type PatchScript as PatchScriptOf,
  patchesOf as patchesOfAny,
  type PatchSource as PatchSourceOf,
  playScript as playScriptOf,
  type PlayOptions,
  type ScriptStep as ScriptStepOf,
  scriptLength,
} from "@invana/blocks"

import type { ConversationPatch } from "./reduce"
import type { AnswerTurn, ConversationSpec } from "./types"

/**
 * A conversation arrives as a spec, then as patches — by the same transport
 * every block streams by (`@invana/blocks`), carrying {@link ConversationPatch}.
 * These are the ways the patches can arrive — one at a time or in batches,
 * from a fetch body, an EventSource, a generator, or a recorded script — all
 * read the same way by `<ChatSession stream>` and `useChatSession().stream()`.
 */
export type PatchChunk = PatchChunkOf<ConversationPatch>
export type PatchSource = PatchSourceOf<ConversationPatch>
/** A patch and when it lands, in ms from the start of the script. */
export type ScriptStep = ScriptStepOf<ConversationPatch>
/** A recorded run: plain JSON, replayed by {@link playScript}. */
export type PatchScript = PatchScriptOf<ConversationPatch>
export type { EventSourceOptions, PlayOptions }

/** Every patch of a source, flattened, in order. */
export const patchesOf = (source: PatchSource) => patchesOfAny<ConversationPatch>(source)

/**
 * Patches from a newline-delimited JSON body: one patch, or an array of them,
 * per line. Pass the `Response` of a streaming `fetch`, or its body.
 */
export const fromNdjson = (input: Response | ReadableStream<Uint8Array>) => fromNdjsonOf<ConversationPatch>(input)

/** Patches from Server-Sent Events: each event's `data` is a patch, or an array of them. */
export const fromEventSource = (source: EventSource, options?: EventSourceOptions) =>
  fromEventSourceOf<ConversationPatch>(source, options)

/**
 * A script as a stream: each step is yielded when it is due. Steps due at the
 * same moment are yielded together; aborting ends the stream where it stands.
 */
export const playScript = (script: PatchScript, options?: PlayOptions) => playScriptOf(script, options)

/** Shift every step of a script by `ms` — to chain scripts one after another. */
export const offsetScript = (script: PatchScript, ms: number): PatchScript => offsetScriptOf(script, ms)

/** When a script's last step lands. */
export { scriptLength }

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
