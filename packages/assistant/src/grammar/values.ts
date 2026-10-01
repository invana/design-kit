// Ids follow the Design Kit Spec (https://claude.ai/artifact/VcN3AYgmbdCpHbxXZjMir5).
// Do not edit by hand: change the spec first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

/**
 * Value types: every figure an answer shows is one of these, written one way
 * by `formatValue`. The unit vocabulary inside `quantity` is open.
 */
export const VALUE_TYPES = [
  { id: "quantity", name: "Quantity with unit", example: "2,480 kg/ha · 26 d" },
  { id: "currency", name: "Currency", example: "£84k · −£620k · £4.1M" },
  { id: "percent", name: "Share", example: "76% · 8.2%" },
  { id: "pp", name: "Percentage points", example: "+4.8 pts · ▼ 1.8 pts" },
  { id: "bp", name: "Basis points", example: "+12 bp" },
  { id: "ratio", name: "Ratio or index", example: "OR 1.29 · beta 0.38 · 1.3×" },
  { id: "rate", name: "Rate per N", example: "8.2 per 100 discharges" },
  { id: "count", name: "Count with n", example: "1,284 plots · n = 1,061" },
  { id: "duration", name: "Duration", example: "1.2 s · 3 min · 26 d" },
  { id: "estimate", name: "Estimate with interval", example: "1.29 (95% CI 1.04–1.60)" },
  { id: "pvalue", name: "p-value", example: "p = 0.02 · p < 0.001" },
  { id: "score", name: "Ordinal score", example: "7 / 9 · 4 of 5" },
  { id: "time", name: "Point in time", example: "as of 29 Sep 06:00 · Q3 2026" },
] as const

export type ValueTypeId = (typeof VALUE_TYPES)[number]["id"]
