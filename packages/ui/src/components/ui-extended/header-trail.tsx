import * as React from "react"

import { cn } from "../../lib/utils"
import { Separator } from "../ui/separator"

export interface HeaderTrailCrumb {
  label: string
  href?: string
  onClick?: () => void
}

export interface HeaderTrailProps extends React.HTMLAttributes<HTMLElement> {
  /** The product's mark — a wordmark or a logo. */
  brand: React.ReactNode
  /** Where the reader is, outermost first — `ravi-merugu`, `chickpea-breeding`. */
  crumbs: HeaderTrailCrumb[]
}

/**
 * The left of an app header: the brand, a rule, then the trail to where the
 * reader is — the account, the project. The brand keeps its width; the trail
 * truncates, innermost crumb last to go, so a narrow header never grows wider
 * for it.
 */
export const HeaderTrail = React.forwardRef<HTMLElement, HeaderTrailProps>(
  ({ brand, crumbs, className, ...props }, ref) => (
    <nav ref={ref} aria-label="Breadcrumb" className={cn("flex min-w-0 items-center gap-1", className)} {...props}>
      <span className="shrink-0 select-none px-2 text-xl font-bold">{brand}</span>
      <Separator orientation="vertical" className="h-4 shrink-0" />
      <ol className="flex min-w-0 items-center gap-1.5 px-1.5 font-bold">
        {crumbs.map((c, i) => (
          <li key={`${i}-${c.label}`} className={cn("flex min-w-0 items-center gap-1.5", i === crumbs.length - 1 ? "shrink" : "shrink-[2]")}>
            {i ? (
              <span aria-hidden className="shrink-0 text-muted-foreground">
                /
              </span>
            ) : null}
            {c.href || c.onClick ? (
              <a
                href={c.href ?? "#"}
                onClick={
                  c.onClick
                    ? (e) => {
                        e.preventDefault()
                        c.onClick!()
                      }
                    : undefined
                }
                aria-current={i === crumbs.length - 1 ? "page" : undefined}
                className="min-w-0 truncate rounded-control hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {c.label}
              </a>
            ) : (
              <span className="min-w-0 truncate" aria-current={i === crumbs.length - 1 ? "page" : undefined}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  ),
)
HeaderTrail.displayName = "HeaderTrail"
