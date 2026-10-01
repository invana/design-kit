// Ids follow the Design Kit Spec (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5).
// Do not edit by hand: change the spec first, then copy the ids here.
// grammar.test.ts fails when these ids and the blocks disagree.

import type { AnswerKind } from "@invana/blocks"

/**
 * What an answer tells, each drawn by one or more blocks. The answer
 * half of {@link ASK_INTENTS}: an intent is an id and a name, the block is the
 * drawing, and several intents may share one block with different options.
 */
export const ANSWER_INTENTS = [
  { id: "say", name: "Say it in words", kinds: ["narrative"] },
  { id: "figure", name: "One number, or a few", kinds: ["metric", "grid"] },
  { id: "trend", name: "Change over time", kinds: ["timeseries", "control"] },
  { id: "compare", name: "Groups side by side", kinds: ["bars", "dumbbell", "matrix", "funnel"] },
  { id: "rank", name: "Leaders and laggards", kinds: ["ranked", "pareto", "tornado"] },
  { id: "explain-change", name: "What moved the total", kinds: ["waterfall", "decomposition"] },
  { id: "records", name: "Rows, or one entity", kinds: ["table", "record", "attr", "pivot", "profile"] },
  { id: "sequence", name: "What happened when", kinds: ["timeline"] },
  { id: "spread", name: "The shape of the values", kinds: ["histogram", "box", "quantiles", "survival"] },
  { id: "relate", name: "How things connect", kinds: ["scatter", "correlation", "subgraph"] },
  { id: "stats", name: "Test and model results", kinds: ["test", "coef", "forest", "evidence", "modeleval"] },
  { id: "trust", name: "Method, sources, scope and limits", kinds: ["method", "citations", "scope", "caveat", "cannot", "checks"] },
  { id: "act", name: "A proposed action, or a file", kinds: ["proposal", "files"] },
  { id: "run.steps", name: "What the run did, in order", kinds: ["trace"] },
] as const satisfies readonly { id: string; name: string; kinds: readonly AnswerKind[] }[]

export type AnswerIntentId = (typeof ANSWER_INTENTS)[number]["id"]
