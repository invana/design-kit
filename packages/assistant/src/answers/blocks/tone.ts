import type { Tone } from "../../protocol/types"

/** The grammar's tones, as a `Badge`'s. */
export const BADGE_TONE: Record<Tone, "success" | "destructive" | "warning" | "muted"> = {
  good: "success",
  bad: "destructive",
  warn: "warning",
  neutral: "muted",
}
