import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

/**
 * Density for a tab strip.
 *
 * `sm` (28px) is the application tab strip — a panel's views, a canvas's open
 * tabs. It drops the list's inset background and padding: at that height the
 * tray reads as a second toolbar, and the strip sits directly on the panel's
 * own rule instead.
 *
 * Passed through context rather than as a prop on every part, so a caller sets
 * it once on `<Tabs>` and the list and triggers follow.
 */
type TabsSize = "default" | "sm";

const TabsSizeContext = React.createContext<TabsSize>("default");

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    size?: TabsSize;
  }
>(({ size = "default", ...props }, ref) => (
  <TabsSizeContext.Provider value={size}>
    <TabsPrimitive.Root ref={ref} {...props} />
  </TabsSizeContext.Provider>
));
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const size = React.useContext(TabsSizeContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center text-muted-foreground",
        size === "sm" ? "h-[30px] gap-1" : "rounded-lg bg-muted p-1",
        className,
      )}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const size = React.useContext(TabsSizeContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        size === "sm" ? "h-[26px] px-2 text-meta" : "px-3 py-1",
        "inline-flex items-center justify-center whitespace-nowrap rounded-control font-medium ring-offset-background transition-colors text-muted-foreground hover:text-foreground hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary/15 data-[state=active]:text-primary data-[state=active]:ring-1 data-[state=active]:ring-primary/25 data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
