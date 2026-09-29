"use client"

import * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"

import { cn } from "../../lib/utils"
import { buttonVariants, type ButtonProps } from "./button"

/*
 * A multi-step questionnaire — one question at a time, single or multiple
 * choice, an optional freeform answer, skippable items. Ported from shadcn's
 * Questionnaire; `@shadcn/react` owns navigation, validation, keyboard
 * shortcuts and the fieldset/legend semantics, this file owns the look.
 *
 * The look is the kit's ask language (Analyst Flow Grammar): compact choice
 * rows with a ring radio and the choice's source in mono on the right, a thin
 * progress bar, small actions with Skip as ghost. It is the body of an
 * assistant's `ClarifyCard` as readily as a standalone form.
 *
 * Deviations from upstream: answer text inherits the root size (no `text-sm`
 * on a choice or the input), controls use `rounded-control`, the check mark is
 * an inline SVG so the kit takes no icon dependency, the choice has a
 * `QuestionnaireChoiceTitle` slot so a story needs no classes, a choice takes
 * a `detail` and can be `readOnly`, and the input takes a `unit`.
 */

type NavProps = Pick<ButtonProps, "size" | "variant">

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn("flex w-full min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

/**
 * `1 of 3` and a bar that fills as the steps are answered. Pass children to
 * replace the count's words; the bar stays.
 */
function QuestionnaireProgress({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnairePrimitive.Progress>, "render">) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      render={(rendered, { current, total }) => (
        <div
          {...rendered}
          className={cn(
            "flex min-h-[1lh] items-center gap-2 font-mono text-xs tabular-nums text-muted-foreground",
            className
          )}
        >
          <span className="shrink-0">{children ?? (total ? `${current} of ${total}` : null)}</span>
          <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-border">
            <span
              className="absolute inset-y-0 start-0 rounded-full bg-primary transition-[width]"
              style={{ width: total ? `${(current / total) * 100}%` : 0 }}
            />
          </span>
        </div>
      )}
      {...props}
    />
  )
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn(
        "flex min-w-0 flex-col gap-2 border-0 p-0 outline-none",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        // A legend is not a flex item, so the item's gap does not reach it.
        "p-0 text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-2",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn("text-sm text-pretty text-muted-foreground", className)}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn("group/questionnaire-choices grid min-w-0 gap-1.5", className)}
      {...props}
    />
  )
}

interface QuestionnaireChoiceProps
  extends React.ComponentProps<typeof QuestionnairePrimitive.Choice> {
  /**
   * Where the choice comes from, on the right in mono — `142 open POs`,
   * `pnl.total`. What makes an option read as something the data holds.
   */
  detail?: React.ReactNode
  /**
   * A settled answer: the choice is shown, not offered. Unlike `disabled` it
   * keeps full strength, so the answer still reads.
   */
  readOnly?: boolean
}

function QuestionnaireChoice({
  children,
  className,
  detail,
  readOnly,
  disabled,
  ...props
}: QuestionnaireChoiceProps) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      data-readonly={readOnly ? "" : undefined}
      disabled={disabled || readOnly}
      className={cn(
        "group/questionnaire-choice relative flex min-h-7 cursor-pointer select-none items-start gap-2 rounded-control border border-border px-2 py-1 text-start outline-none transition-colors hover:bg-muted/50",
        "has-[>input:focus-visible]:ring-2 has-[>input:focus-visible]:ring-ring has-[>input:focus-visible]:ring-offset-2 has-[>input:focus-visible]:ring-offset-background",
        "data-[checked]:border-primary/45 data-[checked]:bg-primary/15 data-[invalid]:border-destructive",
        readOnly
          ? "pointer-events-none cursor-default"
          : "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative mt-[0.25em] flex size-[1em] shrink-0 items-center justify-center rounded-control border border-muted-foreground group-data-[type=radio]/questionnaire-choice:rounded-full group-data-[checked]/questionnaire-choice:border-primary group-data-[type=checkbox]/questionnaire-choice:group-data-[checked]/questionnaire-choice:bg-primary group-data-[checked]/questionnaire-choice:text-primary-foreground"
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="hidden size-[0.46em] rounded-full bg-primary group-data-[type=radio]/questionnaire-choice:group-data-[checked]/questionnaire-choice:block"
        />
        <svg
          data-slot="questionnaire-choice-indicator-check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hidden size-[0.75em] group-data-[type=checkbox]/questionnaire-choice:group-data-[checked]/questionnaire-choice:block"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 self-baseline"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      {detail != null ? (
        <span
          data-slot="questionnaire-choice-detail"
          className="ms-auto shrink-0 self-baseline font-mono text-xs text-muted-foreground"
        >
          {detail}
        </span>
      ) : null}
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        className="pointer-events-none ms-auto hidden size-5 shrink-0 items-center justify-center rounded-control border border-border bg-background font-mono text-xs font-medium leading-none text-muted-foreground group-data-[shortcut]/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  )
}

/** The choice itself — `Delegation`. Sits above an optional description. */
function QuestionnaireChoiceTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-title"
      className={cn(className)}
      {...props}
    />
  )
}

/** What the choice means — `Show how work moves to a specialist.` */
function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

interface QuestionnaireInputProps
  extends React.ComponentProps<typeof QuestionnairePrimitive.Input> {
  /** The unit, on the right in mono — `%`, `kg/ha`. Open vocabulary. */
  unit?: React.ReactNode
}

function QuestionnaireInput({ className, unit, ...props }: QuestionnaireInputProps) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative flex w-full min-w-0 items-center"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "flex h-7 w-full min-w-0 rounded-control border border-border bg-background px-2 py-1 outline-none transition-colors placeholder:text-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
          unit != null && "pe-10",
          className
        )}
        {...props}
      />
      {unit != null ? (
        <span
          data-slot="questionnaire-input-unit"
          className="pointer-events-none absolute end-2 font-mono text-sm text-muted-foreground"
        >
          {unit}
        </span>
      ) : null}
    </div>
  )
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function QuestionnairePrevious({
  children,
  className,
  size = "xs",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> & NavProps) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 justify-self-start",
        className
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  )
}

function QuestionnaireSkip({
  children,
  className,
  size = "xs",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> & NavProps) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  )
}

function QuestionnaireNext({
  children,
  className,
  size = "xs",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> & NavProps) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  )
}

function QuestionnaireSubmit({
  children,
  className,
  size = "xs",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> & NavProps) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  )
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceTitle,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
}
export type { QuestionnaireChoiceProps, QuestionnaireInputProps }
