import * as React from "react"
import {
  Button,
  Kbd,
  PropertyList,
  PropertyRow,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceTitle,
  type QuestionnaireChoiceProps,
  type QuestionnaireFigureTone,
} from "@invana/ui"

import { ClarifyActions, ClarifyFootnote } from "."
import type { AskText, ChoiceOption, Tone } from "../protocol/types"
import { strong } from "../prose"

/*
 * The parts every ask shares, so the six renderers draw one language: the
 * question (plain or a heading with its description), the hint under a
 * control, a choice's lead and figure, and the summary an answered ask
 * settles into.
 */

/** A question is a heading when it says so, or when a description follows it. */
export const isHeading = (text: AskText) => Boolean(text.heading || text.description)

/** The question, and the muted line under it when there is one. */
export function AskQuestion({ text, aside }: { text: AskText; aside?: React.ReactNode }) {
  const question = <p className={isHeading(text) ? "font-semibold" : undefined}>{strong(text.question)}</p>
  return (
    <>
      {aside ? (
        <div className="flex items-baseline justify-between gap-2">
          {question}
          {aside}
        </div>
      ) : (
        question
      )}
      {text.description ? <p className="-mt-1.5 text-sm text-muted-foreground">{text.description}</p> : null}
    </>
  )
}

/**
 * A hint's markup: `**…**` a figure, in mono at full strength, and `` `…` ``
 * a key. Everything else is the hint's own muted text.
 */
export function hintText(text: string): React.ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <b key={i} className="font-mono font-normal text-foreground">
            {part.slice(2, -2)}
          </b>
        )
      if (part.startsWith("`") && part.endsWith("`")) return <Kbd key={i}>{part.slice(1, -1)}</Kbd>
      return part
    })
}

/** A small action in the ask's own text — `Select all`, `Edit`. */
export function AskLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 whitespace-nowrap font-sans text-xs font-normal text-primary hover:underline focus-visible:underline focus-visible:outline-none"
    >
      {children}
    </button>
  )
}

/** The line under a control. */
export function AskHint({ children, tone }: { children?: string; tone?: "warning" | "error" }) {
  if (!children) return null
  return (
    <ClarifyFootnote className={tone === "warning" ? "text-warning" : tone === "error" ? "text-destructive" : undefined}>
      {hintText(children)}
    </ClarifyFootnote>
  )
}

const FIGURE_TONE: Record<Tone, QuestionnaireFigureTone | undefined> = {
  good: "success",
  bad: "error",
  warn: "warning",
  neutral: undefined,
}

/** A 16×16 stroked icon from its path data. */
function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

/** A choice's props and body, from the grammar's option. */
export function choiceParts(o: ChoiceOption): {
  props: Pick<QuestionnaireChoiceProps, "detail" | "lead" | "figure">
  body: React.ReactNode
} {
  return {
    props: {
      detail: o.figure ? undefined : (o.note ?? o.detail),
      lead: o.icon ? <Icon path={o.icon} /> : o.lead,
      figure: o.figure && { value: o.figure.value, unit: o.figure.unit, tone: o.figure.tone && FIGURE_TONE[o.figure.tone] },
    },
    body: (
      <>
        <QuestionnaireChoiceTitle>{o.label}</QuestionnaireChoiceTitle>
        {o.description ? <QuestionnaireChoiceDescription>{o.description}</QuestionnaireChoiceDescription> : null}
      </>
    ),
  }
}

/** How a picked option reads in a summary: its `summary`, else its label and source. */
export function pickText(o: ChoiceOption | undefined, value: unknown): string {
  if (!o) return value == null || value === "" ? "—" : String(value)
  if (o.summary) return o.summary
  return o.detail ? `${o.label} · ${o.detail}` : o.label
}

/**
 * Several picks as one line. Labels join with commas — `Stores, Online`; a
 * `summary` may hold a comma of its own — `Semi-arid, 3 sites` — so picks
 * that carry one join with a dot — `Rust ≥ 6 · maturity ≤ 115 d`.
 */
export function joinPicks(picked: ChoiceOption[]): string {
  if (!picked.length) return "—"
  const summarised = picked.some((o) => o.summary)
  return picked.map((o) => o.summary ?? o.label).join(summarised ? " · " : ", ")
}

/** The answers an ask settled into, as label/value pairs, and the way back into it. */
export function AskSummary({
  rows,
  change,
  onChange,
  children,
}: {
  rows: { label: string; value: React.ReactNode }[]
  /** The words of the button that reopens the ask — `Change answer`. */
  change?: string
  onChange?: () => void
  /** Anything under the pairs — what the answer led to. */
  children?: React.ReactNode
}) {
  return (
    <>
      <PropertyList labelWidth="auto" variant="summary">
        {rows.map((r) => (
          <PropertyRow key={r.label} label={r.label} mono>
            {r.value}
          </PropertyRow>
        ))}
      </PropertyList>
      {children}
      {change ? (
        <ClarifyActions>
          <Button size="xs" variant="ghost" onClick={onChange}>
            {change}
          </Button>
        </ClarifyActions>
      ) : null}
    </>
  )
}
