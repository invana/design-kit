import { describe, expect, it } from "vitest"

import { BUILT_IN_ASKS, BUILT_IN_BLOCKS } from "../conversations/registry"
import { EVENT_TYPES } from "../protocol/events"
import { ANSWER_INTENTS, ASKS, ASK_PRESETS, BLOCK_PRESETS, FLOWS, PATTERNS, STAGES } from "./index"

const sorted = (xs: Iterable<string>) => [...xs].sort()

describe("the preset registry names exactly the grammar's presets", () => {
  it("asks", () => {
    expect(sorted(Object.keys(BUILT_IN_ASKS))).toEqual(sorted(ASK_PRESETS.map((p) => p.id)))
  })
  it("blocks", () => {
    expect(sorted(Object.keys(BUILT_IN_BLOCKS))).toEqual(sorted(BLOCK_PRESETS.map((p) => p.id)))
  })
})

describe("the grammar is internally consistent", () => {
  const blocks = new Set<string>(BLOCK_PRESETS.map((p) => p.id))
  const askPresets = new Set<string>(ASK_PRESETS.map((p) => p.id))
  const asks = new Set<string>(ASKS.map((a) => a.id))
  const patterns = new Set<string>(PATTERNS.map((p) => p.id))
  const stages = new Set<string>(STAGES.map((s) => s.id))

  it("every pattern is built from block presets", () => {
    for (const p of PATTERNS) for (const b of p.blocks) expect(blocks, `${p.id} → ${b}`).toContain(b)
  })
  it("every ask uses an ask preset at a known stage", () => {
    for (const a of ASKS) {
      expect(askPresets, a.id).toContain(a.preset)
      expect(stages, a.id).toContain(a.stage)
    }
  })
  it("every flow walks known stages, asks known asks and answers in a known pattern", () => {
    for (const f of FLOWS) {
      for (const s of f.stages) expect(stages, `${f.id} stage ${s}`).toContain(s)
      for (const a of f.asks) expect(asks, `${f.id} ask ${a}`).toContain(a)
      expect(patterns, f.id).toContain(f.pattern)
    }
  })
  it("every block preset serves exactly one answer intent", () => {
    const served = ANSWER_INTENTS.flatMap((i) => i.presets)
    expect(sorted(served)).toEqual(sorted(blocks))
  })
  it("ids are unique within each set", () => {
    for (const ids of [ASK_PRESETS, BLOCK_PRESETS, ASKS, ANSWER_INTENTS, FLOWS, PATTERNS, STAGES].map((set) => set.map((x) => x.id))) {
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
  it("the counts match the published grammar", () => {
    expect({
      stages: STAGES.length,
      flows: FLOWS.length,
      askPresets: ASK_PRESETS.length,
      blockPresets: BLOCK_PRESETS.length,
      asks: ASKS.length,
      answerIntents: ANSWER_INTENTS.length,
      patterns: PATTERNS.length,
      events: EVENT_TYPES.length,
    }).toEqual({ stages: 7, flows: 26, askPresets: 21, blockPresets: 41, asks: 29, answerIntents: 14, patterns: 26, events: 16 })
  })
})
