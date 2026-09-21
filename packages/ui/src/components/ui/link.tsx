import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * `variant` is how loudly the link asks to be clicked.
 *
 * Three, because three is what the product actually uses and a fourth would be
 * a decision nobody could state:
 *
 * - `default` — a link inside a sentence. Accent-coloured, underlined on hover.
 *   The colour is what marks it as a link while reading; the underline confirms
 *   it under the cursor.
 * - `underlined` — always underlined, accent-coloured. For a link that has to
 *   read as a link **before** the cursor arrives: terms and conditions under a
 *   sign-in button, a citation, anything legal or referential.
 * - `quiet` — muted, brightening to the foreground on hover. A footer link, a
 *   row that happens to be navigable. It is not shouting, and it is not
 *   pretending to be body copy either: the hover is the affordance.
 *
 * Deliberately **not** a `Button` variant. A button performs an act on this
 * page; a link goes somewhere, which is a different promise, a different
 * element and a different set of things a browser will do for you (middle
 * click, copy address, open in a tab). A `<button>` styled as a link takes all
 * of that away, and `Button asChild` around an `<a>` is the escape hatch for
 * the genuinely button-shaped case.
 *
 * No size axis. A link takes the size of the text it sits in — that is what
 * makes it a link *in a sentence* rather than a control dropped into one.
 */
const linkVariants = cva(
  "underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 \
  focus-visible:ring-ring focus-visible:ring-offset-2 rounded-[2px]",
  {
    variants: {
      variant: {
        default: "text-primary hover:underline",
        underlined: "text-primary underline",
        quiet: "text-muted-foreground hover:text-foreground hover:underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /**
   * The destination is outside this app: opens in a new tab, and carries
   * `rel="noreferrer noopener"` so the opened page cannot reach back through
   * `window.opener`.
   *
   * A flag rather than asking every call site to remember `target` and `rel`
   * together — the pair is the thing that is correct, and half of it is a
   * security bug nobody notices.
   */
  external?: boolean
}

/**
 * A link. An `<a>` with the kit's colours, and the two behaviours an external
 * one needs.
 *
 * It exists because every surface was writing its own — `text-primary
 * hover:underline` here, `text-muted-foreground hover:underline` there — which
 * is four spellings of one object and a colour that drifts the day the accent
 * moves.
 *
 * Routing is the consumer's: this renders an `<a>`, and a router's own `Link`
 * wraps it (`<RouterLink asChild>`) or takes these classes. The kit does not
 * depend on a router, because a component that did could only ever be used with
 * that one.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, target, rel, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(linkVariants({ variant }), className)}
      target={external ? "_blank" : target}
      rel={external ? "noreferrer noopener" : rel}
      {...props}
    />
  ),
)
Link.displayName = "Link"

export { linkVariants }
