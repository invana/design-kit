import React from 'react';
import { AppLayoutBase, CHROME_SURFACE } from '../app-base';
import { 
  NavVertical, 
  type NavVerticalProps, 
  type NavHorizontalProps }
from "@invana/ui";
import { cn } from '@invana/ui/lib/utils';

export interface AppLayoutV1Props {
  /**
   * The left activity bar. Optional — when omitted (or when it carries no
   * `top`/`topNavItems`/`middle`/`bottom`/`bottomNavItems` content) the vertical
   * bar is not rendered at all and `main` stretches to the full width.
   */
  leftNav?: NavVerticalProps
  className?: string;
  header: NavHorizontalProps;
  main: React.ReactNode
  mainClassName?: string
  footer: NavHorizontalProps
}

/** Whether a leftNav config carries any renderable content. */
const hasNavContent = (nav?: NavVerticalProps): nav is NavVerticalProps =>
  !!nav && !!(
    nav.top ||
    nav.topNavItems?.length ||
    nav.middle ||
    nav.bottom ||
    nav.bottomNavItems?.length
  );

export const AppLayoutV1: React.FC<AppLayoutV1Props> = (props) => {
  const showLeftNav = hasNavContent(props.leftNav);
  return (
    <AppLayoutBase
      className={props.className}
      header={props.header}
      mainClassName={props.mainClassName}
      main={
        <div className="relative h-full flex flex-1">
          {showLeftNav && (
            <NavVertical
              className={cn('border-r', CHROME_SURFACE, props.leftNav?.className)}
              top={props.leftNav?.top}
              topNavItems={props.leftNav?.topNavItems}
              middle={props.leftNav?.middle}
              bottom={props.leftNav?.bottom}
              bottomNavItems={props.leftNav?.bottomNavItems}
            />
          )}
          <main className="w-full">
            {props.main}
          </main>
        </div>
      }
      footer={props.footer}
    />
  );
};
