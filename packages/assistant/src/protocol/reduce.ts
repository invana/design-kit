import { applyBlockPatch, type BlockPatch, BlockPatchError } from "@invana/blocks"

import type {
  AnswerState,
  AnswerTurn,
  AskState,
  BlockSpec,
  ConversationSpec,
  TraceStep,
  Turn,
} from "./types"

/**
 * How a spec changes while an answer streams. The API sends one of these at a
 * time; {@link applyPatch} returns a new spec and never mutates the old one, so
 * a controlled `<ChatSession spec>` re-renders exactly what changed.
 */
export type ConversationPatch =
  | { op: "add-turn"; turn: Turn }
  /** Move a turn through its states. An answered ask carries its `value`. */
  | { op: "set-state"; turn: string; state: AskState | AnswerState; value?: unknown }
  | { op: "add-block"; turn: string; block: BlockSpec }
  /**
   * Stream a block: one {@link BlockPatch} — the same patch a board or a page
   * streams the block by. `block` is its index, the last block when left out.
   */
  | { op: "patch-block"; turn: string; block?: number; patch: BlockPatch }
  /** Change a block in place — its rows arriving, a loading block settling. `block` is its index. A `set` block patch. */
  | { op: "update-block"; turn: string; block: number; fields: Record<string, unknown> }
  /**
   * Stream words into a block: `text` is appended to its string `field`
   * (default `text`). `block` is its index, the last block when left out — so
   * a stream sends `add-block` with the field empty, then its words. An
   * `append` block patch.
   */
  | { op: "append-text"; turn: string; text: string; block?: number; field?: string }
  | { op: "add-trace-step"; turn: string; step: TraceStep }
  /** Change a step in place, by id — its detail counting up, its state settling. */
  | { op: "update-trace-step"; turn: string; step: string; fields: Partial<TraceStep> }
  /** Stream a step's reasoning: `text` is appended to its `thinking`. */
  | { op: "append-thinking"; turn: string; step: string; text: string }
  /** Anything else on a turn — its envelope once known, its outcome, its duration. */
  | { op: "update-turn"; turn: string; fields: Record<string, unknown> }
  /** A model's record count, as it changes — the live count behind the header's data reach. */
  | { op: "set-records"; model: string; records: number }
  /** The conversation's own fields — its title, its composer. Never its turns. */
  | { op: "update-spec"; fields: Partial<Omit<ConversationSpec, "id" | "turns">> }

export type ConversationPatchOp = ConversationPatch["op"]

export class PatchError extends Error {}

function onTurn(spec: ConversationSpec, id: string, fn: (turn: Turn) => Turn): ConversationSpec {
  const index = spec.turns.findIndex((t) => t.id === id)
  if (index < 0) throw new PatchError(`No turn "${id}" in conversation "${spec.id}".`)
  const turns = spec.turns.slice()
  turns[index] = fn(turns[index])
  return { ...spec, turns }
}

function asAnswer(turn: Turn, op: string): AnswerTurn {
  if (turn.role !== "assistant" || turn.kind !== "answer") {
    throw new PatchError(`"${op}" applies to an answer; turn "${turn.id}" is not one.`)
  }
  return turn
}

function onStep(answer: AnswerTurn, id: string, op: string, fn: (step: TraceStep) => TraceStep): AnswerTurn {
  const trace = answer.trace ?? []
  const at = trace.findIndex((s) => s.id === id)
  if (at < 0) throw new PatchError(`"${op}": no step "${id}" on turn "${answer.id}".`)
  return { ...answer, trace: trace.map((s, i) => (i === at ? fn(s) : s)) }
}

