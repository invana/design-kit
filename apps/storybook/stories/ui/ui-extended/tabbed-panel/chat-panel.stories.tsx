import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import { 
  Folder, Search, GitBranch, FileCode, MessageSquare,
  Plus, Settings, MoreHorizontal, Maximize2, X,
  Terminal, AlertCircle, Bug, FileText, Database,
  RefreshCw, Filter, Copy, Trash2, ChevronRight,
  FolderOpen, File, Clock
} from 'lucide-react';

const meta: Meta<typeof TabbedPanel> = {
  title: 'UI/UI Extended/TabbedPanel',
  component: TabbedPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};


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

export default meta;
type Story = StoryObj<typeof meta>;

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
