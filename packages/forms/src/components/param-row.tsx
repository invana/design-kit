import * as React from "react"

import { cn } from "@invana/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Input } from "./input"

/**
 * Where a parameter's value comes from.
 *
 * The three are not styles of the same thing — they decide *when* the value is
 * known. A literal is known now; an argument is known when a run is started; a
 * binding is known only once an earlier task has produced it.
 */
export type ParamSource = "literal" | "argument" | "binding"

export const PARAM_SOURCES: ParamSource[] = ["literal", "argument", "binding"]

export interface ParamRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The parameter's name, as the contract spells it — `batch_size`, `map_over`. */
  name: string
  /** Its type and obligation, from the contract — `str · required`, `int · optional`. */
  type?: React.ReactNode
  /** Which of the three the current value is. */
  source: ParamSource
  onSourceChange?: (source: ParamSource) => void
  /** The value itself — a literal, `${args.model}`, `${steps.x.rows}`. */
  value: string
  onValueChange?: (value: string) => void
  /**
   * What the reader needs to know that the value does not say — what a binding
   * will resolve to, which alternatives an enum allows, why a default was left
   * alone. Rendered as the error when `invalid` is set.
   */
  note?: React.ReactNode
  /** The value does not resolve, or the contract refuses it. Reddens the control and the note. */
  invalid?: boolean
  /**
   * The parameter is not in play — a `when` on a task that always runs. Shown
   * rather than hidden, because a contract's full surface is the point of the
   * form.
   */
  disabled?: boolean
  /** Replaces the value control entirely, for a parameter that needs its own editor. */
  children?: React.ReactNode
}

/**
 * One parameter of a task, as a row: what it is called, where its value comes
 * from, what the value is, and what that means.
 *
 * The form these rows make **is** the catalogue contract — the fields, their
 * types and their obligations are read off the entry, never authored here. So a
 * row takes a descriptor rather than children, and a parameter the contract
 * does not declare has no way to appear.
 *
 * `source` and `value` are one control, joined, because they are one decision.
 * Split into two fields they read as two questions, and a reader can end up
 * with `literal` selected beside a value that is plainly a binding.
 *
 * Not a `Field`. That one lays out a label, a control and a description for a
 * form a person fills in from nothing; this lays out a *contract* — the label
 * column carries a type, and the description usually explains a value the
 * person did not type.
 */
export const ParamRow = React.forwardRef<HTMLDivElement, ParamRowProps>(
  (
    {
      name,
      type,
      source,
      onSourceChange,
      value,
      onValueChange,
      note,
      invalid,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn("flex items-start gap-3 py-1.5", className)}
      {...props}
    >
      <div className="w-[118px] shrink-0 pt-1">
        <div className="truncate font-mono text-meta">{name}</div>
        {type != null ? (
          <div className="truncate text-meta text-muted-foreground">{type}</div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {children ?? (
          <div className="flex min-w-0">
            <Select
              value={source}
              onValueChange={(v) => onSourceChange?.(v as ParamSource)}
              disabled={disabled}
            >
              <SelectTrigger
                triggerSize="sm"
                aria-label={`${name} source`}
                className="w-auto shrink-0 rounded-r-none border-r-0 text-meta text-muted-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PARAM_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              inputSize="sm"
              value={value}
              onChange={(e) => onValueChange?.(e.target.value)}
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-label={name}
              // The colour is a token, set inline because the kit's build emits
              // no `border-<colour>` utility today — `border-destructive`
              // renders grey. Same workaround as `TaskGantt`'s error band.
              style={invalid ? { borderColor: "var(--color-destructive)" } : undefined}
              className="min-w-0 flex-1 rounded-l-none font-mono"
            />
          </div>
        )}
        {note != null ? (
          <div
            className={cn(
              "text-meta",
              invalid ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {note}
          </div>
        ) : null}
      </div>
    </div>
  ),
)
ParamRow.displayName = "ParamRow"
