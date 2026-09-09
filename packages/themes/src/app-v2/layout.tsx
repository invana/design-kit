import React from 'react';
import { AppLayoutV1 } from '../app-v1';
import {
  type NavVerticalProps,
  type NavHorizontalProps,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@invana/ui";

export interface SectionConfig {
  content: React.ReactNode;
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
  collapsible?: boolean;
}

export interface MainSectionConfig {
  content: React.ReactNode;
  defaultSize?: number | string;
  minSize?: number | string;
}

/**
 * Which columns the bottom (terminal) panel stretches under.
 *
 * - `left-main` (default): bottom spans the left sidebar + main editor; the
 *   right/auxiliary panel is full height beside them.
 * - `main-right`: bottom spans the main editor + right/auxiliary panel; the
 *   left sidebar is full height beside them.
 * - `main`: bottom spans only the main editor; both the left sidebar and the
 *   right/auxiliary panel are full height beside it.
 * - `full`: bottom spans the entire width (left + main + right).
 */
export type BottomSpan = 'left-main' | 'main-right' | 'main' | 'full';

export interface AppLayoutV2Props {
  className?: string;
  header: NavHorizontalProps;
  footer?: NavHorizontalProps;
  mainClassName?: string;
  /**
   * The left activity bar. Optional — when omitted (or empty) the vertical bar
   * is hidden and the workspace stretches to the full width. See `AppLayoutV1`.
   */
  leftNav?: NavVerticalProps;
  leftSection?: SectionConfig;
  mainSection: MainSectionConfig;
  bottomSection?: SectionConfig;
  rightSection?: SectionConfig;
  /** Which columns the bottom panel spans. Defaults to `left-main`. */
  bottomSpan?: BottomSpan;
  /**
   * Namespace for the ids this shell gives its resizable groups and panels.
   *
   * `react-resizable-panels` keeps every live group in one process-wide registry
   * and resolves a group by the **first** id that matches, so a group id is an
   * application-global name: two shells alive at once with the same ids read each
   * other's layout and the mismatched one throws `Invalid N panel layout`. That
   * happens whenever a layout nests — an app whose main region embeds another
   * `AppLayoutV2`-based app (e.g. a canvas app inside a Studio shell).
   *
   * Defaults to a per-instance value from `useId()`, so nesting just works. Pass
   * your own only when the ids must be **stable** across mounts — a persisted
   * layout, a CSS selector, an e2e locator — and then keep it unique per shell.
   */
  idPrefix?: string;
}

// Default section sizes
const DEFAULT_SIDEBAR = { defaultSize: "250px", minSize: "150px", maxSize: "500px", collapsible: true };
const DEFAULT_TERMINAL = { defaultSize: "300px", minSize: "100px", maxSize: "600px", collapsible: true };
const DEFAULT_AUXILIARY = { defaultSize: "300px", minSize: "200px", maxSize: "600px", collapsible: true };
const DEFAULT_EDITOR = { defaultSize: "600px", minSize: "400px" };
const DEFAULT_EDITOR_AREA = { defaultSize: "500px", minSize: "300px" };
const DEFAULT_LEFT_MAIN_AREA = { defaultSize: "800px", minSize: "400px" };

export const AppLayoutV2: React.FC<AppLayoutV2Props> = ({
  className,
  header,
  footer,
  mainClassName,
  leftNav,
  leftSection,
  mainSection,
  bottomSection,
  rightSection,
  bottomSpan = 'left-main',
  idPrefix,
}) => {
  // Every group and panel id below is namespaced per instance, because the
  // library's registry is process-wide (see `idPrefix`). `useId()` returns a
  // colon-wrapped token (`:r3:`); the ids reach the DOM `id` attribute, where a
  // colon is legal but needs escaping in a selector — so strip them.
  const generatedId = React.useId().replace(/:/g, '');
  const ns = idPrefix ?? `app-v2-${generatedId}`;
  const panelId = (name: string) => `${ns}-${name}`;

  // The sidebar (left) panel. `preserve-pixel-size` holds its width when the
  // surrounding group grows (e.g. the right/auxiliary or bottom collapsing), so
  // the editor absorbs the freed space instead of the sidebar widening.
  const sidebarPanel = leftSection ? (
    <ResizablePanel
      id={panelId("sidebar-panel")}
      defaultSize={leftSection.defaultSize ?? DEFAULT_SIDEBAR.defaultSize}
      minSize={leftSection.minSize ?? DEFAULT_SIDEBAR.minSize}
      maxSize={leftSection.maxSize ?? DEFAULT_SIDEBAR.maxSize}
      collapsible={leftSection.collapsible ?? DEFAULT_SIDEBAR.collapsible}
      groupResizeBehavior="preserve-pixel-size"
    >
      <div className="h-full overflow-auto bg-card">{leftSection.content}</div>
    </ResizablePanel>
  ) : null;

  // The auxiliary (right) panel. Also holds pixel width so the editor absorbs
  // freed space when neighbours resize/collapse.
  const rightPanel = rightSection ? (
    <ResizablePanel
      id={panelId("auxiliary-panel")}
      defaultSize={rightSection.defaultSize ?? DEFAULT_AUXILIARY.defaultSize}
      minSize={rightSection.minSize ?? DEFAULT_AUXILIARY.minSize}
      maxSize={rightSection.maxSize ?? DEFAULT_AUXILIARY.maxSize}
      collapsible={rightSection.collapsible ?? DEFAULT_AUXILIARY.collapsible}
      groupResizeBehavior="preserve-pixel-size"
    >
      <div className="h-full overflow-auto bg-card">{rightSection.content}</div>
    </ResizablePanel>
  ) : null;

  // The bottom (terminal) panel, including the handle that precedes it.
  const bottomPanel = bottomSection ? (
    <>
      <ResizableHandle withHandle />
      <ResizablePanel
        id={panelId("terminal-panel")}
        defaultSize={bottomSection.defaultSize ?? DEFAULT_TERMINAL.defaultSize}
        minSize={bottomSection.minSize ?? DEFAULT_TERMINAL.minSize}
        maxSize={bottomSection.maxSize ?? DEFAULT_TERMINAL.maxSize}
        collapsible={bottomSection.collapsible ?? DEFAULT_TERMINAL.collapsible}
      >
        <div className="h-full overflow-auto bg-card">{bottomSection.content}</div>
      </ResizablePanel>
    </>
  ) : null;

  const editorPanel = (
    <ResizablePanel
      id={panelId("editor-panel")}
      defaultSize={mainSection.defaultSize ?? DEFAULT_EDITOR.defaultSize}
      minSize={mainSection.minSize ?? DEFAULT_EDITOR.minSize}
    >
      <div className="h-full overflow-auto bg-card">{mainSection.content}</div>
    </ResizablePanel>
  );

  // The horizontal editor row. `includeLeft` / `includeRight` decide which of
  // the side panels sit in the row (the ones that don't are hoisted out as
  // full-height siblings so the bottom panel can span across them).
  //
  // The editor is ALWAYS wrapped in the same `ResizablePanelGroup` /
  // `ResizablePanel` (with stable `order`s) — even with no side panels — so
  // toggling a side section on/off adds/removes a *sibling* panel rather than
  // changing the editor's DOM ancestor. A bare-<div> fast-path for the no-side
  // case would remount `mainSection.content` (e.g. a canvas / iframe / video)
  // every time a side panel appears or disappears, destroying its state.
  const renderEditorRow = (includeLeft: boolean, includeRight: boolean) => {
    const withLeft = includeLeft && sidebarPanel;
    const withRight = includeRight && rightPanel;

    return (
      <ResizablePanelGroup orientation="horizontal" id={panelId("editor-horizontal")}>
        {withLeft && (
          <>
            {sidebarPanel}
            <ResizableHandle withHandle />
          </>
        )}
        {editorPanel}
        {withRight && (
          <>
            <ResizableHandle withHandle />
            {rightPanel}
          </>
        )}
      </ResizablePanelGroup>
    );
  };

  // A vertical stack of the editor row with the bottom panel underneath it.
  // Used wherever the bottom panel spans more than one column.
  const editorWithBottom = (includeLeft: boolean, includeRight: boolean, groupId: string) => (
    <ResizablePanelGroup orientation="vertical" id={panelId(groupId)}>
      <ResizablePanel
        id={panelId("editor-area")}
        defaultSize={bottomSection ? DEFAULT_EDITOR_AREA.defaultSize : undefined}
        minSize={bottomSection ? DEFAULT_EDITOR_AREA.minSize : undefined}
      >
        {renderEditorRow(includeLeft, includeRight)}
      </ResizablePanel>
      {bottomPanel}
    </ResizablePanelGroup>
  );

  let layout: React.ReactNode;

  if (bottomSpan === 'full') {
    // Bottom spans everything: the full left|main|right row stacks above it.
    layout = (
      <ResizablePanelGroup orientation="vertical" id={panelId("main-layout")}>
        <ResizablePanel
          id={panelId("editor-area")}
          defaultSize={bottomSection ? DEFAULT_EDITOR_AREA.defaultSize : undefined}
          minSize={bottomSection ? DEFAULT_EDITOR_AREA.minSize : undefined}
        >
          {renderEditorRow(true, true)}
        </ResizablePanel>
        {bottomPanel}
      </ResizablePanelGroup>
    );
  } else if (bottomSpan === 'main') {
    // Bottom spans only the main editor: both the left sidebar and the
    // right/auxiliary panel are full-height siblings around the center column,
    // which stacks the editor above the bottom panel.
    layout = (
      <ResizablePanelGroup orientation="horizontal" id={panelId("main-layout")}>
        {sidebarPanel && (
          <>
            {sidebarPanel}
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel
          id={panelId("main-center-area")}
          defaultSize={(leftSection || rightSection) ? DEFAULT_LEFT_MAIN_AREA.defaultSize : undefined}
          minSize={(leftSection || rightSection) ? DEFAULT_LEFT_MAIN_AREA.minSize : undefined}
        >
          {editorWithBottom(false, false, "main-center-vertical")}
        </ResizablePanel>
        {rightPanel && (
          <>
            <ResizableHandle withHandle />
            {rightPanel}
          </>
        )}
      </ResizablePanelGroup>
    );
  } else if (bottomSpan === 'main-right') {
    // Bottom spans main + right: the left sidebar is a full-height sibling.
    layout = (
      <ResizablePanelGroup orientation="horizontal" id={panelId("main-layout")}>
        {sidebarPanel && (
          <>
            {sidebarPanel}
            <ResizableHandle withHandle />
          </>
        )}
        <ResizablePanel
          id={panelId("main-right-area")}
          defaultSize={leftSection ? DEFAULT_LEFT_MAIN_AREA.defaultSize : undefined}
          minSize={leftSection ? DEFAULT_LEFT_MAIN_AREA.minSize : undefined}
        >
          {editorWithBottom(false, true, "main-right-vertical")}
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  } else {
    // 'left-main' (default): bottom spans left + main; right is full height.
    layout = (
      <ResizablePanelGroup orientation="horizontal" id={panelId("main-layout")}>
        <ResizablePanel
          id={panelId("left-main-area")}
          defaultSize={rightSection ? DEFAULT_LEFT_MAIN_AREA.defaultSize : undefined}
          minSize={rightSection ? DEFAULT_LEFT_MAIN_AREA.minSize : undefined}
        >
          {editorWithBottom(true, false, "left-main-vertical")}
        </ResizablePanel>
        {rightPanel && (
          <>
            <ResizableHandle withHandle />
            {rightPanel}
          </>
        )}
      </ResizablePanelGroup>
    );
  }

  return (
    <AppLayoutV1
      className={className}
      header={header}
      mainClassName={mainClassName}
      leftNav={leftNav}
      footer={footer ?? { className: '' }}
      main={<div className="flex-1 h-full">{layout}</div>}
    />
  );
};
