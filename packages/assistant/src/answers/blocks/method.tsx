import * as React from "react"

import { ChatSessionDisclosure } from "../../conversations/thread"
import type { BlockRendererProps } from "../../conversations/registry"

/**
 * The query or formula behind the figure, folded. Closed, the line carries the
 * meta at the right, or the code itself when there is none; open, the code
 * moves into its own block.
 */
export function MethodBlock({ block }: BlockRendererProps<"method">) {
  const [open, setOpen] = React.useState(false)
  return (
    <ChatSessionDisclosure
      variant="inline"
      label={block.label ?? "method"}
      meta={block.meta ?? (open ? undefined : block.code)}
      open={open}
      onOpenChange={setOpen}
    >
      {block.code}
    </ChatSessionDisclosure>
  )
}
