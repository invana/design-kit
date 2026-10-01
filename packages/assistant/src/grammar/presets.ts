// Copied from Analyst Flow Grammar (https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo, version 5).
// Do not edit by hand: change the grammar first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

/**
 * Ask presets: the control the analyst answers with. Each fixes the type of
 * the value that comes back (`returns`, as the grammar's → labels).
 */
export const ASK_PRESETS = [
  { id: "confirm", name: "Confirm", returns: "boolean", tier: "today" },
  { id: "single", name: "Single choice", returns: "string", tier: "today" },
  { id: "multi", name: "Multiple choice", returns: "string[]", tier: "today" },
  { id: "quick", name: "Quick pick", returns: "string", tier: "today" },
  { id: "period", name: "Period", returns: "{from, to, label}", tier: "today" },
  { id: "number", name: "Number", returns: "number", tier: "today" },
  { id: "short", name: "Short text", returns: "string", tier: "today" },
  { id: "long", name: "Long text", returns: "string", tier: "today" },
  { id: "entity", name: "Entity pick", returns: "id[]", tier: "next" },
  { id: "scale", name: "Scale", returns: "1–5", tier: "today" },
  { id: "multistep", name: "Multi-step", returns: "Record<id, value>", tier: "today" },
  { id: "form", name: "Form", returns: "Record<field, value>", tier: "next" },
  { id: "weights", name: "Weights", returns: "Record<objective, 0–100>", tier: "today" },
  { id: "approval", name: "Approval", returns: "approve | reject", tier: "today" },
  { id: "interpretation", name: "Interpretation", returns: "Record<slot, value>", tier: "today" },
  { id: "fork", name: "Reading fork", returns: "readingId", tier: "next" },
  { id: "plan", name: "Plan preview", returns: "stepId[]", tier: "next" },
  { id: "modelspec", name: "Model spec", returns: "{outcome, predictors[], group?, controls[]}", tier: "next" },
  { id: "hypothesis", name: "Hypothesis", returns: "{test, tails, alpha}", tier: "next" },
  { id: "range", name: "Range", returns: "{min, max}", tier: "next" },
  { id: "suggestions", name: "Suggestions", returns: "string", tier: "today" },
] as const

export type AskPresetId = (typeof ASK_PRESETS)[number]["id"]

/** Block presets: the building blocks an answer is made of. */
export const BLOCK_PRESETS = [
  { id: "narrative", name: "Narrative", tier: "today" },
  { id: "metric", name: "Metric", tier: "today" },
  { id: "grid", name: "Metric grid", tier: "today" },
  { id: "table", name: "Table preview", tier: "today" },
  { id: "attr", name: "Attribute matrix", tier: "today" },
  { id: "record", name: "Record", tier: "today" },
  { id: "ranked", name: "Ranked list", tier: "today" },
  { id: "timeseries", name: "Time series", tier: "today" },
  { id: "bars", name: "Bar comparison", tier: "next" },
  { id: "waterfall", name: "Bridge", tier: "next" },
  { id: "matrix", name: "Matrix", tier: "next" },
  { id: "funnel", name: "Funnel", tier: "next" },
  { id: "histogram", name: "Distribution", tier: "next" },
  { id: "timeline", name: "Timeline", tier: "today" },
  { id: "subgraph", name: "Subgraph", tier: "later" },
  { id: "method", name: "Method", tier: "today" },
  { id: "citations", name: "Citations", tier: "today" },
  { id: "files", name: "Files", tier: "today" },
  { id: "proposal", name: "Proposal", tier: "today" },
  { id: "cannot", name: "Cannot answer", tier: "today" },
  { id: "caveat", name: "Caveat", tier: "today" },
  { id: "scope", name: "Scope line", tier: "today" },
  { id: "checks", name: "Checks", tier: "next" },
  { id: "trace", name: "Progress trace", tier: "today" },
  { id: "test", name: "Test result", tier: "next" },
  { id: "coef", name: "Coefficients", tier: "next" },
  { id: "forest", name: "Forest plot", tier: "next" },
  { id: "scatter", name: "Scatter", tier: "next" },
  { id: "box", name: "Box plot", tier: "next" },
  { id: "correlation", name: "Correlation", tier: "next" },
  { id: "control", name: "Control chart", tier: "next" },
  { id: "pareto", name: "Pareto", tier: "next" },
  { id: "survival", name: "Survival curve", tier: "next" },
  { id: "tornado", name: "Tornado", tier: "next" },
  { id: "decomposition", name: "Decomposition", tier: "next" },
  { id: "modeleval", name: "Model evaluation", tier: "next" },
  { id: "pivot", name: "Pivot", tier: "next" },
  { id: "profile", name: "Column profile", tier: "next" },
  { id: "evidence", name: "Evidence strength", tier: "next" },
  { id: "dumbbell", name: "Dumbbell", tier: "next" },
  { id: "quantiles", name: "Quantiles", tier: "today" },
] as const

export type BlockPresetId = (typeof BLOCK_PRESETS)[number]["id"]
