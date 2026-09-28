import type * as React from "react"
import { cn } from "@invana/ui"

import { STAGES } from "../grammar"
import type { AskState } from "../protocol/types"

export interface AskFrameProps {
  state: AskState
  stage: string
  children?: React.ReactNode
  className?: string
}

const STAGE_NAME = new Map<string, string>(STAGES.map((s) => [s.id, s.name]))

/**
 * The card an ask renders in, with ClarifyCard's header strip: what it is,
 * the stage that asked, and whether it is still waiting.
 *
 * Internal until the ClarifyCard states land (Assistant Package RFC, asks):
 * then ClarifyCard takes any control as its body and this frame goes.
 */
export function AskFrame({ state, stage, children, className }: AskFrameProps) {
  return (
    <div
      data-state={state}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden border border-border bg-card",
        (state === "superseded" || state === "expired") && "opacity-75",
        className,
      )}
    >
      <div className="flex h-6 shrink-0 items-center gap-2 border-b border-border bg-muted/40 px-2 text-sm">
        <span className="shrink-0 font-medium">{state === "pending" ? "question" : state}</span>
        <span className="truncate text-muted-foreground">
          {(STAGE_NAME.get(stage) ?? stage).toLowerCase()}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-2">{children}</div>
    </div>
  )
}
