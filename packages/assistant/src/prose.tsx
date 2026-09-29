import * as React from "react"

/**
 * `**…**` spans as strong, the rest as text. The only markup the grammar
 * allows in prose: the figure the sentence leads with, or what yes will cost.
 */
export function strong(text: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    )
}
