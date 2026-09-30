import {
  MetricGrid,
  MetricTile,
  ProposalCard,
  PropertyList,
  PropertyRow,
} from "@invana/ui"

import { EmissionBody, EmissionCard } from ".."
import type { BlockRendererProps } from "../../conversations/registry"
import { ActionRow } from "./actions"

/**
 * Something the answer proposes to write, as its own card under the answer:
 * what it proposes, the draft or what writing it does as figures, what writing
 * it would do in words, and the actions. An action is an `action` event;
 * nothing is written until the API acts on it. Once written, a stamp says so
 * and the header says when.
 */
export function ProposalBlock({ turn, block, onEvent }: BlockRendererProps<"proposal">) {
  return (
    <EmissionCard kind="proposal" title={block.title} citation={block.done?.at}>
      <EmissionBody>
        <ProposalCard
          flush
          seamless
          title={block.heading}
          done={block.done?.label}
          consequence={block.consequence}
          actions={
            block.actions.length ? (
              <ActionRow
                actions={block.actions}
                onAction={(action) => onEvent({ type: "action", turn: turn.id, action })}
              />
            ) : undefined
          }
        >
          {block.rows?.length ? (
            <PropertyList labelWidth="auto" variant="summary">
              {block.rows.map((row) => (
                <PropertyRow key={row.label} label={row.label} mono>
                  {row.value}
                </PropertyRow>
              ))}
            </PropertyList>
          ) : null}
          {block.figures?.length ? (
            <MetricGrid joined seamless minTileWidth={72}>
              {block.figures.map((f) => (
                <MetricTile key={f.label} variant="figure" label={f.label} value={f.value} />
              ))}
            </MetricGrid>
          ) : null}
        </ProposalCard>
      </EmissionBody>
    </EmissionCard>
  )
}
