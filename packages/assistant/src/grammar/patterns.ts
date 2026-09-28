// Copied from Analyst Flow Grammar (https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo, version 3).
// Do not edit by hand: change the grammar first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

import type { BlockPresetId } from "./presets"

/**
 * Answer patterns: which blocks an answer has, in order. The flow picks the
 * pattern, and `validate()` checks each answer against it.
 */
export const PATTERNS = [
  { id: "snapshot", name: "KPI snapshot", blocks: ["grid", "timeseries", "narrative", "scope"] },
  { id: "bridge", name: "Change explanation", blocks: ["narrative", "waterfall", "ranked", "citations"] },
  { id: "comparison", name: "Comparison", blocks: ["bars", "table", "caveat"] },
  { id: "ranking", name: "Ranked list", blocks: ["ranked", "table", "suggestions"] },
  { id: "profile", name: "Segment profile", blocks: ["table", "bars", "narrative"] },
  { id: "cohort", name: "Cohort matrix", blocks: ["matrix", "narrative"] },
  { id: "forecast", name: "Forecast", blocks: ["timeseries", "record", "caveat"] },
  { id: "anomaly", name: "Anomaly report", blocks: ["timeseries", "timeline", "ranked"] },
  { id: "drivers", name: "Driver ranking", blocks: ["ranked", "narrative", "caveat"] },
  { id: "readout", name: "Experiment readout", blocks: ["metric", "record", "caveat", "proposal"] },
  { id: "scenariot", name: "Scenario table", blocks: ["record", "table", "ranked"] },
  { id: "funnelv", name: "Funnel", blocks: ["funnel", "table"] },
  { id: "spread", name: "Distribution", blocks: ["histogram", "table"] },
  { id: "quality", name: "Quality report", blocks: ["checks", "table", "files"] },
  { id: "e360", name: "Entity 360", blocks: ["record", "timeline", "table"] },
  { id: "relmap", name: "Relationship map", blocks: ["subgraph", "ranked"] },
  { id: "memo", name: "Findings memo", blocks: ["narrative", "citations", "caveat", "suggestions"] },
  { id: "recommend", name: "Recommendation", blocks: ["table", "ranked", "proposal"] },
  { id: "delivery", name: "Scheduled delivery", blocks: ["files", "proposal", "record"] },
  { id: "shortlist", name: "Candidate shortlist", blocks: ["attr", "histogram", "caveat", "proposal"] },
  { id: "significance", name: "Significance test", blocks: ["test", "box", "evidence", "caveat"] },
  { id: "effects", name: "Effect estimates", blocks: ["coef", "forest", "method", "caveat"] },
  { id: "association", name: "Association", blocks: ["correlation", "scatter", "caveat"] },
  { id: "spc", name: "Control report", blocks: ["control", "pareto", "decomposition"] },
  { id: "timeto", name: "Time to event", blocks: ["survival", "quantiles", "dumbbell", "caveat"] },
  { id: "modelcheck", name: "Model check", blocks: ["modeleval", "profile", "pivot", "tornado"] },
] as const satisfies readonly { id: string; name: string; blocks: readonly BlockPresetId[] }[]

export type PatternId = (typeof PATTERNS)[number]["id"]
