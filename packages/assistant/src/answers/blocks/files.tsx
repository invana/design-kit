import { ArtifactTable } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"

/** The files an answer hands over, each addressed by its digest. */
export function FilesBlock({ block }: BlockRendererProps<"files">) {
  return <ArtifactTable variant="list" files={block.files} />
}
