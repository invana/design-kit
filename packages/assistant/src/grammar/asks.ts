// Ids follow the Design Kit Spec (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5).
// Do not edit by hand: change the spec first, then copy the ids here.
// grammar.test.ts fails when these ids and the block registry disagree.

import type { AskKind } from "@invana/blocks"
import type { StageId } from "./stages"

/** The things the assistant asks back, each on one block. */
export const ASK_INTENTS = [
  { id: "clarify", name: "Clarify what was meant", stage: "frame", kind: "single" },
  { id: "measure", name: "Choose the measure", stage: "frame", kind: "single" },
  { id: "definition", name: "Confirm a definition", stage: "frame", kind: "confirm" },
  { id: "hunch", name: "Share a hunch", stage: "frame", kind: "long" },
  { id: "window", name: "Time window", stage: "scope", kind: "period" },
  { id: "baseline", name: "Compare against", stage: "scope", kind: "single" },
  { id: "filter", name: "Filter and segment", stage: "scope", kind: "multi" },
  { id: "granularity", name: "Granularity", stage: "scope", kind: "quick" },
  { id: "entities", name: "Pick entities", stage: "scope", kind: "entity" },
  { id: "threshold", name: "Set a threshold", stage: "scope", kind: "number" },
  { id: "ambiguity", name: "Resolve ambiguity", stage: "check", kind: "single" },
  { id: "dataissue", name: "Handle a data issue", stage: "check", kind: "single" },
  { id: "cost", name: "Approve an expensive run", stage: "check", kind: "confirm" },
  { id: "method", name: "Choose a method", stage: "analyse", kind: "single" },
  { id: "assumptions", name: "Confirm assumptions", stage: "analyse", kind: "multi" },
  { id: "confidence", name: "Confidence level", stage: "analyse", kind: "quick" },
  { id: "objectives", name: "Weigh objectives", stage: "analyse", kind: "weights" },
  { id: "scenario", name: "Scenario inputs", stage: "analyse", kind: "form" },
  { id: "format", name: "Choose the output", stage: "explain", kind: "quick" },
  { id: "rate", name: "Rate the answer", stage: "explain", kind: "scale" },
  { id: "next", name: "Suggest what's next", stage: "explain", kind: "suggestions" },
  { id: "approve", name: "Approve an action", stage: "act", kind: "approval" },
  { id: "schedule", name: "Schedule and share", stage: "monitor", kind: "multistep" },
  { id: "reading", name: "Check my reading", stage: "frame", kind: "interpretation" },
  { id: "fork", name: "Pick a reading", stage: "frame", kind: "fork" },
  { id: "range", name: "Set a range", stage: "scope", kind: "range" },
  { id: "model", name: "Specify the model", stage: "analyse", kind: "modelspec" },
  { id: "plan", name: "Review the plan", stage: "analyse", kind: "plan" },
  { id: "hypothesis", name: "State the hypothesis", stage: "analyse", kind: "hypothesis" },
] as const satisfies readonly { id: string; name: string; stage: StageId; kind: AskKind }[]

export type AskIntentId = (typeof ASK_INTENTS)[number]["id"]
