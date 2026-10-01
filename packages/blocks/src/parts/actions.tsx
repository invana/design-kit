import * as React from "react"
import { Button, type ButtonProps } from "@invana/ui"

import { ClarifyActions } from "@invana/ui"
import type { ActionOption } from "../types"

const VARIANT: Record<NonNullable<ActionOption["variant"]>, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
  link: "link",
}

/**
 * The actions under a block, in the order given; the first with `push` starts
 * the group at the far end. Each is sent as an `action` event.
 */
export function ActionRow({
  actions,
  onAction,
}: {
  actions: ActionOption[]
  onAction: (id: string) => void
}) {
  return (
    <ClarifyActions className="w-full">
      {actions.map((a) => (
        <React.Fragment key={a.id}>
          {a.push ? <span aria-hidden className="flex-1" /> : null}
          <Button
            size="xs"
            variant={VARIANT[a.variant ?? "secondary"]}
            onClick={() => onAction(a.id)}
          >
            {a.label}
          </Button>
        </React.Fragment>
      ))}
    </ClarifyActions>
  )
}
