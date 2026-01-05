import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV2 } from "@invana/themes/app-v2/layout";
import { 
  NavVerticalProps, Badge, Avatar, Input, Button,
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, 
  MenubarItem, MenubarSeparator, MenubarShortcut, MenubarSub,
  MenubarSubTrigger, MenubarSubContent, Separator, TabbedPanel
} from "@invana/ui";
import { 
  Home, Folder, Search, Settings,
  Bell, HelpCircle, User, LogOut,
  FileCode, GitBranch, Bug, Package,
  Terminal, AlertCircle, Info,
  PanelRight, ChevronRight, File, FolderOpen,
  Menu, Plus, RefreshCw, X, Maximize2, Copy, Filter, Trash2
} from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: "Themes/app-v2",
  component: AppLayoutV2,
  parameters: {
    layout: 'fullscreen',
  }
};
export default meta;

type Story = StoryObj<typeof AppLayoutV2>;

// Activity Bar (Left Nav - icon only navigation)
const leftNav: NavVerticalProps = {
  className: "",
  topNavItems: [
    { label: "Explorer", icon: Folder, onClick: () => console.log('Explorer clicked'), tooltip: "Explorer" },
    { label: "Search", icon: Search, onClick: () => console.log('Search clicked'), tooltip: "Search" },
    { label: "Source Control", icon: GitBranch, onClick: () => console.log('Git clicked'), tooltip: "Source Control" },
    { label: "Debug", icon: Bug, onClick: () => console.log('Debug clicked'), tooltip: "Run and Debug" },
    { label: "Extensions", icon: Package, onClick: () => console.log('Extensions clicked'), tooltip: "Extensions" },
  ],
  bottomNavItems: [
    { label: "Settings", icon: Settings, onClick: () => console.log('Settings clicked'), tooltip: "Settings" },
    { label: "Account", icon: User, onClick: () => console.log('Account clicked'), tooltip: "Account" },
  ],
};

// File tree content for Explorer tab
const FileTreeContent = () => (
  <div className="p-2 space-y-1">
    <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
      <ChevronRight className="h-3 w-3" />
      <FolderOpen className="h-4 w-4 text-yellow-500" />
      <span className="text-sm">src</span>
    </div>
    <div className="pl-4 space-y-1">
      <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
        <ChevronRight className="h-3 w-3" />
        <FolderOpen className="h-4 w-4 text-yellow-500" />
        <span className="text-sm">components</span>
      </div>
      <div className="pl-4 space-y-1">
        <div className="flex items-center gap-1 p-1 rounded bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Button.tsx</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Input.tsx</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Card.tsx</span>
        </div>
      </div>
      <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
        <FileCode className="h-4 w-4 text-blue-500" />
        <span className="text-sm">index.ts</span>
      </div>
    </div>
    <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
      <File className="h-4 w-4 text-gray-500" />
      <span className="text-sm">package.json</span>
    </div>
    <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
      <File className="h-4 w-4 text-gray-500" />
      <span className="text-sm">tsconfig.json</span>
    </div>
  </div>
);

// Search results content
const SearchResultsContent = () => (
  <div className="p-2 space-y-2">
    <div className="text-xs text-muted-foreground mb-2">3 results in 2 files</div>
    <div className="space-y-1">
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-sm font-medium">Button.tsx</div>
        <div className="text-xs text-muted-foreground">Line 12: const Button = ...</div>
      </div>
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-sm font-medium">Input.tsx</div>
        <div className="text-xs text-muted-foreground">Line 8: const Input = ...</div>
      </div>
    </div>
  </div>
);

// Git changes content
const GitChangesContent = () => (
  <div className="p-2">
    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Changes (3)</div>
    <div className="space-y-1">
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-green-500">M</span>
        <FileCode className="h-4 w-4" />
        <span className="text-sm">Button.tsx</span>
      </div>
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-green-500">M</span>
        <FileCode className="h-4 w-4" />
        <span className="text-sm">Input.tsx</span>
      </div>
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-blue-500">A</span>
        <FileCode className="h-4 w-4" />
        <span className="text-sm">Card.tsx</span>
      </div>
    </div>
  </div>
);

