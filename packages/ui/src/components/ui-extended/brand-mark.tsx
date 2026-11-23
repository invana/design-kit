import * as React from "react"

import { cn } from "../../lib/utils"

export interface BrandMarkProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Whose mark this is — "Neo4j". The monogram is drawn from it when there is no `src`. */
  name: string
  /**
   * The logo, as a URL or a `data:` URI. Drawn through `<img>`, never inlined,
   * so an SVG from a third-party package cannot run script.
   */
  src?: string | null
  /** `sm` sits in a breadcrumb or a nested row, `md` in a list row, `lg` on a card or a header. */
  size?: "sm" | "md" | "lg"
}

const SIZE = {
  sm: "size-control-xs rounded-sm text-[0.6rem]",
  md: "size-control-md rounded-md text-xs",
  lg: "size-control-lg rounded-md text-sm",
} as const

/** The colour tokens a monogram is drawn on; the name picks one, so a name keeps its colour. */
const TONES = [
  "bg-primary/15 text-primary",
  "bg-info/15 text-info",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-destructive/15 text-destructive",
] as const

/** Two characters: the first, then the first capital or digit after it ("Neo4j" → "N4", "TinkerGraph" → "TG"). */
export function monogram(name: string): string {
  const chars = [...name.replace(/[^\p{L}\p{N}]/gu, "")]
  if (chars.length === 0) return "?"
  const second = chars.slice(1).find((c) => /[\p{Lu}\p{N}]/u.test(c)) ?? chars[1] ?? ""
  return (chars[0] + second).toUpperCase()
}

function tone(name: string) {
  let hash = 0
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  return TONES[hash % TONES.length]
}

/**
 * A logo in a rounded tile — a connector, a vendor, a source — or, without
 * one, a two-letter monogram on a colour its name always picks. It is
 * decoration beside the name it stands for, so screen readers skip it.
 */
export function BrandMark({ name, src, size = "md", className, ...props }: BrandMarkProps) {
  const [failed, setFailed] = React.useState(false)
  const image = src && !failed
  return (
    <span
      data-slot="brand-mark"
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden font-mono font-semibold",
        SIZE[size],
        image ? "bg-muted" : tone(name),
        className
      )}
      {...props}
    >
      {image ? (
        <img src={src} alt="" className="size-full object-contain p-[12%]" onError={() => setFailed(true)} />
      ) : (
        monogram(name)
      )}
    </span>
  )
}
