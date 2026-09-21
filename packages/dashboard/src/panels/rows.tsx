import * as React from "react"
import {
  Alert,
  AlertDescription,
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  StatusDot,
  Terminal,
  TerminalLine,
  cn,
} from "@invana/ui"
import { ParamRow } from "@invana/forms"

import { SpecActions, SpecChip } from "../chips"
import type {
  ListOptions,
  LogOptions,
  PanelRendererProps,
  ParamsOptions,
  TextOptions,
} from "../types"

export function LogPanel({ options }: PanelRendererProps<LogOptions>) {
  const columns = options.columnTemplate ?? "48px 44px 132px minmax(0,1fr)"
  return (
    <Terminal columnTemplate={columns}>
      {options.lines.map((line, i) => (
        <TerminalLine
          key={i}
          level={line.level}
          columns={[
            line.time ?? "",
            line.level ? line.level.toUpperCase() : "",
            line.source ?? "",
            line.message,
          ]}
        />
      ))}
    </Terminal>
  )
}

/**
 * Rows that are not a table: artifacts, the runs of a plan, a version history.
 *
 * A table is for values you compare down a column. These are records you scan
 * and open, which is what `Item` is for — so a list panel is never a
 * one-column table.
 */
export function ListPanel({ panel, options, onAction, icons }: PanelRendererProps<ListOptions>) {
  return (
    <div className="flex flex-col">
      {options.items.map((item, i) => {
        const Icon = item.icon ? icons[item.icon] : undefined
        const clickable = Boolean(item.action)
        return (
          <Item
            key={item.id ?? i}
            size="xs"
            // `flex-nowrap` because `Item` wraps by default, and in a 340px
            // panel a long `meta` drops to a second line — so a list of files
            // renders at two different row heights depending on its captions.
            className={cn(
              "flex-nowrap gap-2 border-b border-border/55 last:border-b-0",
              clickable && "cursor-pointer",
            )}
            onClick={
              clickable
                ? () => onAction(item.action as string, { panelId: panel.id, itemId: item.id })
                : undefined
            }
          >
            {item.tone || Icon ? (
              <ItemMedia>
                {item.tone ? <StatusDot tone={item.tone} size="md" /> : null}
                {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : null}
              </ItemMedia>
            ) : null}
            <ItemContent className="min-w-0">
              {/* `ItemTitle` ships `flex w-fit`, so it keeps its content width
                  and paints over whatever follows once the row is too narrow —
                  and being a flex box, `truncate` on it clips without
                  ellipsising. The text does the truncating; the title only has
                  to be allowed to shrink. */}
              <ItemTitle className={cn("w-auto min-w-0", item.mono && "font-mono")}>
                <span className="min-w-0 truncate">{item.title}</span>
              </ItemTitle>
            </ItemContent>
            {/* The caption is capped in `ch`, which is the only definite unit
                available here. A percentage resolves against a parent sized by
                its own content (circular, silently ignored); equal `flex-1`
                bases truncate a short caption that would have fitted; and a
                shrink weight does nothing, because `flex-1` on the title gives
                it basis 0 so it never joins the shrink distribution at all. A
                caption longer than ~16 characters is a caption, not a fact
                worth the row. */}
            {item.meta || item.chip ? (
              <ItemActions className="min-w-0 shrink justify-end">
                {item.meta ? (
                  <span className="max-w-[16ch] truncate font-mono text-sm text-muted-foreground">
                    {item.meta}
                  </span>
                ) : null}
                {item.chip ? (
                  <span className="shrink-0">
                    <SpecChip chip={item.chip} />
                  </span>
                ) : null}
              </ItemActions>
            ) : null}
          </Item>
        )
      })}
    </div>
  )
}

export function ParamsPanel({ panel, options, onAction }: PanelRendererProps<ParamsOptions>) {
  const emit = options.changeAction
  return (
    <div className="flex flex-col">
      {options.params.map((param) => (
        <ParamRow
          key={param.name}
          name={param.name}
          type={param.type}
          source={param.source}
          value={param.value}
          note={param.note}
          invalid={param.invalid}
          disabled={param.disabled}
          onSourceChange={
            emit
              ? (source) =>
                  onAction(emit, {
                    panelId: panel.id,
                    param: { name: param.name, source, value: param.value },
                  })
              : undefined
          }
          onValueChange={
            emit
              ? (value) =>
                  onAction(emit, {
                    panelId: panel.id,
                    param: { name: param.name, source: param.source, value },
                  })
              : undefined
          }
        />
      ))}
    </div>
  )
}

const TEXT_TONE: Record<string, string> = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
  info: "text-info",
}

export function TextPanel({ panel, options, onAction, icons }: PanelRendererProps<TextOptions>) {
  const body = (
    <p className={cn("text-sm", TEXT_TONE[options.tone ?? "muted"])}>{options.text}</p>
  )

  const content = options.callout ? (
    <Alert variant={options.tone === "error" ? "destructive" : "default"}>
      <AlertDescription>{body}</AlertDescription>
    </Alert>
  ) : (
    body
  )

  if (!options.actions?.length) return content

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">{content}</div>
      <div className="flex shrink-0 items-center gap-1.5">
        <SpecActions
          actions={options.actions}
          onAction={onAction}
          icons={icons}
          ctx={{ panelId: panel.id }}
        />
      </div>
    </div>
  )
}
