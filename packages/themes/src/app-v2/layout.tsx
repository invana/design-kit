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

export interface AppLayoutV2Props {
  className?: string;
  header: NavHorizontalProps;
  footer?: NavHorizontalProps;
  mainClassName?: string;
  leftNav: NavVerticalProps;
  leftSection?: SectionConfig;
  mainSection: MainSectionConfig;
  bottomSection?: SectionConfig;
  rightSection?: SectionConfig;
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
}) => {
  return (
    <AppLayoutV1
      className={className}
      header={header}
      mainClassName={mainClassName}
      leftNav={leftNav}
      footer={footer ?? { className: '' }}
      main={
        <div className="flex-1 h-full">
          <ResizablePanelGroup orientation="horizontal" id="main-layout">
            {/* Left Main Area: Contains editor area (left+main) and bottom terminal */}
            <ResizablePanel 
              id="left-main-area" 
              defaultSize={rightSection ? DEFAULT_LEFT_MAIN_AREA.defaultSize : undefined}
              minSize={rightSection ? DEFAULT_LEFT_MAIN_AREA.minSize : undefined}
            >
              <ResizablePanelGroup orientation="vertical" id="left-main-vertical">
                {/* Editor Area: Contains sidebar (left) and editor (main) */}
                <ResizablePanel 
                  id="editor-area"
                  defaultSize={bottomSection ? DEFAULT_EDITOR_AREA.defaultSize : undefined}
                  minSize={bottomSection ? DEFAULT_EDITOR_AREA.minSize : undefined}
                >
                  {leftSection ? (
                    <ResizablePanelGroup orientation="horizontal" id="editor-horizontal">
                      <ResizablePanel
                        id="sidebar-panel"
                        defaultSize={leftSection.defaultSize ?? DEFAULT_SIDEBAR.defaultSize}
                        minSize={leftSection.minSize ?? DEFAULT_SIDEBAR.minSize}
                        maxSize={leftSection.maxSize ?? DEFAULT_SIDEBAR.maxSize}
                        collapsible={leftSection.collapsible ?? DEFAULT_SIDEBAR.collapsible}
                        // Hold the sidebar's pixel width when the surrounding group
                        // grows (e.g. the right/auxiliary section collapsing). The
                        // editor panel keeps the default relative-size behaviour, so
                        // it absorbs the freed space instead of the sidebar widening.
                        groupResizeBehavior="preserve-pixel-size"
                      >
                        <div className="h-full overflow-auto bg-card">{leftSection.content}</div>
                      </ResizablePanel>
                      <ResizableHandle withHandle className='w-1' />
                      <ResizablePanel 
                        id="editor-panel"
                        defaultSize={mainSection.defaultSize ?? DEFAULT_EDITOR.defaultSize} 
                        minSize={mainSection.minSize ?? DEFAULT_EDITOR.minSize}
                      >
                        <div className="h-full overflow-auto">{mainSection.content}</div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  ) : (
                    <div className="h-full w-full overflow-auto">{mainSection.content}</div>
                  )}
                </ResizablePanel>
                
                {/* Terminal Panel: Bottom section */}
                {bottomSection && (
                  <>
                    <ResizableHandle withHandle  className='h-1' />
                    <ResizablePanel 
                      id="terminal-panel"
                      defaultSize={bottomSection.defaultSize ?? DEFAULT_TERMINAL.defaultSize} 
                      minSize={bottomSection.minSize ?? DEFAULT_TERMINAL.minSize} 
                      maxSize={bottomSection.maxSize ?? DEFAULT_TERMINAL.maxSize} 
                      collapsible={bottomSection.collapsible ?? DEFAULT_TERMINAL.collapsible}
                    >
                      <div className="h-full overflow-auto bg-card">{bottomSection.content}</div>
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
            
            {/* Auxiliary Panel: Right section (full height) */}
            {rightSection && (
              <>
                <ResizableHandle withHandle className='w-1' />
                <ResizablePanel 
                  id="auxiliary-panel"
                  defaultSize={rightSection.defaultSize ?? DEFAULT_AUXILIARY.defaultSize} 
                  minSize={rightSection.minSize ?? DEFAULT_AUXILIARY.minSize} 
                  maxSize={rightSection.maxSize ?? DEFAULT_AUXILIARY.maxSize} 
                  collapsible={rightSection.collapsible ?? DEFAULT_AUXILIARY.collapsible}
                >
                  <div className="h-full overflow-auto bg-card">{rightSection.content}</div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      }
    />
  );
};
