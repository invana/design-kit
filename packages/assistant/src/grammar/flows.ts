// Copied from Analyst Flow Grammar (https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo, version 5).
// Do not edit by hand: change the grammar first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

import type { AskId } from "./asks"
import type { PatternId } from "./patterns"
import type { StageId } from "./stages"

/** The research flows: the shapes of question analysts bring. */
export const FLOWS = [
  { id: "kpi", name: "KPI check", template: "How is {measure} tracking against {baseline}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["measure", "window", "baseline"], pattern: "snapshot" },
  { id: "diagnose", name: "Root cause", template: "Why did {measure} change in {period}?", stages: ["frame", "scope", "check", "analyse", "explain", "act"], asks: ["measure", "window", "baseline", "hunch"], pattern: "bridge" },
  { id: "compare", name: "Comparison & benchmark", template: "How does {A} compare with {B} on {measures}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["entities", "measure", "confidence"], pattern: "comparison" },
  { id: "rank", name: "Top-N ranking", template: "Which {entities} lead or lag on {measure}?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["measure", "filter", "threshold"], pattern: "ranking" },
  { id: "segment", name: "Segmentation", template: "What groups exist within {population}, and how do they differ?", stages: ["frame", "scope", "analyse", "explain"], asks: ["filter", "method", "assumptions"], pattern: "profile" },
  { id: "cohort", name: "Cohort & retention", template: "How do {cohorts} behave over time?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "window", "granularity"], pattern: "cohort" },
  { id: "forecast", name: "Trend & forecast", template: "Where is {measure} heading?", stages: ["frame", "scope", "analyse", "explain", "monitor"], asks: ["window", "granularity", "method", "assumptions"], pattern: "forecast" },
  { id: "anomaly", name: "Anomaly & monitoring", template: "Tell me when {measure} behaves unusually.", stages: ["scope", "analyse", "act", "monitor"], asks: ["measure", "threshold", "approve", "schedule"], pattern: "anomaly" },
  { id: "drivers", name: "Driver analysis", template: "What moves {measure}?", stages: ["frame", "analyse", "explain"], asks: ["measure", "method", "assumptions"], pattern: "drivers" },
  { id: "experiment", name: "Experiment readout", template: "Did {change} work?", stages: ["frame", "check", "analyse", "explain", "act"], asks: ["entities", "definition", "confidence"], pattern: "readout" },
  { id: "scenario", name: "Scenario & what-if", template: "What happens to {outcome} if {input} changes?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["scenario", "assumptions"], pattern: "scenariot" },
  { id: "funnel", name: "Funnel & journey", template: "Where do {entities} drop out of {process}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "window", "filter"], pattern: "funnelv" },
  { id: "distribution", name: "Distribution & outliers", template: "What does the spread of {measure} look like, and what sits outside it?", stages: ["scope", "analyse", "explain"], asks: ["measure", "filter", "threshold"], pattern: "spread" },
  { id: "audit", name: "Data audit & reconciliation", template: "Can I trust {dataset}? Do {A} and {B} agree?", stages: ["check", "analyse", "explain", "act"], asks: ["definition", "dataissue", "cost"], pattern: "quality" },
  { id: "entity", name: "Entity lookup (360)", template: "Tell me everything about {entity}.", stages: ["frame", "check", "explain"], asks: ["ambiguity", "entities"], pattern: "e360" },
  { id: "network", name: "Relationships & networks", template: "How are {entities} connected?", stages: ["frame", "scope", "check", "analyse", "explain"], asks: ["entities", "threshold", "cost"], pattern: "relmap" },
  { id: "qual", name: "Qualitative synthesis", template: "What are people saying about {topic}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["filter", "window", "hunch"], pattern: "memo" },
  { id: "recommend", name: "Recommendation & priority", template: "What should we do about {problem}, and in what order?", stages: ["analyse", "explain", "act"], asks: ["assumptions", "method", "approve"], pattern: "recommend" },
  { id: "report", name: "Report & schedule", template: "Send me {analysis} every {cadence}.", stages: ["explain", "act", "monitor"], asks: ["format", "schedule", "approve"], pattern: "delivery" },
  { id: "combine", name: "Combination design", template: "Which combination of {candidates} best meets {objectives}?", stages: ["frame", "scope", "analyse", "explain", "act"], asks: ["entities", "objectives", "threshold", "assumptions"], pattern: "shortlist" },
  { id: "significance", name: "Significance test", template: "Is the difference in {measure} between {A} and {B} real?", stages: ["frame", "scope", "analyse", "explain"], asks: ["hypothesis", "confidence", "assumptions"], pattern: "significance" },
  { id: "effects", name: "Effect estimation", template: "How much does each {factor} change {outcome}, holding the others fixed?", stages: ["frame", "scope", "analyse", "explain"], asks: ["model", "plan", "assumptions"], pattern: "effects" },
  { id: "association", name: "Correlation & association", template: "Which {measures} move together, and how strongly?", stages: ["frame", "scope", "check", "analyse", "explain"], asks: ["reading", "filter", "range"], pattern: "association" },
  { id: "spc", name: "Process control", template: "Is {process} in control, and what causes most of the defects?", stages: ["scope", "analyse", "explain", "monitor"], asks: ["window", "granularity", "range"], pattern: "spc" },
  { id: "timeto", name: "Time to event", template: "How long until {event}, and does it differ by {group}?", stages: ["frame", "scope", "analyse", "explain"], asks: ["definition", "fork", "window"], pattern: "timeto" },
  { id: "modelcheck", name: "Model check", template: "How well does {model} predict {outcome}, and where does it fail?", stages: ["check", "analyse", "explain", "act"], asks: ["model", "range", "plan"], pattern: "modelcheck" },
] as const satisfies readonly {
  id: string
  name: string
  template: string
  stages: readonly StageId[]
  asks: readonly AskId[]
  pattern: PatternId
}[]

export type FlowId = (typeof FLOWS)[number]["id"]
