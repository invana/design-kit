import { describe, expect, it } from "vitest"

import { BUILT_IN_ASKS, BUILT_IN_BLOCKS } from "../conversations/registry"
import { EVENT_TYPES } from "../protocol/events"
import { ANSWER_INTENTS, ANSWER_KINDS, ASK_INTENTS, ASK_KINDS, BLOCKS, FLOWS, PATTERNS, STAGES } from "./index"

const sorted = (xs: Iterable<string>) => [...xs].sort()

describe("the block registry names exactly the grammar's blocks", () => {
  it("asks", () => {
    expect(sorted(Object.keys(BUILT_IN_ASKS))).toEqual(sorted(ASK_KINDS))
  })
  it("blocks", () => {
    expect(sorted(Object.keys(BUILT_IN_BLOCKS))).toEqual(sorted(ANSWER_KINDS))
  })
})

describe("the grammar is internally consistent", () => {
  const blocks = new Set<string>(ANSWER_KINDS)
  const askKinds = new Set<string>(ASK_KINDS)
  const asks = new Set<string>(ASK_INTENTS.map((a) => a.id))
  const patterns = new Set<string>(PATTERNS.map((p) => p.id))
  const stages = new Set<string>(STAGES.map((s) => s.id))

  it("every pattern is built from blocks", () => {
    for (const p of PATTERNS) for (const b of p.blocks) expect(blocks, `${p.id} → ${b}`).toContain(b)
  })
  it("every ask uses an block at a known stage", () => {
    for (const a of ASK_INTENTS) {
      expect(askKinds, a.id).toContain(a.kind)
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
  it("every block serves exactly one answer intent", () => {
    const served = ANSWER_INTENTS.flatMap((i) => i.kinds)
    expect(sorted(served)).toEqual(sorted(blocks))
  })
  it("ids are unique within each set", () => {
    for (const ids of [BLOCKS, ASK_INTENTS, ANSWER_INTENTS, FLOWS, PATTERNS, STAGES].map((set) => set.map((x) => x.id))) {
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
  it("the counts match the published grammar", () => {
    expect({
      stages: STAGES.length,
      flows: FLOWS.length,
      askKinds: ASK_KINDS.length,
      answerKinds: ANSWER_KINDS.length,
      asks: ASK_INTENTS.length,
      answerIntents: ANSWER_INTENTS.length,
      patterns: PATTERNS.length,
      events: EVENT_TYPES.length,
    }).toEqual({ stages: 7, flows: 26, askKinds: 21, answerKinds: 42, asks: 29, answerIntents: 15, patterns: 26, events: 16 })
  })
})
