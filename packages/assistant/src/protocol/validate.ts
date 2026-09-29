import { ASK_PRESETS, BLOCK_PRESETS, FLOWS, PATTERNS, STAGES } from "../grammar"
import type { AnswerTurn, ConversationSpec } from "./types"

/**
 * What the compiler cannot see: a spec that arrived off the wire.
 *
 * `error` means the spec breaks the contract — an unknown preset, a turn with
 * no id, an envelope field sent as a free block. `warning` means the spec is
 * valid but an answer does not match its pattern, which is how a change
 * explanation without a bridge gets noticed in fixtures and in development.
 */
export interface ValidationIssue {
  level: "error" | "warning"
  /** The turn the issue is on, when there is one. */
  turn?: string
  message: string
}

export interface ValidateOptions {
  /** Preset ids a consumer registered beyond the grammar's. */
  extraAsks?: string[]
  extraBlocks?: string[]
}

const ASK_IDS = new Set<string>(ASK_PRESETS.map((p) => p.id))
const BLOCK_IDS = new Set<string>(BLOCK_PRESETS.map((p) => p.id))
const STAGE_IDS = new Set<string>(STAGES.map((s) => s.id))
const FLOW_IDS = new Set<string>(FLOWS.map((f) => f.id))
const PATTERN_BY = new Map<string, readonly string[]>(PATTERNS.map((p) => [p.id, p.blocks]))

const ASK_STATES = new Set(["pending", "answered", "skipped", "superseded", "expired"])
const ANSWER_STATES = new Set(["running", "partial", "complete", "cannot", "error", "stopped"])

/**
 * Presets a pattern names that the answer carries elsewhere: the envelope, or
 * the answer's own `suggestions` and `trace`. Sent as blocks they are an error.
 */
const CARRIED: Record<string, (a: AnswerTurn) => boolean> = {
  scope: (a) => !!a.envelope?.scope?.length,
  method: (a) => !!a.envelope?.method,
  caveat: (a) => !!a.envelope?.caveats?.length,
  suggestions: (a) => !!a.suggestions?.length,
  trace: (a) => !!a.trace?.length,
}

/** Presets any answer may add to its pattern: the words and the sources. */
const ANYWHERE = new Set(["narrative", "citations"])

function checkPattern(turn: AnswerTurn, issues: ValidationIssue[]) {
  if (!turn.pattern) return
  const expected = PATTERN_BY.get(turn.pattern)
  if (!expected) return
  const present = new Set<string>(turn.blocks.map((b) => b.preset))
  for (const preset of expected) {
    const carried = CARRIED[preset]
    const has = carried ? carried(turn) : present.has(preset)
    if (!has) {
      issues.push({
        level: "warning",
        turn: turn.id,
        message: `Pattern "${turn.pattern}" expects "${preset}", which this answer does not have.`,
      })
    }
  }
  for (const preset of present) {
    if (!expected.includes(preset) && !ANYWHERE.has(preset)) {
      issues.push({
        level: "warning",
        turn: turn.id,
        message: `Block "${preset}" is not part of pattern "${turn.pattern}".`,
      })
    }
  }
}

export function validate(spec: ConversationSpec, options: ValidateOptions = {}): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const error = (message: string, turn?: string) => issues.push({ level: "error", turn, message })
  const asks = new Set([...ASK_IDS, ...(options.extraAsks ?? [])])
  const blocks = new Set([...BLOCK_IDS, ...(options.extraBlocks ?? [])])

  if (typeof spec?.id !== "string" || !spec.id) error("The conversation has no id.")
  if (spec?.analyst !== undefined && (typeof spec.analyst !== "string" || !spec.analyst)) {
    error("The analyst's name is not a non-empty string.")
  }
  if (!Array.isArray(spec?.turns)) {
    error("The conversation has no turns array.")
    return issues
  }

  const seen = new Set<string>()
  for (const turn of spec.turns) {
    const id = typeof turn?.id === "string" ? turn.id : undefined
    if (!id) {
      error("A turn has no id.")
      continue
    }
    if (seen.has(id)) error(`Turn id "${id}" is used twice.`, id)
    seen.add(id)

    if (turn.role === "analyst") {
      if (typeof turn.text !== "string" || !turn.text) error("An analyst turn has no text.", id)
      continue
    }
    if (turn.role !== "assistant") {
      error(`Unknown role "${(turn as { role?: string }).role}".`, id)
      continue
    }

    if (turn.kind === "ask") {
      if (!STAGE_IDS.has(turn.stage)) error(`Unknown stage "${turn.stage}".`, id)
      if (!ASK_STATES.has(turn.state)) error(`Unknown ask state "${turn.state}".`, id)
      if (!asks.has(turn.ask?.preset)) error(`Unknown ask preset "${turn.ask?.preset}".`, id)
      if (turn.answeredAt !== undefined && Number.isNaN(Date.parse(turn.answeredAt))) {
        error(`answeredAt "${turn.answeredAt}" is not an ISO time.`, id)
      }
      if (turn.ask?.preset === "multistep") {
        for (const step of turn.ask.steps ?? []) {
          if (!asks.has(step.preset)) error(`Unknown ask preset "${step.preset}" in step "${step.id}".`, id)
        }
      }
      continue
    }

    if (turn.kind === "answer") {
      if (!ANSWER_STATES.has(turn.state)) error(`Unknown answer state "${turn.state}".`, id)
      if (turn.flow && !FLOW_IDS.has(turn.flow)) error(`Unknown flow "${turn.flow}".`, id)
      if (turn.pattern && !PATTERN_BY.has(turn.pattern)) error(`Unknown pattern "${turn.pattern}".`, id)
      if (!Array.isArray(turn.blocks)) {
        error("An answer has no blocks array.", id)
        continue
      }
      for (const block of turn.blocks) {
        if (!blocks.has(block?.preset)) error(`Unknown block preset "${block?.preset}".`, id)
        else if (block.preset in CARRIED) {
          error(`"${block.preset}" is part of the answer, not a block: send it in the ${block.preset === "suggestions" || block.preset === "trace" ? `answer's "${block.preset}"` : "envelope"}.`, id)
        }
      }
      checkPattern(turn, issues)
      continue
    }

    error(`Unknown assistant turn kind "${(turn as { kind?: string }).kind}".`, id)
  }
  return issues
}