/** Block `index` of an answer (the last when left out) after a block patch — the one way a block changes. */
function patchBlock(answer: AnswerTurn, op: string, index: number | undefined, patch: BlockPatch): AnswerTurn {
  const at = index ?? answer.blocks.length - 1
  const block = answer.blocks[at]
  if (!block) throw new PatchError(`"${op}": turn "${answer.id}" has no block ${at}.`)
  const blocks = answer.blocks.slice()
  try {
    blocks[at] = applyBlockPatch(block, patch)
  } catch (error) {
    if (error instanceof BlockPatchError) {
      throw new PatchError(`"${op}": block ${at} on turn "${answer.id}": ${error.message}`)
    }
    throw error
  }
  return { ...answer, blocks }
}

export function applyPatch(spec: ConversationSpec, patch: ConversationPatch): ConversationSpec {
  switch (patch.op) {
    case "add-turn":
      if (spec.turns.some((t) => t.id === patch.turn.id)) {
        throw new PatchError(`Turn "${patch.turn.id}" already exists.`)
      }
      return { ...spec, turns: [...spec.turns, patch.turn] }
    case "set-state":
      return onTurn(spec, patch.turn, (turn) => {
        if (turn.role !== "assistant") throw new PatchError(`Turn "${turn.id}" has no state.`)
        if (turn.kind === "ask") {
          return {
            ...turn,
            state: patch.state as AskState,
            ...(patch.value !== undefined ? { value: patch.value } : {}),
          }
        }
        return { ...turn, state: patch.state as AnswerState }
      })
    case "add-block":
      return onTurn(spec, patch.turn, (turn) => {
        const answer = asAnswer(turn, patch.op)
        return { ...answer, blocks: [...answer.blocks, patch.block] }
      })
    case "patch-block":
      return onTurn(spec, patch.turn, (turn) => patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, patch.patch))
    case "update-block":
      return onTurn(spec, patch.turn, (turn) =>
        patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, { op: "set", fields: patch.fields }),
      )
    case "append-text":
      return onTurn(spec, patch.turn, (turn) =>
        patchBlock(asAnswer(turn, patch.op), patch.op, patch.block, { op: "append", at: [patch.field ?? "text"], text: patch.text }),
      )
    case "add-trace-step":
      return onTurn(spec, patch.turn, (turn) => {
        const answer = asAnswer(turn, patch.op)
        const trace = answer.trace ?? []
        // A step with a known id replaces itself — `running` settling to `done`.
        const at = patch.step.id ? trace.findIndex((s) => s.id === patch.step.id) : -1
        const next = at >= 0 ? trace.map((s, i) => (i === at ? patch.step : s)) : [...trace, patch.step]
        return { ...answer, trace: next }
      })
    case "update-trace-step":
      return onTurn(spec, patch.turn, (turn) =>
        onStep(asAnswer(turn, patch.op), patch.step, patch.op, (s) => ({ ...s, ...patch.fields, id: s.id })),
      )
    case "append-thinking":
      return onTurn(spec, patch.turn, (turn) =>
        onStep(asAnswer(turn, patch.op), patch.step, patch.op, (s) => ({
          ...s,
          thinking: (s.thinking ?? "") + patch.text,
        })),
      )
    case "update-turn":
      return onTurn(spec, patch.turn, (turn) => ({ ...turn, ...patch.fields, id: turn.id }) as Turn)
    case "set-records": {
      const models = spec.access?.models ?? []
      if (!spec.access || !models.some((m) => m.id === patch.model)) {
        throw new PatchError(`"set-records": no model "${patch.model}" in conversation "${spec.id}".`)
      }
      return {
        ...spec,
        access: {
          ...spec.access,
          models: models.map((m) => (m.id === patch.model ? { ...m, records: patch.records } : m)),
        },
      }
    }
    case "update-spec":
      return { ...spec, ...patch.fields, id: spec.id, turns: spec.turns }
  }
}

/** Apply patches in order — a recorded stream, replayed. */
export function applyPatches(spec: ConversationSpec, patches: ConversationPatch[]): ConversationSpec {
  return patches.reduce(applyPatch, spec)
}
