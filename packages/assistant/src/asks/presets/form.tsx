import * as React from "react"
import { useForm } from "react-hook-form"
import { Button, PropertyList, PropertyRow } from "@invana/ui"
import {
  Form,
  ObjectField,
  type FieldConfig,
  type FieldType,
  type FieldValues,
} from "@invana/forms"

import { ClarifyActions, ClarifyFootnote } from ".."
import type { AskRendererProps } from "../../conversations/registry"
import type { FormOptions } from "../../protocol/types"

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

const toField = (f: Spec): FieldConfig => ({
  name: f.name,
  type: FIELD_TYPE[f.type],
  label: f.label,
  unit: f.unit,
  aside: f.aside,
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
 * set — scenario inputs. The fields come from the ask and render through the
 * form generator, labels in a column on the left, each unit or note at the end
 * of its input; the submit sends a `reply` keyed by field name.
 *
 * Answered, it settles into its values as label/value pairs; "Change answers"
 * reopens the form with them filled in, and sending again is a `change`.
 */
export function FormAsk({ turn, options, onEvent }: AskRendererProps<"form">) {
  const answered = turn.state === "answered"
  const [editing, setEditing] = React.useState(false)
  const id = React.useId()
  const current = (turn.value ?? {}) as Values

  const defaults = Object.fromEntries(
    options.fields.map((f) => [f.name, answered ? current[f.name] : f.default]),
  )
  // Untyped past the root: ObjectField takes any form's control.
  const form = useForm<FieldValues>({ defaultValues: { values: defaults } })

  if (turn.state !== "pending" && !editing) {
    return (
      <>
        <p>{options.question}</p>
        <PropertyList labelWidth="auto">
          {options.fields.map((f) => (
            <PropertyRow key={f.name} label={f.label} mono>
              {withUnit(current[f.name], f.unit)}
            </PropertyRow>
          ))}
        </PropertyList>
        {answered ? (
          <ClarifyActions>
            <Button size="xs" variant="ghost" onClick={() => setEditing(true)}>
              Change answers
            </Button>
          </ClarifyActions>
        ) : null}
      </>
    )
  }

  // The <form> holds only the fields, so the question, hint and actions stay
  // in the card's own rhythm; the submit reaches it through `form={id}`.
  return (
    <Form {...form}>
      <p>{options.question}</p>
      <form
        id={id}
        onSubmit={form.handleSubmit(({ values }) => {
          onEvent(
            answered
              ? { type: "change", turn: turn.id, value: values }
              : { type: "reply", turn: turn.id, value: values },
          )
          setEditing(false)
        })}
      >
        <ObjectField
          control={form.control}
          name="values"
          fields={options.fields.map(toField)}
          labelPosition="side"
          size="xs"
          columns={1}
        />
      </form>
      {options.hint ? <ClarifyFootnote>{options.hint}</ClarifyFootnote> : null}
      <ClarifyActions>
        <Button type="submit" form={id} size="xs">
          {options.submit ?? "Submit"}
        </Button>
      </ClarifyActions>
    </Form>
  )
}
