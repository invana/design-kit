import * as React from "react"
import { EditorView, lineNumbers } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import {
  StreamLanguage,
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language"
import { python } from "@codemirror/legacy-modes/mode/python"
import { shell } from "@codemirror/legacy-modes/mode/shell"
import { javascript } from "@codemirror/legacy-modes/mode/javascript"
import { cypher } from "@codemirror/legacy-modes/mode/cypher"
import { cn } from "@invana/ui"

import { useCodeMirror } from "./use-code-mirror"

export type CodeLanguage = "python" | "shell" | "javascript" | "cypher" | "plain"

export interface CodeBlockProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string
  language?: CodeLanguage
  /** Line numbers are off by default — a five-line snippet does not need a gutter. */
  showLineNumbers?: boolean
}

const MODES = {
  python: () => StreamLanguage.define(python),
  shell: () => StreamLanguage.define(shell),
  javascript: () => StreamLanguage.define(javascript),
  cypher: () => StreamLanguage.define(cypher),
  plain: () => null,
}

/**
 * Code, shown as it is — read-only.
 *
 * The DAG in a hand-off, a query in a diagnosis, an exported model. It is not a
 * disabled editor: `EditorState.readOnly` plus a non-editable view means there
 * is no cursor to place and no illusion that typing would do something.
 */
export function CodeBlock({
  value,
  language = "plain",
  showLineNumbers,
  className,
  ...props
}: CodeBlockProps) {
  const extensions = React.useMemo(() => {
    const mode = MODES[language]()
    return [
      // StreamLanguage only produces tokens; without a highlight style nothing
      // paints them and the block renders as flat text.
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      EditorView.editable.of(false),
      EditorState.readOnly.of(true),
      EditorView.lineWrapping,
      ...(showLineNumbers ? [lineNumbers()] : []),
      ...(mode ? [mode] : []),
    ]
  }, [language, showLineNumbers])

  const { ref } = useCodeMirror({ value, extensions })

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden border border-border bg-muted/40 [&_.cm-editor]:bg-transparent",
        "[&_.cm-content]:font-mono [&_.cm-content]:text-meta [&_.cm-focused]:outline-none",
        "[&_.cm-gutters]:border-none [&_.cm-gutters]:bg-transparent [&_.cm-gutters]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}
