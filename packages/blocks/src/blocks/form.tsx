import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@invana/ui"
import {
  Form,
  ObjectField,
  type FieldConfig,
  type FieldType,
  type FieldValues,
} from "@invana/forms"

import { ClarifyActions } from "@invana/ui"
import type { BlockProps, FormOptions } from "../types"
import { AskHint, AskQuestion, AskSummary } from "../parts/ask"

type Spec = FormOptions["fields"][number]
type Values = Record<string, unknown>

/**
 * The grammar's field types, as the form generator's. A date is typed text
 * until the kit has a date field: its default is already the label the analyst
 * reads, `1 Nov 2026`.
 */
const FIELD_TYPE: Record<Spec["type"], FieldType> = {
  number: "number",
  text: "text",
  date: "text",
  select: "select",
}

/** A number's bounds, as the rule that says which one it broke. */
function boundsRule(f: Spec): FieldConfig["rules"] {
  if (f.above == null && f.below == null) return undefined
  return {
    validate: (v: unknown) => {
      const n = Number(v)
      if (f.above != null && !(n > f.above)) return `Must be above ${f.above}`
      if (f.below != null && !(n < f.below)) return `Must be below ${f.below}`
      return true
    },
  }
}

const toField = (f: Spec): FieldConfig => ({
  name: f.name,
  type: FIELD_TYPE[f.type],
  label: f.label,
  unit: f.unit,
  aside: f.aside,
  description: f.hint,
  group: f.group,
  rules: boundsRule(f),
  placeholder: "",
})

/** A value with its unit, as the summary reads it — `30%`, `17 d`. */
function withUnit(value: unknown, unit?: string): string {
  if (value == null || value === "") return "—"
  if (!unit) return String(value)
  return /^[A-Za-z]/.test(unit) ? `${value} ${unit}` : `${value}${unit}`
}

/**
 * Several related values answered together, where they only make sense as a
 * set — scenario inputs. The fields render through the form generator: with
 * `labels: "side"` in a column on the left, with `"top"` over each field, two
 * to a row where the card is wide enough; a field's `group` sets it under a
 * small caps name. A number out of its `above`/`below` bounds says so under
 * itself and holds the submit back. The submit sends a `reply` keyed by field
 * name.
 *
 * Answered, it settles into its values as label/value pairs; Change inputs
 * reopens the form with them filled in, and sending again is a `change`.
 */
export function FormAsk({ spec, state = "pending", value: given, id: idProp, onAction }: BlockProps<"form">) {
  const auto = React.useId()
  const id = idProp ?? auto
  const pending = state === "pending"
  const [editing, setEditing] = React.useState(false)
  const current = (given ?? {}) as Values
  const top = spec.labels === "top"

  const defaults = Object.fromEntries(
    spec.fields.map((f) => [f.name, pending ? f.default : current[f.name]]),
  )
  // Untyped past the root: ObjectField takes any form's control.
  const form = useForm<FieldValues>({ defaultValues: { values: defaults }, mode: "onChange" })

  if (!pending && !editing) {
    return (
      <AskSummary
        rows={spec.fields.map((f) => ({ label: f.label, value: withUnit(current[f.name], f.unit) }))}
        change={state === "answered" ? "Change inputs" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  // The <form> holds only the fields, so the question, hint and actions stay
  // in the card's own rhythm; the submit reaches it through `form={id}`.
  return (
    <Form {...form}>
      <AskQuestion text={spec} />
      <form
        id={id}
        onSubmit={form.handleSubmit(({ values }) => {
          onAction?.(editing ? "change" : "reply", values)
          setEditing(false)
        })}
      >
        <ObjectField
          control={form.control}
          name="values"
          fields={spec.fields.map(toField)}
          labelPosition={top ? "top" : "side"}
          size="xs"
          columns={top ? 2 : 1}
          fit="container"
          groupAs="section"
        />
      </form>
      <AskHint>{spec.hint}</AskHint>
      <ClarifyActions>
        <Button
          type="submit"
          form={id}
          size="xs"
          className={top ? "ms-auto" : undefined}
          disabled={!form.formState.isValid}
        >
          {spec.submit ?? "Submit"}
        </Button>
      </ClarifyActions>
    </Form>
  )
}
