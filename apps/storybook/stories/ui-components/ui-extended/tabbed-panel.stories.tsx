import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import { 
  Folder, Search, GitBranch, FileCode, MessageSquare,
  Plus, Settings, MoreHorizontal, Maximize2, X,
  Terminal, AlertCircle, Bug, FileText, Database,
  RefreshCw, Filter, Copy, Trash2, ChevronRight,
  FolderOpen, File, Clock
} from 'lucide-react';

const meta = {
  title: 'ui-kit/ui-extended/TabbedPanel',
  component: TabbedPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabbedPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content components
const FileTree = () => (
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
    </div>
    <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
      <File className="h-4 w-4 text-gray-500" />
      <span className="text-sm">package.json</span>
    </div>
  </div>
);

const SearchResults = () => (
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
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-sm font-medium">Card.tsx</div>
        <div className="text-xs text-muted-foreground">Line 5: const Card = ...</div>
      </div>
    </div>
  </div>
);

const GitChanges = () => (
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

const ChatContent = () => (
  <div className="flex flex-col h-full">
    <div className="p-3 border-b">
      <div className="text-xs font-semibold text-muted-foreground uppercase">Recent Sessions</div>
    </div>
    <div className="flex-1 p-2 space-y-2">
      <div className="p-3 rounded-lg hover:bg-accent cursor-pointer">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
          <div className="flex-1">
            <div className="text-sm font-medium">Running a Python script in Docker</div>
            <div className="text-xs text-muted-foreground mt-1">Finished</div>
          </div>
          <div className="text-xs text-muted-foreground">Local • 3 wks</div>
        </div>
      </div>
      <button className="w-full text-sm text-center py-2 hover:bg-accent rounded">
        Show All Sessions
      </button>
    </div>
    <div className="flex-1 flex items-center justify-center flex-col p-6 text-center">
      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Build with Agent</h3>
      <p className="text-sm text-muted-foreground mb-4">AI responses may be inaccurate.</p>
      <button className="text-sm text-primary hover:underline">
        Generate Agent Instructions
      </button>
    </div>
  </div>
);

const ProblemsContent = () => (
  <div className="p-4">
    <div className="text-sm text-muted-foreground">
      No problems have been detected in the workspace.
    </div>
  </div>
);

const TerminalContent = () => (
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

// ===== BASIC EXAMPLES =====

/**
 * Basic tabbed panel with simple content.
 * Demonstrates the fundamental usage with multiple tabs.
 */
export const Basic: Story = {
  args: {
    tabs: [
      {
        value: 'tab1',
        label: 'Tab 1',
        content: <div className="p-4">Content for Tab 1</div>,
      },
      {
        value: 'tab2',
        label: 'Tab 2',
        content: <div className="p-4">Content for Tab 2</div>,
      },
      {
        value: 'tab3',
        label: 'Tab 3',
        content: <div className="p-4">Content for Tab 3</div>,
      },
    ],
    defaultTab: 'tab1',
    className: 'w-[600px] h-[400px]',
  },
};

/**
 * Tabs with icons.
 * Shows how to add icons to tab labels for better visual identification.
 */
export const WithIcons: Story = {
  args: {
    tabs: [
      {
        value: 'files',
        label: 'Files',
        icon: Folder,
        content: <div className="p-4">File browser content</div>,
      },
      {
        value: 'search',
        label: 'Search',
        icon: Search,
        content: <div className="p-4">Search results</div>,
      },
      {
        value: 'git',
        label: 'Git',
        icon: GitBranch,
        content: <div className="p-4">Git changes</div>,
      },
    ],
    defaultTab: 'files',
    className: 'w-[600px] h-[400px]',
  },
};

/**
 * Panel with header actions.
 * Demonstrates adding action buttons to the header using NavHorizontal props.
 */
export const WithHeaderActions: Story = {
  args: {
    tabs: [
      {
        value: 'explorer',
        label: 'Explorer',
        icon: Folder,
        content: <FileTree />,
      },
      {
        value: 'search',
        label: 'Search',
        icon: Search,
        content: <SearchResults />,
      },
    ],
    defaultTab: 'explorer',
    headerActions: {
      rightNavItems: [
        {
          name: 'refresh',
          icon: RefreshCw,
          onClick: () => console.log('Refresh'),
          tooltip: 'Refresh',
        },
        {
          name: 'filter',
          icon: Filter,
          onClick: () => console.log('Filter'),
          tooltip: 'Filter',
        },
        {
          name: 'expand',
          icon: Maximize2,
          onClick: () => console.log('Expand'),
          tooltip: 'Expand',
        },
        {
          name: 'close',
          icon: X,
          onClick: () => console.log('Close'),
          tooltip: 'Close',
        },
      ],
    },
    className: 'w-[600px] h-[400px]',
  },
};

// ===== REAL-WORLD EXAMPLES =====

/**
 * Explorer Panel (VS Code style).
 * Replicates the left sidebar of VS Code with file explorer, search, and git tabs.
 */
export const ExplorerPanel: Story = {
  args: {
    tabs: [
      {
        value: 'explorer',
        label: 'Explorer',
        icon: Folder,
        content: <FileTree />,
      },
      {
        value: 'search',
        label: 'Search',
        icon: Search,
        content: <SearchResults />,
      },
      {
        value: 'git',
        label: 'Source Control',
        icon: GitBranch,
        content: <GitChanges />,
      },
    ],
    defaultTab: 'explorer',
    headerActions: {
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
    },
    className: 'w-[350px] h-[600px]',
    bodyClassName: 'p-0',
  },
};

/**
 * Chat Panel (GitHub Copilot style).
 * Replicates the chat interface with recent sessions and build options.
 */
export const ChatPanel: Story = {
  args: {
    tabs: [
      {
        value: 'chat',
        label: 'CHAT',
        content: <ChatContent />,
      },
    ],
    defaultTab: 'chat',
    headerActions: {
      rightNavItems: [
        {
          name: 'new-chat',
          icon: Plus,
          onClick: () => console.log('New chat'),
          tooltip: 'New Chat',
        },
        {
          name: 'settings',
          icon: Settings,
          onClick: () => console.log('Settings'),
          tooltip: 'Settings',
        },
        {
          name: 'more',
          icon: MoreHorizontal,
          onClick: () => console.log('More'),
          tooltip: 'More Options',
        },
        {
          name: 'expand',
          icon: Maximize2,
          onClick: () => console.log('Expand'),
          tooltip: 'Expand',
          showSeperator: true,
        },
        {
          name: 'close',
          icon: X,
          onClick: () => console.log('Close'),
          tooltip: 'Close',
        },
      ],
    },
    className: 'w-[400px] h-[700px]',
    bodyClassName: 'p-0',
    headerClassName: 'bg-muted/30',
  },
};

/**
 * Bottom Panel (VS Code style).
 * Replicates the bottom panel with problems, terminal, output, etc.
 */
export const BottomPanel: Story = {
  args: {
    tabs: [
      {
        value: 'problems',
        label: 'PROBLEMS',
        content: <ProblemsContent />,
      },
      {
        value: 'output',
        label: 'OUTPUT',
        content: <div className="p-4 font-mono text-xs">Build output...</div>,
      },
      {
        value: 'debug',
        label: 'DEBUG CONSOLE',
        content: <div className="p-4 font-mono text-xs">Debug console...</div>,
      },
      {
        value: 'terminal',
        label: 'TERMINAL',
        content: <TerminalContent />,
      },
      {
        value: 'queries',
        label: 'QUERY RESULTS',
        content: <div className="p-4">Query results...</div>,
      },
    ],
    defaultTab: 'problems',
    headerActions: {
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
    },
    className: 'w-[1200px] h-[250px]',
    bodyClassName: 'p-0',
    headerClassName: 'bg-muted/20',
  },
};

/**
 * Database Explorer Panel.
 * Shows a database explorer with tables, queries, and history tabs.
 */
export const DatabaseExplorer: Story = {
  args: {
    tabs: [
      {
        value: 'tables',
        label: 'Tables',
        icon: Database,
        content: (
          <div className="p-2 space-y-1">
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">users</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">products</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">orders</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">categories</div>
          </div>
        ),
      },
      {
        value: 'queries',
        label: 'Queries',
        icon: FileText,
        content: (
          <div className="p-2 space-y-1">
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">Get all users</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">Recent orders</div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer text-sm">Top products</div>
          </div>
        ),
      },
      {
        value: 'history',
        label: 'History',
        icon: Clock,
        content: (
          <div className="p-2 space-y-2">
            <div className="p-2 rounded hover:bg-accent cursor-pointer">
              <div className="text-sm font-mono">SELECT * FROM users</div>
              <div className="text-xs text-muted-foreground mt-1">2 minutes ago</div>
            </div>
            <div className="p-2 rounded hover:bg-accent cursor-pointer">
              <div className="text-sm font-mono">SELECT COUNT(*) FROM orders</div>
              <div className="text-xs text-muted-foreground mt-1">5 minutes ago</div>
            </div>
          </div>
        ),
      },
    ],
    defaultTab: 'tables',
    headerActions: {
      rightNavItems: [
        {
          name: 'refresh',
          icon: RefreshCw,
          onClick: () => console.log('Refresh'),
          tooltip: 'Refresh',
        },
        {
          name: 'settings',
          icon: Settings,
          onClick: () => console.log('Settings'),
          tooltip: 'Settings',
        },
      ],
    },
    className: 'w-[400px] h-[500px]',
  },
};

/**
 * Customized Styling.
 * Demonstrates using className props to customize the panel appearance.
 */
export const CustomStyling: Story = {
  args: {
    tabs: [
      {
        value: 'tab1',
        label: 'Custom Tab 1',
        icon: FileCode,
        content: <div className="p-4 text-center">Styled content area</div>,
      },
      {
        value: 'tab2',
        label: 'Custom Tab 2',
        icon: Bug,
        content: <div className="p-4 text-center">Another styled area</div>,
      },
    ],
    defaultTab: 'tab1',
    headerActions: {
      rightNavItems: [
        {
          name: 'action',
          icon: Settings,
          onClick: () => console.log('Action'),
        },
      ],
    },
    className: 'w-[600px] h-[400px] border-2 border-primary/20 rounded-lg',
    headerClassName: 'bg-primary/5 border-b-2 border-primary/20',
    bodyClassName: 'bg-muted/20',
  },
};

/**
 * With Disabled Tab.
 * Shows how to disable specific tabs.
 */
export const WithDisabledTab: Story = {
  args: {
    tabs: [
      {
        value: 'enabled1',
        label: 'Enabled Tab',
        icon: FileCode,
        content: <div className="p-4">This tab is enabled</div>,
      },
      {
        value: 'disabled',
        label: 'Disabled Tab',
        icon: AlertCircle,
        content: <div className="p-4">This content won't show</div>,
        disabled: true,
      },
      {
        value: 'enabled2',
        label: 'Another Enabled',
        icon: Terminal,
        content: <div className="p-4">This tab is also enabled</div>,
      },
    ],
    defaultTab: 'enabled1',
    className: 'w-[600px] h-[400px]',
  },
};
