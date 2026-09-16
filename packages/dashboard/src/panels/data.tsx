import * as React from "react"
import {
  Eyebrow,
  MetricGrid,
  MetricTile,
  PropertyList,
  PropertyRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TaskGantt,
  cn,
} from "@invana/ui"
import { CodeBlock } from "@invana/editor"

import type {
  CodeOptions,
  ExchangeOptions,
  GanttOptions,
  JsonOptions,
  MetricsOptions,
  PanelRendererProps,
  PropertiesOptions,
  TableOptions,
} from "../types"

export function MetricsPanel({ options, gap }: PanelRendererProps<MetricsOptions>) {
  return (
    <MetricGrid minTileWidth={options.minTileWidth ?? 130} gap={gap}>
      {options.tiles.map((tile, i) => (
        <MetricTile
          key={i}
          label={tile.label}
          value={tile.value}
          caption={tile.caption}
          tone={tile.tone}
          meter={tile.meter}
        />
      ))}
    </MetricGrid>
  )
}

export function PropertiesPanel({ options }: PanelRendererProps<PropertiesOptions>) {
  return (
    <PropertyList labelWidth={options.labelWidth ?? 108}>
      {options.rows.map((row, i) => (
        <PropertyRow key={i} label={row.label} mono={row.mono ?? true}>
          {row.value}
        </PropertyRow>
      ))}
    </PropertyList>
  )
}

export function JsonPanel({ options }: PanelRendererProps<JsonOptions>) {
  const value =
    typeof options.value === "string"
      ? options.value
      : JSON.stringify(options.value, null, 2)
  return (
    <CodeBlock language="json" value={value} maxHeight={options.maxHeight} className="border-0" />
  )
}

export function CodePanel({ options }: PanelRendererProps<CodeOptions>) {
  return (
    <CodeBlock
      language={options.language ?? "plain"}
      value={options.value}
      maxHeight={options.maxHeight}
      showLineNumbers={options.showLineNumbers}
      className="border-0"
    />
  )
}

/**
 * A labelled pair of mono blocks — a prompt and what came back.
 *
 * Its own kind rather than two `code` panels, because the two are one record:
 * a completion shown without the prompt that produced it is not evidence.
 */
export function ExchangePanel({ options }: PanelRendererProps<ExchangeOptions>) {
  return (
    <div className="flex flex-col gap-2">
      {options.blocks.map((block, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Eyebrow>{block.label}</Eyebrow>
          <CodeBlock language={block.language ?? "plain"} value={block.value} />
        </div>
      ))}
    </div>
  )
}

export function GanttPanel({ panel, options, onAction }: PanelRendererProps<GanttOptions>) {
  return (
    <TaskGantt
      tasks={options.tasks}
      labelWidth={options.labelWidth}
      density={options.density}
      nowMs={options.nowMs}
      openEnded={options.openEnded}
      selectedKey={options.selectedKey}
      onSelectTask={
        options.selectAction
          ? (taskKey) => onAction(options.selectAction as string, { panelId: panel.id, taskKey })
          : undefined
      }
    />
  )
}

export function TablePanel({ options }: PanelRendererProps<TableOptions>) {
  return (
    <Table density="compact">
      <TableHeader>
        <TableRow>
          {options.columns.map((col) => (
            <TableHead key={col.key} className={cn(col.align === "right" && "text-right")}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {options.rows.map((row, i) => (
          <TableRow key={i}>
            {options.columns.map((col) => (
              <TableCell
                key={col.key}
                className={cn(col.mono !== false && "font-mono", col.align === "right" && "text-right")}
              >
                {row[col.key] ?? "—"}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
