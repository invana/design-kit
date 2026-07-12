import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV2, type AppLayoutV2Props } from "@invana/themes/app-v2/layout";
import {
  NavVerticalProps, Avatar, AvatarFallback,
  AvatarImage, Button,
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarShortcut, MenubarSub,
  MenubarSubTrigger, MenubarSubContent, Separator, TabbedPanel
} from "@invana/ui";
import { Input } from "@invana/forms";
import {
  Folder, Search, Settings,
  Bell, User,
  FileCode, GitBranch, Bug, Package,
  AlertCircle, AlertTriangle,
  PanelRight, ChevronRight, File, FolderOpen,
  Menu, Plus, RefreshCw, X, Maximize2, Minimize2, Copy, Filter, Trash2,
  Camera
} from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: 'Themes/AppV2',
  component: AppLayoutV2,
  parameters: {
    layout: 'fullscreen',
  }
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

// Simple placeholder body for the lighter-weight sidebar panels
const SimplePanelText = ({ title, lines }: { title: string; lines: string[] }) => (
  <div className="p-3 space-y-2">
    <div className="text-sm font-medium">{title}</div>
    {lines.map((line, i) => (
      <p key={i} className="text-xs text-muted-foreground">{line}</p>
    ))}
  </div>
);

// Each activity-bar item maps to a sidebar panel definition. The key matches
// the nav item `name` so clicking an icon swaps the left panel content.
type LeftPanelKey =
  | 'Explorer' | 'Search' | 'Source Control' | 'Debug'
  | 'Extensions' | 'Settings' | 'Account';

const LEFT_PANELS: Record<LeftPanelKey, { label: string; icon: React.ElementType; content: React.ReactNode }> = {
  'Explorer': { label: 'EXPLORER', icon: Folder, content: <FileTreeContent /> },
  'Search': { label: 'SEARCH', icon: Search, content: <SearchResultsContent /> },
  'Source Control': { label: 'SOURCE CONTROL', icon: GitBranch, content: <GitChangesContent /> },
  'Debug': {
    label: 'RUN AND DEBUG',
    icon: Bug,
    content: <SimplePanelText title="Run and Debug" lines={["No configurations found.", "Create a launch.json file to start debugging."]} />,
  },
  'Extensions': {
    label: 'EXTENSIONS',
    icon: Package,
    content: <SimplePanelText title="Extensions" lines={["12 installed · 3 updates available.", "Search the marketplace to add more."]} />,
  },
  'Settings': {
    label: 'SETTINGS',
    icon: Settings,
    content: <SimplePanelText title="Settings" lines={["Manage user and workspace preferences.", "Theme, editor, and keybindings."]} />,
  },
  'Account': {
    label: 'ACCOUNT',
    icon: User,
    content: <SimplePanelText title="Account" lines={["Signed in as invana-user.", "Manage account and sync settings."]} />,
  },
};

// Shared props for panels that support maximize + close in their header
interface PanelChromeProps {
  /** Whether this panel is currently filling the main area */
  isMaximized: boolean;
  /** Toggle this panel between maximized and normal size */
  onToggleMaximize: () => void;
  /** Close/hide this panel */
  onClose: () => void;
}

// Maximize/restore toggle action for a panel header, followed by the close action
const panelChromeActions = ({ isMaximized, onToggleMaximize, onClose }: PanelChromeProps) => [
  {
    name: 'maximize',
    icon: isMaximized ? Minimize2 : Maximize2,
    onClick: onToggleMaximize,
    tooltip: isMaximized ? 'Restore Panel Size' : 'Maximize Panel',
  },
  {
    name: 'close',
    icon: X,
    onClick: onClose,
    tooltip: 'Close Panel',
  },
];

// Left section with TabbedPanel — content is driven by the active nav item
const LeftSectionPanel = ({ panelKey, isMaximized, onToggleMaximize, onClose }: PanelChromeProps & { panelKey: LeftPanelKey }) => {
  const panel = LEFT_PANELS[panelKey] ?? LEFT_PANELS['Explorer'];
  return (
    <TabbedPanel
      tabs={[
        {
          value: panelKey,
          label: panel.label,
          icon: panel.icon,
          content: panel.content,
        },
      ]}
      activeTab={panelKey}
      className="border-0"
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
          ...panelChromeActions({ isMaximized, onToggleMaximize, onClose }),
        ],
      }}
      bodyClassName="p-0"
      headerClassName="bg-muted/10"
    />
  );
};

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

