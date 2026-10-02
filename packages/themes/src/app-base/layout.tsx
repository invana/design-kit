import React from 'react';
import { TooltipProvider, NavHorizontal, type NavHorizontalProps } from "@invana/ui";
import { cn } from '@invana/ui/lib/utils';

/**
 * The chrome surface. Header and footer are one frame around `main`, so they
 * share a single background — `chrome`, which a theme sets apart from the
 * `card` the work sits on (a theme that does not set it gets one derived
 * from its card and background). Exported so shells adding their own chrome
 * (app-v1's left activity bar) sit on the same surface rather than re-deriving it.
 * A caller's own `className` merges last and still wins.
 */
export const CHROME_SURFACE = 'bg-chrome text-card-foreground';

export interface AppLayoutBaseProps {
  className?: string;
  header: NavHorizontalProps;
  main: React.ReactNode
  mainClassName?: string
  /** Optional — a shell with no status line (app-agents) leaves it out. */
  footer?: NavHorizontalProps
}

export const AppLayoutBase: React.FC<AppLayoutBaseProps> = (props) => {
  return (

    <TooltipProvider delayDuration={0}>
      <div className={cn("flex h-screen flex-col  bg-background text-foreground", props.className)}>
        <NavHorizontal 
          className={cn("h-control-lg border-b border-border", CHROME_SURFACE, props.header.className)}
          left={props.header.left}
          leftNavItems={props.header.leftNavItems}
          center={props.header.center}
          centerNavItems={props.header.centerNavItems}
          right={props.header.right}
          rightNavItems={props.header.rightNavItems}
        />
        {/* Fill the remaining column height (root minus the `lg` header + `sm`
            footer) via flex, NOT a hardcoded `calc(100vh-…)`. That keeps the
            shell embeddable: when a consumer overrides the root height (e.g.
            `className="h-full"` for a bounded / sub-viewport container) the main
            region tracks it instead of forcing the full viewport. `min-h-0` lets
            it shrink below its content so inner scroll areas work. */}
        <div className={cn("flex-1 min-h-0 w-full bg-background", props.mainClassName)}>
          {props.main}
        </div>
        {props.footer && (
          <NavHorizontal 
            className={cn("h-control-sm border-t border-border", CHROME_SURFACE, props.footer.className)}
            left={props.footer.left}
            leftNavItems={props.footer.leftNavItems}
            center={props.footer.center}
            centerNavItems={props.footer.centerNavItems}
            right={props.footer.right}
            rightNavItems={props.footer.rightNavItems}
          />
        )}
      </div>
    </TooltipProvider>
  );
};
