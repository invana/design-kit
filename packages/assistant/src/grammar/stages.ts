// Copied from Analyst Flow Grammar (https://claude.ai/artifact/JQyqjKUTyrADw5vFvsFVzo, version 5).
// Do not edit by hand: change the grammar first, then copy the ids here.
// grammar.test.ts fails when these ids and the preset registry disagree.

/** The seven stages every flow walks some of, in order. */
export const STAGES = [
  { id: "frame", name: "Frame" },
  { id: "scope", name: "Scope" },
  { id: "check", name: "Check data" },
  { id: "analyse", name: "Analyse" },
  { id: "explain", name: "Explain" },
  { id: "act", name: "Act" },
  { id: "monitor", name: "Monitor" },
] as const

export type StageId = (typeof STAGES)[number]["id"]
