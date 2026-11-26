import { describe, expect, it } from "vitest"

import { humanWait } from "./format"

describe("humanWait", () => {
  it("writes the two largest units", () => {
    expect(humanWait(12_000)).toBe("12s")
    expect(humanWait(62_000)).toBe("1m 2s")
    expect(humanWait(3_780_000)).toBe("1h 3m")
    expect(humanWait(90_000_000)).toBe("1d 1h")
  })

  it("leaves out a unit that is zero, and never goes below zero", () => {
    expect(humanWait(120_000)).toBe("2m")
    expect(humanWait(86_400_000)).toBe("1d")
    expect(humanWait(-5)).toBe("0s")
    expect(humanWait(400)).toBe("0s")
  })
})
