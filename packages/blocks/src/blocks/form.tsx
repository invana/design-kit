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
 * reads, `1 Nov 2026`. A checkbox is the generator's boolean drawn as a box.
 */
const FIELD_TYPE: Record<Spec["type"], FieldType> = {
  number: "number",
  text: "text",
  date: "text",
  select: "select",
  textarea: "textarea",
  checkbox: "boolean",
  radio: "radio",
}

const blank = (v: unknown) => v == null || (typeof v === "string" && v.trim() === "")

/**
 * The field's rules: `required` (a checkbox must be ticked) and a number's
 * bounds, each as the message that says which one it broke.
 */
function rules(f: Spec): FieldConfig["rules"] {
  if (!f.required && f.above == null && f.below == null) return undefined
  return {
    validate: (v: unknown) => {
      if (f.required && (f.type === "checkbox" ? v !== true : blank(v))) return "Required"
      const n = Number(v)
      if (f.above != null && !(n > f.above)) return `Must be above ${f.above}`
      if (f.below != null && !(n < f.below)) return `Must be below ${f.below}`
      return true
    },
  }
}

/**
 * A select's or radio's choices. A select sent without them still shows its
 * default, as its one choice.
 */
function optionsOf(f: Spec): FieldConfig["options"] {
  if (f.options) return f.options
  if (f.type === "select" && f.default != null) {
    return [{ value: String(f.default), label: String(f.default) }]
  }
  return undefined
}

const toField = (f: Spec): FieldConfig => ({
  name: f.name,
  type: FIELD_TYPE[f.type],
  control: f.type === "checkbox" ? "checkbox" : undefined,
  label: f.label,
  unit: f.unit,
  aside: f.aside,
  description: f.hint,
  group: f.group,
  options: optionsOf(f),
  rows: f.rows,
  disabled: f.disabled,
  rules: rules(f),
  placeholder: f.placeholder ?? "",
  // A long answer takes the row; so does a list of described choices.
  colSpan: f.type === "textarea" || (f.type === "radio" && f.options?.some((o) => o.description)) ? 2 : undefined,
})

/** A field's value before the analyst touches it: a checkbox is off unless it says. */
const initial = (f: Spec) => (f.type === "checkbox" ? (f.default ?? false) : f.default)

/** A value with its unit, as the summary reads it — `30%`, `17 d`. */
function withUnit(value: unknown, unit?: string): string {
  if (value == null || value === "") return "—"
  if (!unit) return String(value)
  return /^[A-Za-z]/.test(unit) ? `${value} ${unit}` : `${value}${unit}`
}

/** A field's answer as the summary reads it: a checkbox `Yes`/`No`, a choice its label. */
function answerOf(f: Spec, value: unknown): string {
  if (f.type === "checkbox") return value === true ? "Yes" : "No"
  const picked = f.options?.find((o) => o.value === value)
  return picked ? picked.label : withUnit(value, f.unit)
}

/**
 * Several related values answered together, where they only make sense as a
 * set — scenario inputs. The fields render through the form generator: with
 * `labels: "side"` in a column on the left, with `"top"` over each field, two
 * to a row where the card is wide enough; a field's `group` sets it under a
 * small caps name. A `textarea` and a list of described `radio` choices take
 * the row; a `checkbox` sits beside its label. A number out of its
 * `above`/`below` bounds, or a `required` field left empty, says so under
 * itself and holds the submit back. The submit sends a `reply` keyed by field
 * name.
 *
 * Answered, it settles into its values as label/value pairs; Change inputs
 * reopens the form with them filled in, and sending again is a `change`.
 */
export function FormAsk({ spec, state = "pending", value: given, onAction }: BlockProps<"form">) {
  // The <form>'s element id: unique on the page, whatever the turn ids are.
  const auto = React.useId()
  const pending = state === "pending"
  const [editing, setEditing] = React.useState(false)
  const current = (given ?? {}) as Values
  const top = spec.labels === "top"

  const defaults = Object.fromEntries(
    spec.fields.map((f) => [f.name, pending ? initial(f) : current[f.name]]),
  )
  // Untyped past the root: ObjectField takes any form's control.
  const form = useForm<FieldValues>({ defaultValues: { values: defaults }, mode: "onChange" })

  if (!pending && !editing) {
    return (
      <AskSummary
        rows={spec.fields.map((f) => ({ label: f.label, value: answerOf(f, current[f.name]) }))}
        change={state === "answered" ? "Change inputs" : undefined}
        onChange={() => setEditing(true)}
      />
    )
  }

  // The <form> holds only the fields, so the question, hint and actions stay
  // in the card's own rhythm; the submit reaches it through `form`.
  return (
    <Form {...form}>
      <AskQuestion text={spec} />
      <form
        id={`${auto}-form`}
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
          form={`${auto}-form`}
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
