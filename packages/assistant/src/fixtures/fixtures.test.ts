import { describe, expect, it } from "vitest"

import { validate } from "../protocol/validate"
import { SESSIONS } from "./index"

/**
 * Where a session's answer does not match its pattern. Each line is real drift
 * between the grammar's sessions and its patterns, found by `validate()`; it is
 * listed so that new drift fails this test, and it is resolved in the grammar
 * (fix the session or the pattern), then removed here.
 */
const KNOWN_DRIFT: Record<string, string[]> = {
  plantBreeder: [
    "t5: Pattern \"drivers\" expects \"narrative\", which this answer does not have.",
    "t8: Pattern \"shortlist\" expects \"attr\", which this answer does not have.",
    "t8: Pattern \"shortlist\" expects \"proposal\", which this answer does not have.",
    "t8: Block \"table\" is not part of pattern \"shortlist\".",
    "t10: Pattern \"scenariot\" expects \"record\", which this answer does not have.",
    "t10: Pattern \"scenariot\" expects \"ranked\", which this answer does not have.",
  ],
  equityTrader: [
    "t3: Pattern \"bridge\" expects \"ranked\", which this answer does not have.",
    "t9: Pattern \"scenariot\" expects \"record\", which this answer does not have.",
    "t9: Pattern \"scenariot\" expects \"ranked\", which this answer does not have.",
    "t9: Block \"grid\" is not part of pattern \"scenariot\".",
  ],
  healthResearcher: [
    "t4: Pattern \"comparison\" expects \"table\", which this answer does not have.",
    "t4: Pattern \"comparison\" expects \"caveat\", which this answer does not have.",
    "t4: Block \"grid\" is not part of pattern \"comparison\".",
    "t8: Pattern \"readout\" expects \"record\", which this answer does not have.",
    "t8: Pattern \"readout\" expects \"proposal\", which this answer does not have.",
    "t10: Block \"ranked\" is not part of pattern \"memo\".",
  ],
  supplyChainPlanner: [
    "t3: Pattern \"anomaly\" expects \"ranked\", which this answer does not have.",
    "t3: Block \"grid\" is not part of pattern \"anomaly\".",
    "t6: Pattern \"recommend\" expects \"ranked\", which this answer does not have.",
    "t9: Pattern \"delivery\" expects \"proposal\", which this answer does not have.",
    "t9: Pattern \"delivery\" expects \"record\", which this answer does not have.",
  ],
  productDataScientist: [
    "t11: Pattern \"significance\" expects \"evidence\", which this answer does not have.",
  ],
}

describe.each(Object.entries(SESSIONS))("session %s", (name, spec) => {
  const issues = validate(spec)

  it("keeps the contract", () => {
    expect(issues.filter((i) => i.level === "error")).toEqual([])
  })

  it("matches its patterns, apart from known drift", () => {
    const warnings = issues.filter((i) => i.level === "warning").map((i) => `${i.turn}: ${i.message}`)
    expect(warnings).toEqual(KNOWN_DRIFT[name] ?? [])
  })
})