// Left section with TabbedPanel
const LeftSectionPanel = () => (
  <TabbedPanel
    tabs={[
      {
        value: 'explorer',
        label: 'EXPLORER',
        icon: Folder,
        content: <FileTreeContent />,
      },
      // {
      //   value: 'search',
      //   label: 'SEARCH',
      //   icon: Search,
      //   content: <SearchResultsContent />,
      // },
      // {
      //   value: 'git',
      //   label: 'SOURCE CONTROL',
      //   icon: GitBranch,
      //   content: <GitChangesContent />,
      // },
    ]}
    defaultTab="explorer"
    headerActions={{
      rightNavItems: [
        {
          name: 'new-file',
          icon: Plus,
          onClick: () => console.log('New file'),
          tooltip: 'New File',
        },
        {
          name: 'refresh',
          icon: RefreshCw,
          onClick: () => console.log('Refresh'),
          tooltip: 'Refresh',
        },
        {
          name: 'collapse',
          icon: Maximize2,
          onClick: () => console.log('Collapse'),
          tooltip: 'Collapse All',
        },
      ],
    }}
    bodyClassName="p-0"
    headerClassName="bg-muted/10"
  />
);

// Editor content for main section
const EditorContent = () => (
  <div className="h-full flex flex-col bg-background">
    {/* Editor tabs */}
    <div className="flex border-b bg-card">
      <div className="flex items-center gap-2 px-4 py-2 border-r bg-background">
        <FileCode className="h-4 w-4 text-blue-500" />
        <span className="text-sm">Button.tsx</span>
        <button className="ml-2 h-4 w-4 rounded hover:bg-accent flex items-center justify-center">
          ×
        </button>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 border-r text-muted-foreground hover:bg-accent cursor-pointer">
        <FileCode className="h-4 w-4" />
        <span className="text-sm">Input.tsx</span>
      </div>
    </div>
    
    {/* Editor content */}
    <div className="flex-1 overflow-auto p-4 font-mono text-sm">
      <pre className="text-muted-foreground">
{`import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md',
          'text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';`}
      </pre>
    </div>
  </div>
);

// Terminal content
const TerminalTabContent = () => (
  <div className="p-3 font-mono text-xs bg-black text-green-400 h-full">
    <div>$ npm run dev</div>
    <div className="text-muted-foreground mt-1">&gt; design-kit@1.0.0 dev</div>
    <div className="text-muted-foreground">&gt; vite</div>
    <div className="mt-2 text-blue-400">  VITE v5.0.0  ready in 234 ms</div>
    <div className="mt-1">  ➜  Local:   http://localhost:5173/</div>
    <div>  ➜  Network: http://192.168.1.100:5173/</div>
    <div className="mt-2 text-yellow-400">  press h + enter to show help</div>
    <div className="mt-2 animate-pulse">█</div>
  </div>
);

// Problems content
const ProblemsTabContent = () => (
  <div className="p-4">
    <div className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
      <AlertCircle className="h-4 w-4 text-destructive" />
      <div>
        <div className="text-sm">Unused variable 'variant'</div>
        <div className="text-xs text-muted-foreground">Button.tsx [12, 5]</div>
      </div>
    </div>
    <div className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <div>
        <div className="text-sm">Missing return type</div>
        <div className="text-xs text-muted-foreground">Input.tsx [8, 10]</div>
      </div>
    </div>
    <div className="flex items-center gap-2 p-2 rounded hover:bg-accent cursor-pointer">
      <AlertCircle className="h-4 w-4 text-yellow-500" />
      <div>
        <div className="text-sm">Implicit any type</div>
        <div className="text-xs text-muted-foreground">Card.tsx [5, 3]</div>
      </div>
    </div>
  </div>
);

