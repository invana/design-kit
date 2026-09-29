import { Button, ProposalCard, PropertyList, PropertyRow, type ButtonProps } from "@invana/ui"

import { EmissionBody, EmissionCard } from ".."
import type { BlockRendererProps } from "../../conversations/registry"
import type { ActionOption } from "../../protocol/types"

const VARIANT: Record<NonNullable<ActionOption["variant"]>, ButtonProps["variant"]> = {
  primary: "default",
  secondary: "outline",
  ghost: "ghost",
}

/**
 * Something the answer proposes to write, as its own card under the answer:
 * the draft, what writing it would do, and the actions. An action is an
 * `action` event; nothing is written until the API acts on it.
 */
export function ProposalBlock({ turn, block, onEvent }: BlockRendererProps<"proposal">) {
  return (
    <EmissionCard kind="proposal" title={block.title}>
      <EmissionBody>
        <ProposalCard
          flush
          consequence={block.consequence}
          actions={block.actions.map((a) => (
            <Button
              key={a.id}
              size="xs"
              variant={VARIANT[a.variant ?? "secondary"]}
              onClick={() => onEvent({ type: "action", turn: turn.id, action: a.id })}
            >
              {a.label}
            </Button>
          ))}
        >
          <PropertyList labelWidth="auto" variant="summary">
            {block.rows.map((row) => (
              <PropertyRow key={row.label} label={row.label} mono>
                {row.value}
              </PropertyRow>
            ))}
          </PropertyList>
        </ProposalCard>
      </EmissionBody>
    </EmissionCard>
  )
}
