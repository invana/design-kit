/**
 * The tones a short muted fact can take — a count, a meta, a version state —
 * and the token class that colours its text. One map, so a nav count and a
 * tree meta in the same tone are the same colour.
 *
 * @example
 * ```tsx
 * <span className={toneText[item.countTone ?? "muted"]}>{item.count}</span>
 * ```
 */
export type TextTone = "muted" | "success" | "warning" | "destructive" | "info"

export const toneText: Record<TextTone, string> = {
  muted: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  info: "text-info",
}