// Output content
const OutputTabContent = () => (
  <div className="p-3 font-mono text-xs">
    <div>[12:34:56] Starting compilation...</div>
    <div className="text-muted-foreground">[12:34:57] File change detected. Starting incremental compilation...</div>
    <div className="text-green-500">[12:34:58] Compilation complete. Watching for file changes.</div>
  </div>
);

// Bottom section with TabbedPanel
const BottomSectionPanel = () => (
  <TabbedPanel
    tabs={[
      {
        value: 'problems',
        label: 'PROBLEMS',
        content: <ProblemsTabContent />,
      },
      {
        value: 'output',
        label: 'OUTPUT',
        content: <OutputTabContent />,
      },
      {
        value: 'terminal',
        label: 'TERMINAL',
        content: <TerminalTabContent />,
      },
    ]}
    defaultTab="problems"
    headerActions={{
      rightNavItems: [
        {
          name: 'clear',
          icon: Trash2,
          onClick: () => console.log('Clear'),
          tooltip: 'Clear All',
        },
        {
          name: 'copy',
          icon: Copy,
          onClick: () => console.log('Copy'),
          tooltip: 'Copy',
        },
        {
          name: 'filter',
          icon: Filter,
          onClick: () => console.log('Filter'),
          tooltip: 'Filter',
        },
        {
          name: 'close',
          icon: X,
          onClick: () => console.log('Close'),
          tooltip: 'Close Panel',
          showSeperator: true,
        },
      ],
    }}
    bodyClassName="p-0"
    headerClassName="bg-muted/10"
  />
);

// Outline content
const OutlineTabContent = () => (
  <div className="p-2">
    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-2 p-1.5 rounded hover:bg-accent cursor-pointer">
        <span className="text-purple-500">I</span>
        <span>ButtonProps</span>
      </div>
      <div className="pl-3 space-y-1">
        <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer text-muted-foreground">
          <span className="text-blue-500">P</span>
          <span>variant</span>
        </div>
        <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer text-muted-foreground">
          <span className="text-blue-500">P</span>
          <span>size</span>
        </div>
      </div>
      <div className="flex items-center gap-2 p-1.5 rounded bg-accent cursor-pointer">
        <span className="text-yellow-500">F</span>
        <span>Button</span>
      </div>
    </div>
  </div>
);

// Timeline content
const TimelineTabContent = () => (
  <div className="p-2 space-y-2">
    <div className="p-2 rounded hover:bg-accent cursor-pointer">
      <div className="text-sm font-medium">Fixed button styling</div>
      <div className="text-xs text-muted-foreground">2 minutes ago</div>
    </div>
    <div className="p-2 rounded hover:bg-accent cursor-pointer">
      <div className="text-sm font-medium">Added input validation</div>
      <div className="text-xs text-muted-foreground">15 minutes ago</div>
    </div>
    <div className="p-2 rounded hover:bg-accent cursor-pointer">
      <div className="text-sm font-medium">Updated dependencies</div>
      <div className="text-xs text-muted-foreground">1 hour ago</div>
    </div>
  </div>
);

// Right section with TabbedPanel
const RightSectionPanel = () => (
  <TabbedPanel
    tabs={[
      {
        value: 'outline',
        label: 'OUTLINE',
        icon: PanelRight,
        content: <OutlineTabContent />,
      },
      {
        value: 'timeline',
        label: 'TIMELINE',
        content: <TimelineTabContent />,
      },
    ]}
    defaultTab="outline"
    headerActions={{
      rightNavItems: [
        {
          name: 'refresh',
          icon: RefreshCw,
          onClick: () => console.log('Refresh'),
          tooltip: 'Refresh',
        },
        {
          name: 'collapse',
          icon: Maximize2,
          onClick: () => console.log('Collapse'),
          tooltip: 'Collapse',
        },
        {
          name: 'close',
          icon: X,
          onClick: () => console.log('Close'),
          tooltip: 'Close',
        },
      ],
    }}
    bodyClassName="p-0"
    headerClassName="bg-muted/10"
  />
);

