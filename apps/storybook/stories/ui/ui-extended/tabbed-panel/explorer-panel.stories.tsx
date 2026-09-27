import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabbedPanel } from '@invana/ui';
import {
  Folder,
  Search,
  GitBranch,
  FileCode,
  Plus,
  Maximize2,
  RefreshCw,
  ChevronRight,
  FolderOpen,
  File,
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
      <span className="text-base">src</span>
    </div>
    <div className="pl-4 space-y-1">
      <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
        <ChevronRight className="h-3 w-3" />
        <FolderOpen className="h-4 w-4 text-yellow-500" />
        <span className="text-base">components</span>
      </div>
      <div className="pl-4 space-y-1">
        <div className="flex items-center gap-1 p-1 rounded bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-base">Button.tsx</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-base">Input.tsx</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
          <FileCode className="h-4 w-4 text-blue-500" />
          <span className="text-base">Card.tsx</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 p-1 rounded hover:bg-accent cursor-pointer">
      <File className="h-4 w-4 text-gray-500" />
      <span className="text-base">package.json</span>
    </div>
  </div>
);

const SearchResults = () => (
  <div className="p-2 space-y-2">
    <div className="text-sm text-muted-foreground mb-2">3 results in 2 files</div>
    <div className="space-y-1">
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-base font-medium">Button.tsx</div>
        <div className="text-sm text-muted-foreground">Line 12: const Button = ...</div>
      </div>
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-base font-medium">Input.tsx</div>
        <div className="text-sm text-muted-foreground">Line 8: const Input = ...</div>
      </div>
      <div className="p-2 rounded hover:bg-accent cursor-pointer">
        <div className="text-base font-medium">Card.tsx</div>
        <div className="text-sm text-muted-foreground">Line 5: const Card = ...</div>
      </div>
    </div>
  </div>
);

const GitChanges = () => (
  <div className="p-2">
    <div className="text-sm font-semibold text-muted-foreground mb-2 uppercase">Changes (3)</div>
    <div className="space-y-1">
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-green-500">M</span>
        <FileCode className="h-4 w-4" />
        <span className="text-base">Button.tsx</span>
      </div>
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-green-500">M</span>
        <FileCode className="h-4 w-4" />
        <span className="text-base">Input.tsx</span>
      </div>
      <div className="flex items-center gap-2 p-1 rounded hover:bg-accent cursor-pointer">
        <span className="text-blue-500">A</span>
        <FileCode className="h-4 w-4" />
        <span className="text-base">Card.tsx</span>
      </div>
    </div>
  </div>
);

// ===== BASIC EXAMPLES =====

/**
 * Basic tabbed panel with simple content.
 * Demonstrates the fundamental usage with multiple tabs.
 */

export default meta;
type Story = StoryObj<typeof meta>;

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
    headerActions: [
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
    className: 'w-[350px] h-[600px]',
    bodyClassName: 'p-0',
  },
};

/**
 * Chat Panel (GitHub Copilot style).
 * Replicates the chat interface with recent sessions and build options.
 */
