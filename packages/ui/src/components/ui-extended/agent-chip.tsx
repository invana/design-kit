import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const agentChipVariants = cva(
  "inline-flex max-w-full shrink-0 items-center gap-1 rounded-control border px-1.5 \
  text-meta [&_svg]:size-3 [&_svg]:shrink-0",
  {
    variants: {
      /**
       * Who this is. The distinction is the point of the component: a reader
       * scanning a task list needs to know at a glance whether a person or an
       * agent is holding it, and reading the name is too slow.
       */
      kind: {
        agent: "border-border bg-transparent text-foreground",
        person: "border-transparent bg-accent text-foreground",
      },
      /** A retired or paused agent still appears in history and lineage. */
      inactive: {
        true: "opacity-60",
        false: "",
      },
    },
    defaultVariants: { kind: "agent", inactive: false },
  },
)

export interface AgentChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof agentChipVariants> {
  /** A 12px lucide icon, or an `<Avatar>`. */
  icon?: React.ReactNode
  name: React.ReactNode
}

/**
 * Who did this — an agent or a person — as a 22px chip.
 *
 * It appears wherever work has a holder: a task row's assignee, a step's actor,
 * a skill's users, a rule's audience, a proposal's author.
 *
 * Deliberately not a `Badge`. A badge carries a *state* and takes a tone from
 * the status palette; this carries an *identity* and must never look like a
 * status. Same reason it does not take a colour: agents are told apart by name,
 * not by hue.
 */
export const AgentChip = React.forwardRef<HTMLSpanElement, AgentChipProps>(
  ({ icon, name, kind, inactive, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(agentChipVariants({ kind, inactive }), className)}
      {...props}
    >
      {icon ? (
        <span className="flex shrink-0 items-center text-muted-foreground">{icon}</span>
      ) : null}
      <span className="truncate">{name}</span>
    </span>
  ),
)
AgentChip.displayName = "AgentChip"

export { agentChipVariants }
