import * as React from "react"
import { SegmentedControl } from "@invana/ui"

import type { AskRendererProps } from "../../conversations/registry"
import type { QuickPick } from "../../protocol/types"
import { AskHint, AskQuestion, AskSummary } from "../parts"

type Row = QuickPick & { key: string }

/**
 * Two to five short options in one row — a granularity, a confidence level,
 * an output format — where picking one is the reply. With no `default`
 * nothing is picked, so the reader answers rather than accepts. An option can
 * carry a second line (`±1.4 pp`); `stretch` gives each an equal share of the
 * card. `more` adds rows answered in the same card: the value is then keyed
 * by row, and it is sent once every row has a pick.
 *
 * Answered, each row settles into a label/value pair; Change reopens them.
 */
export function QuickAsk({ turn, options, onEvent }: AskRendererProps<"quick">) {
  const pending = turn.state === "pending"
  const [editing, setEditing] = React.useState(false)
  const keyed = Boolean(options.more?.length)
  const rows: Row[] = [
    { ...options, key: options.label ?? options.question },
    ...(options.more ?? []).map((r) => ({ ...r, key: r.id })),
  ]

  const settled = (): Record<string, string | undefined> => {
    const value = turn.value
    if (keyed) return (value ?? {}) as Record<string, string>
    return { [rows[0]!.key]: (value as string | undefined) ?? options.default }
  }
  const [picked, setPicked] = React.useState<Record<string, string | undefined>>(() =>
    pending ? Object.fromEntries(rows.map((r) => [r.key, r.default])) : settled(),
  )

  if (!pending && !editing) {
    const value = settled()
    return (
      <AskSummary
        rows={rows.map((r) => ({
          label: r.label ?? r.question,
          value: r.options.find((o) => o.value === value[r.key])?.label ?? value[r.key] ?? "—",
        }))}
        change={turn.state === "answered" ? (keyed ? "Change answers" : "Change answer") : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  const pick = (key: string, v: string) => {
    const next = { ...picked, [key]: v }
    setPicked(next)
    if (rows.some((r) => next[r.key] == null)) return
    const value = keyed ? (next as Record<string, string>) : v
    onEvent(editing ? { type: "change", turn: turn.id, value } : { type: "reply", turn: turn.id, value })
    setEditing(false)
  }

  return (
    <>
      {rows.map((r, i) => (
        <React.Fragment key={r.key}>
          {i === 0 ? <AskQuestion text={options} /> : <p className="mt-1">{r.question}</p>}
          <SegmentedControl
            aria-label={r.question}
            variant="solid"
            stretch={options.stretch}
            options={r.options}
            defaultValue={picked[r.key] ?? null}
            onValueChange={(v) => pick(r.key, v)}
          />
          <AskHint>{r.hint}</AskHint>
        </React.Fragment>
      ))}
    </>
  )
}
