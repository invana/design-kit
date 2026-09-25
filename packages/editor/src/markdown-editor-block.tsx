import * as React from "react"
import { EditorView } from "@codemirror/view"
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands"
import { keymap, placeholder as cmPlaceholder } from "@codemirror/view"
import { cn } from "@invana/ui"

import { useCodeMirror } from "./use-code-mirror"

export interface MarkdownEditorBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  /** A version marker shown in the corner — `v5`, `v7 · editing`. */
  version?: React.ReactNode
  /**
   * Drawn in the empty editor, never stored — what the reader gets when
   * nothing is written, such as an agent's default voice.
   */
  placeholder?: string
}

/**
 * The prose a person writes for an agent to read — graph rules, a skill's
 * content, an acceptance note.
 *
 * Plain markdown in a monospace field, not a rich-text editor. What is typed
 * here is offered verbatim in a model's prompt, so what you see has to be
 * exactly what the agent gets; a WYSIWYG layer would put a translation step
 * between the author and the thing that runs.
 *
 * `version` sits in the corner because these documents are versioned and a
 * running thinking finishes on the version it started with — editing without
 * seeing which version you are on is how two people overwrite each other.
 */
export function MarkdownEditorBlock({
  value,
  onChange,
  readOnly,
  version,
  placeholder,
  className,
  ...props
}: MarkdownEditorBlockProps) {
  const extensions = React.useMemo(
    () => [
      // No markdown syntax mode, deliberately. What is typed here is offered
      // verbatim in a model's prompt, and highlighting it would be decoration
      // on text whose whole contract is that it is plain. It also keeps this
      // package's dependencies to the CodeMirror set the product already ships.
      EditorView.lineWrapping,
      history(),
      keymap.of([...defaultKeymap, ...historyKeymap]),
      EditorView.editable.of(!readOnly),
      ...(placeholder ? [cmPlaceholder(placeholder)] : []),
    ],
    [readOnly, placeholder],
  )

  const { ref } = useCodeMirror({ value, extensions, onChange })

  return (
    <div className={cn("relative border border-border bg-muted/40", className)} {...props}>
      {version != null ? (
        <span className="absolute right-1 top-1 z-10 border border-border bg-card px-1 text-sm text-muted-foreground">
          {version}
        </span>
      ) : null}
      <div
        ref={ref}
        className={cn(
          "[&_.cm-editor]:bg-transparent [&_.cm-content]:font-mono [&_.cm-content]:text-sm",
          "[&_.cm-focused]:outline-none [&_.cm-cursor]:border-foreground",
          "[&_.cm-placeholder]:text-muted-foreground",
          // Room for the version marker, so it never sits over the first line.
          // On the host, not `.cm-content`: CodeMirror's own theme sets that
          // padding and wins.
          version != null && "pr-12",
        )}
      />
    </div>
  )
}
