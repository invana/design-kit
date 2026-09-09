import * as React from "react"
import { Compartment, EditorState, type Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

export interface UseCodeMirrorOptions {
  value: string
  extensions: Extension[]
  onChange?: (value: string) => void
}

/**
 * Mounts a CodeMirror view into a ref'd element and keeps it in sync.
 *
 * The whole reason this is a hook rather than a component: CodeMirror owns its
 * own DOM, so React must not re-render into it. Value changes are pushed as
 * transactions, and only when they actually differ — writing the view's own
 * output back into it would move the cursor to the end on every keystroke.
 */
export function useCodeMirror({
  value,
  extensions,
  onChange,
}: UseCodeMirrorOptions) {
  const host = React.useRef<HTMLDivElement | null>(null)
  const view = React.useRef<EditorView | null>(null)

  // Keep the latest onChange without tearing down the view when it changes
  // identity — a caller passing an inline arrow would otherwise remount the
  // editor on every render.
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // The view is created once and reconfigured in place. Keying the effect on
  // `extensions` identity looked simpler, but a caller passing an inline array
  // would then rebuild the editor on every render — losing the cursor, the
  // selection and focus mid-keystroke. "Callers are expected to memoise" is a
  // trap, not a contract, so the hook does not depend on it.
  const extensionsRef = React.useRef(extensions)
  extensionsRef.current = extensions

  const compartment = React.useRef(new Compartment())

  React.useEffect(() => {
    if (!host.current) return
    const v = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          compartment.current.of(extensionsRef.current),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current?.(u.state.doc.toString())
          }),
        ],
      }),
      parent: host.current,
    })
    view.current = v
    return () => {
      v.destroy()
      view.current = null
    }
    // Mount once. Configuration changes go through the compartment below.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Swap configuration without touching the document — this is what a
  // Compartment is for, and it is why toggling `readOnly` or a language keeps
  // the caret where it was.
  React.useEffect(() => {
    const v = view.current
    if (!v) return
    v.dispatch({ effects: compartment.current.reconfigure(extensions) })
  }, [extensions])

  React.useEffect(() => {
    const v = view.current
    if (!v) return
    const current = v.state.doc.toString()
    if (current === value) return
    v.dispatch({ changes: { from: 0, to: current.length, insert: value } })
  }, [value])

  return { ref: host, view }
}
