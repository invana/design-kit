import {
  MetricGrid,
  MetricTile,
  ProposalCard,
  PropertyList,
  PropertyRow,
} from "@invana/ui"
import type { BlockProps } from "../types"

import { ActionRow } from "../parts/actions"

/**
 * Something the answer proposes to write: what it proposes, the draft or what
 * writing it does as figures, what writing it would do in words, and the
 * actions, each sent as its id. Nothing is written until the shell acts on one;
 * once written, a stamp says so. The shell gives it its card and its header.
 */
export function ProposalBlock({ spec, onAction }: BlockProps<"proposal">) {
  return (
    <ProposalCard
      flush
      seamless
      title={spec.heading}
      done={spec.done?.label}
      consequence={spec.consequence}
      actions={
        spec.actions.length ? (
          <ActionRow
            actions={spec.actions}
            onAction={(id) => onAction?.("action", id)}
          />
        ) : undefined
      }
    >
      {spec.rows?.length ? (
        <PropertyList labelWidth="auto" variant="summary">
          {spec.rows.map((row) => (
            <PropertyRow key={row.label} label={row.label} mono>
              {row.value}
            </PropertyRow>
          ))}
        </PropertyList>
      ) : null}
      {spec.figures?.length ? (
        <MetricGrid joined seamless minTileWidth={72}>
          {spec.figures.map((f) => (
            <MetricTile key={f.label} variant="figure" label={f.label} value={f.value} />
          ))}
        </MetricGrid>
      ) : null}
    </ProposalCard>
  )
}
