import { Avatar, AvatarFallback, Badge, Eyebrow, PropertyList, PropertyRow } from "@invana/ui"

import type { BlockRendererProps } from "../../conversations/registry"
import type { RecordRow } from "../../protocol/types"
import { BADGE_TONE } from "./tone"

function Rows({ rows }: { rows: RecordRow[] }) {
  return (
    <PropertyList labelWidth="auto" variant="summary">
      {rows.map((row) => (
        <PropertyRow key={row.label} label={row.label} mono>
          {row.value}
          {row.source ? <span className="text-xs text-muted-foreground"> · {row.source}</span> : null}
        </PropertyRow>
      ))}
    </PropertyList>
  )
}

/**
 * One entity, or the assumptions behind an answer, as label/value pairs — with
 * who it is and its state above them, rows under headings, and where each
 * value came from when that is the point.
 */
export function RecordBlock({ block }: BlockRendererProps<"record">) {
  const { header } = block
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      {header ? (
        <div className="flex items-center gap-2">
          {header.initials ? (
            <Avatar className="size-7 border border-border">
              <AvatarFallback className="text-xs font-semibold text-muted-foreground">
                {header.initials}
              </AvatarFallback>
            </Avatar>
          ) : null}
          <span className="min-w-0 truncate font-semibold">{header.title}</span>
          {header.status ? (
            <Badge
              variant="soft"
              size="xs"
              tone={BADGE_TONE[header.status.tone ?? "neutral"]}
              className="ms-auto font-normal"
            >
              {header.status.label}
            </Badge>
          ) : null}
        </div>
      ) : null}
      {block.rows?.length ? <Rows rows={block.rows} /> : null}
      {block.groups?.map((group, i) => (
        <div key={group.label} className={i > 0 || block.rows?.length ? "mt-1 flex flex-col gap-1" : "flex flex-col gap-1"}>
          <Eyebrow>{group.label}</Eyebrow>
          <Rows rows={group.rows} />
        </div>
      ))}
    </div>
  )
}
