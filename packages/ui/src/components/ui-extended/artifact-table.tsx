import * as React from "react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

export interface Artifact {
  /** The file's name as the step wrote it — `rows-1284.csv`. */
  name: React.ReactNode
  /** What produced it — `interpreter`, `export`, `rejects`, `input`. */
  kind?: React.ReactNode
  size?: React.ReactNode
  /**
   * **The address.** The same bytes produced twice are one artifact, so the
   * digest — eight characters, mono — is what a reader quotes, not the name.
   */
  digest?: React.ReactNode
  /** When it landed, on the run's own clock — `+76.8s`. */
  written?: React.ReactNode
  /**
   * Retention has taken the bytes. The row stays and is struck: *this file
   * existed and is gone* is a different fact from *no file was written*.
   */
  gone?: boolean
  /** A glyph before the name, in `list` — the file's type. Passed in: the kit ships no icon set. */
  icon?: React.ReactNode
}

export interface ArtifactTableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  files: Artifact[]
  /**
   * `table` (default) — the step's full record: header, kind, written, and an
   * Open / Download per row. `list` — name, size and digest in bare rows, for
   * the files an answer hands over, where the header and buttons would
   * outweigh two or three names.
   */
  variant?: "table" | "list"
  onOpen?: (file: Artifact, index: number) => void
  onDownload?: (file: Artifact, index: number) => void
  /** Anything else a row offers. Replaces the two defaults when given. */
  renderActions?: (file: Artifact, index: number) => React.ReactNode
}

/**
 * The files a step left behind.
 *
 * A file is the one thing a step produces that outlives the reading of it, and
 * it is **addressed by digest** — which is why the digest is drawn beside the
 * name rather than hidden behind a tooltip: a file that outlives its run is
 * still reachable, and two runs that produced the same bytes produced one
 * artifact.
 *
 * Rejected records are a file like any other. That is what makes `18 rejected`
 * something a person can open instead of a dead count.
 *
 * **A step that left nothing draws no table.** Absence is the caller's to
 * render — see `AbsenceNote` — because an empty table here would claim the step
 * wrote an empty file.
 */
export const ArtifactTable = React.forwardRef<
  HTMLDivElement,
  ArtifactTableProps
>(({ files, variant = "table", onOpen, onDownload, renderActions, className, ...props }, ref) =>
  variant === "list" ? (
    <div ref={ref} className={cn("flex flex-col text-sm", className)} {...props}>
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center gap-2.5 border-b border-border/60 py-1 last:border-b-0"
        >
          {file.icon != null ? (
            <span className="flex w-4 shrink-0 justify-center text-muted-foreground">{file.icon}</span>
          ) : null}
          <span className={cn("min-w-0 flex-1 truncate", file.gone && "text-muted-foreground line-through")}>
            {file.name}
          </span>
          {file.size != null ? (
            <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{file.size}</span>
          ) : null}
          {file.digest != null ? (
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{file.digest}</span>
          ) : null}
          {renderActions ? (
            renderActions(file, index)
          ) : onDownload ? (
            <Button
              type="button"
              variant="link"
              size="xs"
              className="h-auto shrink-0 p-0 text-xs font-normal"
              disabled={file.gone}
              onClick={() => onDownload(file, index)}
            >
              Download
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  ) : (
  <div ref={ref} className={cn("flex flex-col", className)} {...props}>
    <Table density="compact">
      <TableHeader>
        <TableRow>
          <TableHead>file</TableHead>
          <TableHead className="w-[7rem]">kind</TableHead>
          <TableHead className="w-[5rem]">size</TableHead>
          <TableHead className="w-[7rem]">digest</TableHead>
          <TableHead className="w-[5.5rem]">written</TableHead>
          <TableHead className="w-[9.5rem]">
            <span className="sr-only">actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file, index) => (
          <TableRow key={index}>
            <TableCell
              className={cn(
                "font-mono",
                file.gone && "text-muted-foreground line-through",
              )}
            >
              {file.name}
            </TableCell>
            <TableCell>{file.kind}</TableCell>
            <TableCell className="tabular-nums">{file.size}</TableCell>
            <TableCell className="font-mono text-muted-foreground">
              {file.digest}
            </TableCell>
            <TableCell className="font-mono tabular-nums">
              {file.written}
            </TableCell>
            <TableCell>
              {renderActions ? (
                renderActions(file, index)
              ) : (
                <span className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    disabled={file.gone || !onOpen}
                    onClick={() => onOpen?.(file, index)}
                  >
                    Open
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    disabled={file.gone || !onDownload}
                    onClick={() => onDownload?.(file, index)}
                  >
                    Download
                  </Button>
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  ),
)
ArtifactTable.displayName = "ArtifactTable"

export interface ArtifactCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  file: Artifact
  /** The line under the name — `48 KB · kept for 7 days`, `412 rows · missing store code`. */
  note?: React.ReactNode
  /** At the right — a `Download` button, or a tag saying what the file is. */
  aside?: React.ReactNode
}

/** The file type as a short badge — `XLSX` — from the name's extension. */
function extensionOf(name: React.ReactNode) {
  if (typeof name !== "string") return null
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(dot + 1).toUpperCase() : null
}

/**
 * One file, as the whole of what an answer hands over: its type, its name,
 * what it holds and what to do with it. Several files are an `ArtifactTable`.
 */
export const ArtifactCard = React.forwardRef<HTMLDivElement, ArtifactCardProps>(
  ({ file, note, aside, className, ...props }, ref) => {
    const ext = extensionOf(file.name)
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2.5 rounded-[3px] border border-border p-2", className)}
        {...props}
      >
        {ext ? (
          <span
            aria-hidden
            className="flex h-9 w-[30px] shrink-0 items-end justify-center rounded-[2px] border border-border bg-muted pb-[3px] font-mono text-[0.692rem] leading-none text-muted-foreground"
          >
            {ext}
          </span>
        ) : null}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cn("truncate font-semibold", file.gone && "text-muted-foreground line-through")}>
            {file.name}
          </span>
          {note != null ? <span className="text-xs text-muted-foreground">{note}</span> : null}
        </span>
        {aside != null ? <span className="shrink-0">{aside}</span> : null}
      </div>
    )
  },
)
ArtifactCard.displayName = "ArtifactCard"
