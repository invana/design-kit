import { applyBlockPatch, type BlockPatch, BlockPatchError } from "@invana/blocks"

import type { BoardSpec, ExtraPanels, PanelBase } from "./types"

/**
 * How a board changes while it streams. A panel's options stream by the
 * block's own {@link BlockPatch} — the patch a conversation streams the same
 * block by — so a gantt panel and a gantt answer take one stream.
 */
export type BoardPatch =
  /** Stream a panel's options — its block's spec — by a block patch. `panel` is its `id`. */
  | { op: "patch-panel"; panel: string; patch: BlockPatch }
  /**
   * The panel's own fields — its `aside` as the run moves, its `state` once
   * answered; `null` removes one. Never its `id`, `kind` or `options`.
   */
  | {
      op: "update-panel"
      panel: string
      fields: { [F in keyof Omit<PanelBase, "id" | "render">]?: PanelBase[F] | null }
    }

export type BoardPatchOp = BoardPatch["op"]

export class BoardPatchError extends Error {}

/** Inside the walk every spec is the widest one — the types guard authors, not the walk. */
type Panel = PanelBase & { kind: string; options?: unknown }
type Row = { panels: Panel[] }
type Loose = { rows: Row[]; tabs?: { rows: Row[] }[] }

/** `rows` with the panel `id` replaced by `fn(panel)`; `hit` says whether it was there. */
function onRows(rows: Row[], id: string, fn: (panel: Panel) => Panel, hit: { found: boolean }): Row[] {
  return rows.map((row) => {
    if (!row.panels.some((p) => p.id === id)) return row
    hit.found = true
    return { ...row, panels: row.panels.map((p) => (p.id === id ? fn(p) : p)) }
  })
}

function patchPanel(panel: Panel, patch: BoardPatch): Panel {
  if (patch.op === "update-panel") {
    // The block patch's own merge, so a field sent as `null` is removed here too.
    const { id, kind, options } = panel
    return { ...applyBlockPatch(panel, { op: "set", fields: patch.fields }), id, kind, options }
  }
  try {
    return { ...panel, options: applyBlockPatch((panel.options ?? {}) as object, patch.patch) }
  } catch (error) {
    if (error instanceof BlockPatchError) throw new BoardPatchError(`"patch-panel" on "${patch.panel}": ${error.message}`)
    throw error
  }
}

/** A board's spec after one patch: the panel it names, wherever it sits — a row, or a tab's row. */
export function applyBoardPatch<X extends ExtraPanels>(spec: BoardSpec<X>, patch: BoardPatch): BoardSpec<X> {
  const loose = spec as unknown as Loose
  const hit = { found: false }
  const fn = (panel: Panel) => patchPanel(panel, patch)
  const next: Loose = {
    ...loose,
    rows: onRows(loose.rows, patch.panel, fn, hit),
    ...(loose.tabs ? { tabs: loose.tabs.map((tab) => ({ ...tab, rows: onRows(tab.rows, patch.panel, fn, hit) })) } : {}),
  }
  if (!hit.found) throw new BoardPatchError(`"${patch.op}": no panel "${patch.panel}" on the board.`)
  return next as unknown as BoardSpec<X>
}

/** Apply patches in order — a recorded stream, replayed. */
export function applyBoardPatches<X extends ExtraPanels>(spec: BoardSpec<X>, patches: BoardPatch[]): BoardSpec<X> {
  return patches.reduce<BoardSpec<X>>(applyBoardPatch, spec)
}
