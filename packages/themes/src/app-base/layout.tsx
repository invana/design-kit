import React from 'react';
import { TooltipProvider, NavHorizontal, type NavHorizontalProps } from "@invana/ui";
import { cn } from '@invana/ui/lib/utils';

export interface AppLayoutBaseProps {
  className?: string;
  header: NavHorizontalProps;
  main: React.ReactNode
  mainClassName?: string
  footer: NavHorizontalProps
}

export const AppLayoutBase: React.FC<AppLayoutBaseProps> = (props) => {
  return (

    <TooltipProvider delayDuration={0}>
      <div className={cn("flex h-screen flex-col  bg-background text-foreground", props.className)}>
        <NavHorizontal 
          className={`h-[40px] border-b border-border bg-background ${props.header.className}`} 
          left={props.header.left}
          leftNavItems={props.header.leftNavItems}
          center={props.header.center}
          centerNavItems={props.header.centerNavItems}
          right={props.header.right}
          rightNavItems={props.header.rightNavItems}
        />
        <div className={`h-[calc(100vh-70px)]  w-full bg-background ${props?.mainClassName}`}>     
          {props.main}
        </div>
        <NavHorizontal 
          className={`h-[25px] border-t border-border bg-background ${props.footer.className}`} 
          left={props.footer.left}
          leftNavItems={props.footer.leftNavItems}
          center={props.footer.center}
          centerNavItems={props.footer.centerNavItems}
          right={props.footer.right}
          rightNavItems={props.footer.rightNavItems}
        />
      </div>
    </TooltipProvider>
  );
};