export const Default: Story = {
  args: {
    leftNav,
    header: {
      className: "!h-[35px] ",
      left: (
        <div className="flex items-center gap-3 pr-3 pl-1">
          <div className="flex items-center gap-2">
             <Menubar className="border-0 bg-transparent p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1"  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New File <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New Window <MenubarShortcut>⇧⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Open File... <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Folder... <MenubarShortcut>⌘K ⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Recent <MenubarShortcut>⌃R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>Save All</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Close Editor <MenubarShortcut>⌘W</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Close Window <MenubarShortcut>⇧⌘W</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="flex items-center justify-center font-bold text-2xl">
              Invana Studio
            </div>
            <Separator orientation="vertical" className="h-5 ml-1" />
            <Menubar className="border-0 bg-transparent p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="text-sm px-2 py-1">File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New File <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New Window <MenubarShortcut>⇧⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Open File... <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Folder... <MenubarShortcut>⌘K ⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Recent <MenubarShortcut>⌃R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Save <MenubarShortcut>⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Save As... <MenubarShortcut>⇧⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>Save All</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Close Editor <MenubarShortcut>⌘W</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Close Window <MenubarShortcut>⇧⌘W</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm px-2 py-1">Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Cut <MenubarShortcut>⌘X</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Copy <MenubarShortcut>⌘C</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Paste <MenubarShortcut>⌘V</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Find <MenubarShortcut>⌘F</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Replace <MenubarShortcut>⌥⌘F</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Find in Files <MenubarShortcut>⇧⌘F</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Replace in Files <MenubarShortcut>⇧⌘H</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm px-2 py-1">Layout</MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Split Editor</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Split Right</MenubarItem>
                      <MenubarItem>Split Down</MenubarItem>
                      <MenubarItem>Split in Grid</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Toggle Sidebar <MenubarShortcut>⌘B</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Toggle Panel <MenubarShortcut>⌘J</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Toggle Auxiliary Bar
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Zen Mode <MenubarShortcut>⌘K Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Full Screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger className="text-sm px-2 py-1">Help</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Welcome</MenubarItem>
                  <MenubarItem>Show All Commands <MenubarShortcut>⇧⌘P</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Documentation</MenubarItem>
                  <MenubarItem>Release Notes</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Keyboard Shortcuts Reference</MenubarItem>
                  <MenubarItem>Video Tutorials</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>View License</MenubarItem>
                  <MenubarItem>Privacy Statement</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Check for Updates...</MenubarItem>
                  <MenubarItem>About</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
      ),
      center: (
        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative w-full">
            <Input 
              placeholder="design-kit - Button.tsx" 
              className="h-7 text-center text-sm bg-muted/50"
            />
          </div>
        </div>
      ),
      right: (
        <div className="flex items-center gap-1 px-3">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Settings className="h-4 w-4" />
          </Button>
          <Avatar className="h-6 w-6">
            <img src="https://github.com/shadcn.png" alt="User" />
          </Avatar>
        </div>
      ),
    },
    leftSection: {
      content: <LeftSectionPanel />,
      defaultSize: "250px",
      minSize: "150px",
      maxSize: "500px",
      collapsible: true,
    },
    mainSection: {
      content: <EditorContent />,
      defaultSize: "600px",
      minSize: "400px",
    },
    bottomSection: {
      content: <BottomSectionPanel />,
      defaultSize: "300px",
      minSize: "100px",
      maxSize: "600px",
      collapsible: true,
    },
    rightSection: {
      content: <RightSectionPanel />,
      defaultSize: "300px",
      minSize: "200px",
      maxSize: "600px",
      collapsible: true,
    },
    footer: {
      className: "!h-[25px]",
      left: (
        <div className="flex items-center gap-4 px-3">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>0</span>
            <span className="text-yellow-500">⚠ 3</span>
          </div>
        </div>
      ),
      right: (
        <div className="flex items-center gap-4 px-3 text-sm">
          <span>Ln 12, Col 45</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
          <span>Prettier</span>
        </div>
      ),
    },
    mainClassName: "h-[calc(100vh-55px)] ",
  },
};
