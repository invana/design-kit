import * as React from "react"
import { Workbook, type WorkbookPage } from "@invana/ui"

import { Board } from "./board"
import type { ActionContext, BoardPagesProps, ExtraPanels } from "./types"

/**
 * Several boards in one {@link Workbook} — the open boards of a shell's
 * main section. Each page is a {@link Board} drawn from its own spec; every
 * page stays mounted, so switching keeps a board's scroll and tab.
 *
 * Uncontrolled unless the spec names `selectAction`, as a board's own tabs
 * are: then the pick is reported and `active` is the host's to change.
 */
export function BoardPages<X extends ExtraPanels = Record<never, never>>({
  spec,
  onAction,
  registry,
  icons = {},
  className,
}: BoardPagesProps<X>) {
  const first = spec.pages[0]?.id ?? ""
  const [ownActive, setOwnActive] = React.useState(spec.active ?? first)
  const active = spec.selectAction ? (spec.active ?? first) : ownActive
  const emit = React.useCallback(
    (id: string, ctx?: ActionContext) => onAction?.(id, ctx),
    [onAction],
  )

  const pages = React.useMemo<WorkbookPage[]>(
    () =>
      spec.pages.map((page) => ({
        id: page.id,
        title: page.title,
        icon: page.icon ? icons[page.icon] : undefined,
        disabled: page.disabled,
        closable: page.closable,
        content: (
          <Board
            spec={page.board}
            registry={registry}
            icons={icons}
            className="h-full"
            // A board's own actions arrive told apart by the page they came from.
            onAction={(id, ctx) => emit(id, { ...ctx, pageId: page.id })}
          />
        ),
      })),
    [spec.pages, icons, registry, emit],
  )

  return (
    <Workbook
      pages={pages}
      activeId={active}
      tabPosition={spec.tabPosition}
      pagerPosition={spec.pagerPosition}
      onSelect={(id) => {
        setOwnActive(id)
        if (spec.selectAction) emit(spec.selectAction, { pageId: id })
      }}
      onAdd={spec.addAction ? () => emit(spec.addAction!) : undefined}
      addLabel={spec.addLabel}
      onClose={spec.closeAction ? (id) => emit(spec.closeAction!, { pageId: id }) : undefined}
      className={className}
    />
  )
}
