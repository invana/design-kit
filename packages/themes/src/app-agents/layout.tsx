import React from 'react';
import {
  type NavHorizontalProps,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@invana/ui";
import { cn } from '@invana/ui/lib/utils';
import { AppLayoutBase } from '../app-base';
import type { MainSectionConfig, SectionConfig } from '../app-v2';

export interface AppLayoutAgentsProps {
  className?: string;
  header: NavHorizontalProps;
  /** Optional — the agents shell has no status line by default. */
  footer?: NavHorizontalProps;
  mainClassName?: string;
  /** The conversation rail: the thread with the agents, beside the work. */
  leftSection?: SectionConfig;
  /** The work the agents act on — a canvas, a graph, a document. */
  mainSection: MainSectionConfig;
  /**
   * Panels that float over the work, top right, stacked in one column — the
   * run's activity, its log. The column is as tall as the work and no taller:
   * two panels share it, each scrolling its own body. Pass nothing (or
   * `null`) and the work is uncovered.
   */
  overlay?: React.ReactNode;
  /**
   * Namespace for the resizable group and panel ids. Defaults to a
   * per-instance `useId()`, so two shells alive at once never share a layout —
   * see `AppLayoutV2Props.idPrefix`. Pass one only when the ids must be stable.
   */
  idPrefix?: string;
}

const DEFAULT_LEFT = { defaultSize: "360px", minSize: "280px", maxSize: "720px", collapsible: true };
// Main carries no default size, so the rail keeps its pixels and main
// takes the rest (see app-v2).
const DEFAULT_MAIN = { minSize: "400px" };

// The rail is chrome, and so is a card drawn inside it.
const SIDE_SURFACE = 'h-full overflow-auto bg-chrome [--color-card:var(--color-chrome)]';

/**
 * The agents shell: the `AppLayoutBase` header over a resizable split of a
 * conversation rail (left) and the work (right). No activity bar, no
 * inspector and no bottom panel — for those, use `AppLayoutV2`.
 */
export const AppLayoutAgents: React.FC<AppLayoutAgentsProps> = ({
  className,
  header,
  footer,
  mainClassName,
  leftSection,
  mainSection,
  overlay,
  idPrefix,
}) => {
  const generatedId = React.useId().replace(/:/g, '');
  const ns = idPrefix ?? `app-agents-${generatedId}`;
  const panelId = (name: string) => `${ns}-${name}`;

  // Main stays in the same group whether or not the rail is drawn, so
  // toggling it never remounts the work (a canvas would lose its state).
  return (
    <AppLayoutBase
      className={className}
      header={header}
      footer={footer}
      mainClassName={mainClassName}
      main={
        <ResizablePanelGroup orientation="horizontal" id={panelId("layout")}>
          {leftSection && (
            <>
              <ResizablePanel
                id={panelId("left-panel")}
                defaultSize={leftSection.defaultSize ?? DEFAULT_LEFT.defaultSize}
                minSize={leftSection.minSize ?? DEFAULT_LEFT.minSize}
                maxSize={leftSection.maxSize ?? DEFAULT_LEFT.maxSize}
                collapsible={leftSection.collapsible ?? DEFAULT_LEFT.collapsible}
                groupResizeBehavior="preserve-pixel-size"
              >
                <div className={cn(SIDE_SURFACE, "border-r")}>{leftSection.content}</div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel
            id={panelId("main-panel")}
            defaultSize={mainSection.defaultSize}
            minSize={mainSection.minSize ?? DEFAULT_MAIN.minSize}
          >
            {/* The work owns its scroll — a canvas pans rather than scrolls. */}
            <div className="relative h-full overflow-hidden bg-card">
              {mainSection.content}
              {overlay ? (
                // Only the panels take the pointer: the gaps between them are still the work.
                <div className="pointer-events-none absolute inset-y-2 right-2 z-10 flex w-[min(480px,calc(100%-1rem))] flex-col items-stretch gap-2 [&>*]:pointer-events-auto">
                  {overlay}
                </div>
              ) : null}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      }
    />
  );
};
