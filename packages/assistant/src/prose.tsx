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

const DIRECTION = /([▲▼]\s?[+−-]?[\d.,]+(?:\s?(?:pts|pp|bps|%))?)/
const MARKER = /(\[\d+\])/

function tone(figure: string) {
  return figure.startsWith("▲") ? "text-primary" : "text-destructive"
}

/**
 * Prose as an answer writes it: `**…**` a figure, `[n]` the marker for source
 * n where the clause it backs ends, and a figure led by `▲` or `▼` in the tone
 * of its direction — the arrow is the direction, so the colour follows it.
 */
export function prose(text: string, marker: (n: number) => React.ReactNode): React.ReactNode[] {
  let key = 0
  const plain = (part: string): React.ReactNode[] =>
    part
      .split(MARKER)
      .filter(Boolean)
      .flatMap((piece): React.ReactNode[] => {
        const cite = piece.match(/^\[(\d+)\]$/)
        if (cite) return [<React.Fragment key={key++}>{marker(Number(cite[1]))}</React.Fragment>]
        return piece
          .split(DIRECTION)
          .filter(Boolean)
          .map((bit) =>
            DIRECTION.test(bit) && /^[▲▼]/.test(bit) ? (
              <span key={key++} className={tone(bit)}>
                {bit}
              </span>
            ) : (
              <React.Fragment key={key++}>{bit}</React.Fragment>
            ),
          )
      })
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .flatMap((part): React.ReactNode[] => {
      if (!(part.startsWith("**") && part.endsWith("**"))) return plain(part)
      const figure = part.slice(2, -2)
      return [
        <strong key={key++} className={/^[▲▼]/.test(figure) ? tone(figure) : undefined}>
          {figure}
        </strong>,
      ]
    })
}
