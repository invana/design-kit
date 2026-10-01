// Ids follow the Design Kit Spec (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5).
// Do not edit by hand: change the spec first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

import type { AskPresetId } from "./presets"
import type { StageId } from "./stages"

/** The things the assistant asks back, each on one ask preset. */
export const ASKS = [
  { id: "clarify", name: "Clarify what was meant", stage: "frame", preset: "single" },
  { id: "measure", name: "Choose the measure", stage: "frame", preset: "single" },
  { id: "definition", name: "Confirm a definition", stage: "frame", preset: "confirm" },
  { id: "hunch", name: "Share a hunch", stage: "frame", preset: "long" },
  { id: "window", name: "Time window", stage: "scope", preset: "period" },
  { id: "baseline", name: "Compare against", stage: "scope", preset: "single" },
  { id: "filter", name: "Filter and segment", stage: "scope", preset: "multi" },
  { id: "granularity", name: "Granularity", stage: "scope", preset: "quick" },
  { id: "entities", name: "Pick entities", stage: "scope", preset: "entity" },
  { id: "threshold", name: "Set a threshold", stage: "scope", preset: "number" },
  { id: "ambiguity", name: "Resolve ambiguity", stage: "check", preset: "single" },
  { id: "dataissue", name: "Handle a data issue", stage: "check", preset: "single" },
  { id: "cost", name: "Approve an expensive run", stage: "check", preset: "confirm" },
  { id: "method", name: "Choose a method", stage: "analyse", preset: "single" },
  { id: "assumptions", name: "Confirm assumptions", stage: "analyse", preset: "multi" },
  { id: "confidence", name: "Confidence level", stage: "analyse", preset: "quick" },
  { id: "objectives", name: "Weigh objectives", stage: "analyse", preset: "weights" },
  { id: "scenario", name: "Scenario inputs", stage: "analyse", preset: "form" },
  { id: "format", name: "Choose the output", stage: "explain", preset: "quick" },
  { id: "rate", name: "Rate the answer", stage: "explain", preset: "scale" },
  { id: "next", name: "Suggest what's next", stage: "explain", preset: "suggestions" },
  { id: "approve", name: "Approve an action", stage: "act", preset: "approval" },
  { id: "schedule", name: "Schedule and share", stage: "monitor", preset: "multistep" },
  { id: "reading", name: "Check my reading", stage: "frame", preset: "interpretation" },
  { id: "fork", name: "Pick a reading", stage: "frame", preset: "fork" },
  { id: "range", name: "Set a range", stage: "scope", preset: "range" },
  { id: "model", name: "Specify the model", stage: "analyse", preset: "modelspec" },
  { id: "plan", name: "Review the plan", stage: "analyse", preset: "plan" },
  { id: "hypothesis", name: "State the hypothesis", stage: "analyse", preset: "hypothesis" },
] as const satisfies readonly { id: string; name: string; stage: StageId; preset: AskPresetId }[]

export type AskId = (typeof ASKS)[number]["id"]
