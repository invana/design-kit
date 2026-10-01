import { ArtifactCard, ArtifactTable, Badge, Button } from "@invana/ui"

import type { BlockProps, FileItem } from "../types"
import { BADGE_TONE } from "../format"

/** A page with its corner folded — a file, whatever its type. */
function FileGlyph() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M4 1.5h5.5L13 5v9.5H4z" />
      <path d="M9.5 1.5V5H13" />
    </svg>
  )
}

const noteOf = (file: FileItem) => file.note ?? file.size

/**
 * The files an answer hands over. Several are a list, each addressed by its
 * digest or offered for download; one file is a card that says what it holds,
 * with its download or its state at the right.
 */
export function FilesBlock({ spec, onAction }: BlockProps<"files">) {
  const download = (file: FileItem) =>
    onAction?.(`download:${file.digest ?? file.name}`)

  if (spec.files.length === 1) {
    const file = spec.files[0]!
    return (
      <ArtifactCard
        file={{ name: file.name, size: file.size, digest: file.digest }}
        note={noteOf(file)}
        aside={
          file.status ? (
            <Badge variant="soft" size="xs" tone={BADGE_TONE[file.status.tone ?? "neutral"]} className="font-normal">
              {file.status.label}
            </Badge>
          ) : spec.download ? (
            <Button type="button" variant="outline" size="xs" onClick={() => download(file)}>
              Download
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <ArtifactTable
      variant="list"
      files={spec.files.map((file) => ({
        name: file.name,
        size: file.size,
        digest: spec.download ? undefined : file.digest,
        icon: spec.download ? <FileGlyph /> : undefined,
      }))}
      onDownload={spec.download ? (_, i) => download(spec.files[i]!) : undefined}
    />
  )
}
