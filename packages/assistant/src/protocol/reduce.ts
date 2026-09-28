import type { AnswerState, AskState, BlockSpec, ConversationSpec, TraceStep, Turn } from "./types"

/**
 * How a spec changes while an answer streams. The API sends one of these at a
 * time; {@link applyPatch} returns a new spec and never mutates the old one, so
 * a controlled `<Conversation spec>` re-renders exactly what changed.
 */
export type ConversationPatch =
  | { op: "add-turn"; turn: Turn }
  /** Move a turn through its states. An answered ask carries its `value`. */
  | { op: "set-state"; turn: string; state: AskState | AnswerState; value?: unknown }
  | { op: "add-block"; turn: string; block: BlockSpec }
  | { op: "add-trace-step"; turn: string; step: TraceStep }
  /** Anything else on a turn — its envelope once known, its suggestions at the end. */
  | { op: "update-turn"; turn: string; fields: Record<string, unknown> }

export class PatchError extends Error {}

function onTurn(spec: ConversationSpec, id: string, fn: (turn: Turn) => Turn): ConversationSpec {
  const index = spec.turns.findIndex((t) => t.id === id)
  if (index < 0) throw new PatchError(`No turn "${id}" in conversation "${spec.id}".`)
  const turns = spec.turns.slice()
  turns[index] = fn(turns[index])
  return { ...spec, turns }
}

function asAnswer(turn: Turn, op: string) {
  if (turn.role !== "assistant" || turn.kind !== "answer") {
    throw new PatchError(`"${op}" applies to an answer; turn "${turn.id}" is not one.`)
  }
  return turn
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
    case "add-trace-step":
      return onTurn(spec, patch.turn, (turn) => {
        const answer = asAnswer(turn, patch.op)
        const trace = answer.trace ?? []
        // A step with a known id replaces itself — `running` settling to `done`.
        const at = patch.step.id ? trace.findIndex((s) => s.id === patch.step.id) : -1
        const next = at >= 0 ? trace.map((s, i) => (i === at ? patch.step : s)) : [...trace, patch.step]
        return { ...answer, trace: next }
      })
    case "update-turn":
      return onTurn(spec, patch.turn, (turn) => ({ ...turn, ...patch.fields, id: turn.id }) as Turn)
  }
}

/** Apply patches in order — a recorded stream, replayed. */
export function applyPatches(spec: ConversationSpec, patches: ConversationPatch[]): ConversationSpec {
  return patches.reduce(applyPatch, spec)
}