${''}export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
const BottomSectionPanel = ({ isMaximized, onToggleMaximize, onClose }: PanelChromeProps) => (
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
    className="border-0"
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
          showSeperator: true,
        },
        ...panelChromeActions({ isMaximized, onToggleMaximize, onClose }),
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
const RightSectionPanel = ({ isMaximized, onToggleMaximize, onClose }: PanelChromeProps) => (
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
    className="border-0"
    headerActions={{
      rightNavItems: [
        {
          name: 'refresh',
          icon: RefreshCw,
          onClick: () => console.log('Refresh'),
          tooltip: 'Refresh',
          showSeperator: true,
        },
        ...panelChromeActions({ isMaximized, onToggleMaximize, onClose }),
      ],
    }}
    bodyClassName="p-0"
    headerClassName="bg-muted/10"
  />
);

export default meta;
type Story = StoryObj<typeof meta>;

type MaximizablePanel = 'left' | 'bottom' | 'right';

const AppV2Demo = () => {
  const [showLeft, setShowLeft] = React.useState(true);
  const [showBottom, setShowBottom] = React.useState(true);
  const [showRight, setShowRight] = React.useState(true);
  const [activePanel, setActivePanel] = React.useState<LeftPanelKey>('Explorer');
  // Which panel (if any) is maximized to fill the whole main area
  const [maximized, setMaximized] = React.useState<MaximizablePanel | null>(null);

  // Clicking an activity-bar icon opens its panel. Clicking the already-active
  // icon while the sidebar is open collapses it (VS Code behaviour).
  const openPanel = (panel: LeftPanelKey) => {
    if (showLeft && activePanel === panel) {
      setShowLeft(false);
    } else {
      setActivePanel(panel);
      setShowLeft(true);
    }
  };

  // Compact styling shared by footer status-bar nav items (fits the 25px bar)
  const STATUS_ITEM = { className: "!py-0 !px-2 !rounded-sm", iconClassName: "w-3.5 h-3.5" };

  const toggleMaximize = (panel: MaximizablePanel) =>
    setMaximized((cur) => (cur === panel ? null : panel));

  // Closing a panel also clears its maximized state
  const closePanel = (panel: MaximizablePanel, hide: () => void) => {
    setMaximized((cur) => (cur === panel ? null : cur));
    hide();
  };

  // Activity Bar (Left Nav - icon only navigation). Each icon selects the
  // matching sidebar panel; every item maps to an entry in LEFT_PANELS.
  const leftNav: NavVerticalProps = {
    className: "",
    topNavItems: [
      { name: "Explorer", icon: Folder, onClick: () => openPanel('Explorer'), tooltip: "Explorer" },
      { name: "Search", icon: Search, onClick: () => openPanel('Search'), tooltip: "Search" },
      { name: "Source Control", icon: GitBranch, onClick: () => openPanel('Source Control'), tooltip: "Source Control" },
      { name: "Debug", icon: Bug, onClick: () => openPanel('Debug'), tooltip: "Run and Debug" },
      { name: "Extensions", icon: Package, onClick: () => openPanel('Extensions'), tooltip: "Extensions" },
    ],
    bottomNavItems: [
      { name: "Settings", icon: Settings, onClick: () => openPanel('Settings'), tooltip: "Settings" },
      { name: "Account", icon: User, onClick: () => openPanel('Account'), tooltip: "Account" },
    ],
  };

  const layoutProps: AppLayoutV2Props = {
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
            <Separator orientation="vertical" className="h-5 my-2" />
            <div>{activePanel}</div>
            <Separator orientation="vertical" className="h-5 my-2" />
            <Menubar className="border-0 bg-transparent p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="  px-2 py-1">File</MenubarTrigger>
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
                <MenubarTrigger className=" px-2 py-1">Edit</MenubarTrigger>
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
                <MenubarTrigger className=" px-2 py-1">Layout</MenubarTrigger>
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
                  <MenubarItem onClick={() => setShowLeft((v) => !v)}>
                    Toggle Sidebar <MenubarShortcut>⌘B</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => setShowBottom((v) => !v)}>
                    Toggle Panel <MenubarShortcut>⌘J</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={() => setShowRight((v) => !v)}>
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
                <MenubarTrigger className=" px-2 py-1">Help</MenubarTrigger>
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
      // Icon actions expressed as nav items; the avatar cluster stays as
      // composed UI components (Avatar) rendered after the items.
      rightNavItems: [
        { name: "Notifications", icon: Bell, onClick: () => console.log('Notifications'), tooltip: "Notifications" },
        { name: "Settings", icon: Settings, onClick: () => console.log('Settings'), tooltip: "Settings" },
        { name: "Screenshot", icon: Camera, onClick: () => console.log('Screenshot'), tooltip: "Screenshot", showSeperator: true },
      ],
      right: (
        <div className="flex items-center gap-4 px-3">
          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    // When a panel is maximized it takes over the main area and the other
    // sections are hidden; otherwise sections render in their normal slots.
    leftSection:
      maximized === null && showLeft
        ? {
            content: (
              <LeftSectionPanel
                panelKey={activePanel}
                isMaximized={false}
                onToggleMaximize={() => toggleMaximize('left')}
                onClose={() => closePanel('left', () => setShowLeft(false))}
              />
            ),
            defaultSize: "250px",
            minSize: "150px",
            maxSize: "500px",
            collapsible: true,
          }
        : undefined,
    mainSection: {
      content:
        maximized === 'left' ? (
          <LeftSectionPanel
            panelKey={activePanel}
            isMaximized
            onToggleMaximize={() => toggleMaximize('left')}
            onClose={() => closePanel('left', () => setShowLeft(false))}
          />
        ) : maximized === 'bottom' ? (
          <BottomSectionPanel
            isMaximized
            onToggleMaximize={() => toggleMaximize('bottom')}
            onClose={() => closePanel('bottom', () => setShowBottom(false))}
          />
        ) : maximized === 'right' ? (
          <RightSectionPanel
            isMaximized
            onToggleMaximize={() => toggleMaximize('right')}
            onClose={() => closePanel('right', () => setShowRight(false))}
          />
        ) : (
          <EditorContent />
        ),
      defaultSize: "600px",
      minSize: "400px",
    },
    bottomSection:
      maximized === null && showBottom
        ? {
            content: (
              <BottomSectionPanel
                isMaximized={false}
                onToggleMaximize={() => toggleMaximize('bottom')}
                onClose={() => closePanel('bottom', () => setShowBottom(false))}
              />
            ),
            defaultSize: "300px",
            minSize: "100px",
            maxSize: "600px",
            collapsible: true,
          }
        : undefined,
    rightSection:
      maximized === null && showRight
        ? {
            content: (
              <RightSectionPanel
                isMaximized={false}
                onToggleMaximize={() => toggleMaximize('right')}
                onClose={() => closePanel('right', () => setShowRight(false))}
              />
            ),
            defaultSize: "300px",
            minSize: "200px",
            maxSize: "600px",
            collapsible: true,
          }
        : undefined,
    // Status bar expressed entirely as NavHorizontal items — no layout HTML.
    // Left items carry icons; right items are label-only (icon is optional).
    footer: {
      className: "!h-[25px] px-2 text-sm",
      leftNavItems: [
        { name: "Branch", icon: GitBranch, label: "main", ...STATUS_ITEM },
        { name: "Errors", icon: AlertCircle, label: "0", ...STATUS_ITEM },
        { name: "Warnings", icon: AlertTriangle, label: "3", ...STATUS_ITEM, iconClassName: "w-3.5 h-3.5 text-yellow-500" },
      ],
      rightNavItems: [
        { name: "Cursor Position", label: "Ln 12, Col 45", ...STATUS_ITEM },
        { name: "Indentation", label: "Spaces: 2", ...STATUS_ITEM },
        { name: "Encoding", label: "UTF-8", ...STATUS_ITEM },
        { name: "Language", label: "TypeScript React", ...STATUS_ITEM },
        { name: "Formatter", label: "Prettier", ...STATUS_ITEM },
      ],
    },
    mainClassName: "h-[calc(100vh-55px)] ",
  };

  return <AppLayoutV2 {...layoutProps} />;
};

export const Default: Story = {
  render: () => <AppV2Demo />,
};
