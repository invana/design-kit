// Ids follow the Design Kit Spec (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5).
// Do not edit by hand: change the spec first, then copy the ids here.
// grammar.test.ts fails when these ids and the block presets disagree.

import type { BlockPresetId } from "./presets"

/**
 * What an answer tells, each drawn by one or more block presets. The answer
 * half of {@link ASKS}: an intent is an id and a name, the block is the
 * drawing, and several intents may share one block with different options.
 */
export const ANSWER_INTENTS = [
  { id: "say", name: "Say it in words", presets: ["narrative"] },
  { id: "figure", name: "One number, or a few", presets: ["metric", "grid"] },
  { id: "trend", name: "Change over time", presets: ["timeseries", "control"] },
  { id: "compare", name: "Groups side by side", presets: ["bars", "dumbbell", "matrix", "funnel"] },
  { id: "rank", name: "Leaders and laggards", presets: ["ranked", "pareto", "tornado"] },
  { id: "explain-change", name: "What moved the total", presets: ["waterfall", "decomposition"] },
  { id: "records", name: "Rows, or one entity", presets: ["table", "record", "attr", "pivot", "profile"] },
  { id: "sequence", name: "What happened when", presets: ["timeline"] },
  { id: "spread", name: "The shape of the values", presets: ["histogram", "box", "quantiles", "survival"] },
  { id: "relate", name: "How things connect", presets: ["scatter", "correlation", "subgraph"] },
  { id: "stats", name: "Test and model results", presets: ["test", "coef", "forest", "evidence", "modeleval"] },
  { id: "trust", name: "Method, sources, scope and limits", presets: ["method", "citations", "scope", "caveat", "cannot", "checks"] },
  { id: "act", name: "A proposed action, or a file", presets: ["proposal", "files"] },
  { id: "run.steps", name: "What the run did, in order", presets: ["trace"] },
] as const satisfies readonly { id: string; name: string; presets: readonly BlockPresetId[] }[]

export type AnswerIntentId = (typeof ANSWER_INTENTS)[number]["id"]
