import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { AppLayoutV2 } from "@invana/themes/app-v2/layout";
import {
  NavVerticalProps,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Separator,
  TabbedPanel,
} from "@invana/ui";
import { Switch, Textarea } from "@invana/forms";
import {
  Bot,
  Boxes,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  Folder,
  FolderOpen,
  GitBranch,
  History,
  Home,
  Image as ImageIcon,
  Inbox,
  Layers,
  ListTree,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sliders,
  Sparkles,
  User,
  Wand2,
  Wrench,
} from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: "Themes/app-v2-chat",
  component: AppLayoutV2,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof AppLayoutV2>;

// ---------- Activity rail ----------
const leftNav: NavVerticalProps = {
  className: "",
  topNavItems: [
    { label: "Sessions", icon: MessageSquare, onClick: () => {}, tooltip: "Sessions" },
    { label: "Inbox", icon: Inbox, onClick: () => {}, tooltip: "Inbox" },
    { label: "History", icon: History, onClick: () => {}, tooltip: "History" },
    { label: "Search", icon: Search, onClick: () => {}, tooltip: "Search" },
  ],
  bottomNavItems: [
    { label: "Settings", icon: Settings, onClick: () => {}, tooltip: "Settings" },
    { label: "Account", icon: User, onClick: () => {}, tooltip: "Account" },
  ],
};

// ---------- Left: Sessions list ----------
type SessionItem = {
  title: string;
  meta: string;
  status?: "open" | "muted";
  avatars?: string[];
};

const SESSION_GROUPS: { name: string; items: SessionItem[] }[] = [
  {
    name: "agent-workspace",
    items: [
      { title: "Configure runtime environment variables", meta: "2 days ago", status: "open", avatars: ["a", "b"] },
      { title: "Access environment variables in Next.js", meta: "2 days ago", status: "open", avatars: ["b"] },
      { title: "Check license expiration handling for the runtime", meta: "3 wks ago", avatars: ["a"] },
      { title: "Fix missing task_runs database table", meta: "3 wks ago", avatars: ["c"] },
      { title: "Add days option to Term Length field", meta: "3 wks ago", avatars: ["a", "c"] },
    ],
  },
  {
    name: "canvas",
    items: [
      { title: "Document Circle and Rectangle node rendering", meta: "1 hr ago", avatars: ["d"] },
      { title: "/clear", meta: "1 hr ago", avatars: ["d"] },
      { title: "Set up git worktree for parallel features", meta: "2 hrs ago", avatars: ["d"] },
      { title: "/model", meta: "2 hrs ago", avatars: ["d"] },
      { title: "Fix minimap layout to use shape geometry", meta: "2 hrs ago", avatars: ["d"] },
    ],
  },
  {
    name: "design-kit",
    items: [{ title: "init", meta: "2 mins ago", status: "open", avatars: ["a"] }],
  },
];

const SessionAvatars: React.FC<{ ids?: string[] }> = ({ ids = [] }) => (
  <div className="flex -space-x-1.5">
    {ids.map((id, i) => (
      <Avatar key={i} className="h-4 w-4 ring-1 ring-background">
        <AvatarImage src={`https://github.com/${id === "a" ? "shadcn" : id === "b" ? "maxleiter" : id === "c" ? "evilrabbit" : "vercel"}.png`} />
        <AvatarFallback className="text-[8px]">{id.toUpperCase()}</AvatarFallback>
      </Avatar>
    ))}
  </div>
);

const SessionsList: React.FC = () => (
  <div className="flex flex-col">
    {SESSION_GROUPS.map((group) => (
      <div key={group.name} className="border-b last:border-b-0">
        <div className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          {group.name}
        </div>
        <ul>
          {group.items.map((item, i) => (
            <li
              key={i}
              className="group flex items-start gap-2 px-3 py-1.5 hover:bg-accent cursor-pointer"
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  item.status === "open" ? "bg-emerald-500" : "bg-muted-foreground/30"
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm leading-snug">{item.title}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <SessionAvatars ids={item.avatars} />
                  <span>·</span>
                  <span>{item.meta}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {group.items.length > 5 && (
          <div className="px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-accent cursor-pointer">
            +250 more
          </div>
        )}
      </div>
    ))}
    <div className="px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-accent cursor-pointer">
      +2 More Workspaces
    </div>
  </div>
);

// ---------- Left: Customizations footer ----------
const CUSTOMIZATIONS: { icon: React.ElementType; label: string; count?: number }[] = [
  { icon: Bot, label: "Agents" },
  { icon: Sparkles, label: "Skills", count: 11 },
  { icon: FileText, label: "Instructions", count: 2 },
  { icon: Wrench, label: "Hooks" },
  { icon: Boxes, label: "MCP Servers", count: 2 },
];

const CustomizationsPanel: React.FC = () => (
  <div className="border-t bg-muted/20">
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">
        Customizations
      </span>
      <ChevronDown className="h-3 w-3 text-muted-foreground" />
    </div>
    <ul className="pb-2">
      {CUSTOMIZATIONS.map(({ icon: Icon, label, count }) => (
        <li
          key={label}
          className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent cursor-pointer"
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1">{label}</span>
          {count !== undefined && (
            <span className="text-xs text-muted-foreground">{count}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const LeftSection: React.FC = () => (
  <div className="flex h-full flex-col">
    {/* Sessions header */}
    <div className="flex items-center justify-between border-b px-3 py-2">
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Sessions</span>
      </div>
      <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-xs">
        <Plus className="h-3 w-3" />
        New
      </Button>
    </div>
    <div className="flex-1 overflow-auto">
      <SessionsList />
    </div>
    <CustomizationsPanel />
  </div>
);

// ---------- Main: Chat canvas ----------
const ChatCanvas: React.FC = () => (
  <div className="flex h-full flex-col bg-background">
    {/* Top context bar */}
    <div className="flex items-center gap-2 border-b px-4 py-2 text-sm">
      <span className="text-muted-foreground">Working in</span>
      <Badge variant="secondary" className="gap-1">
        <Folder className="h-3 w-3" />
        design-kit
      </Badge>
      <span className="text-muted-foreground">with</span>
      <Badge variant="secondary" className="gap-1">
        <Sparkles className="h-3 w-3" />
        claude
      </Badge>
    </div>

    {/* Split: prompt (top) + canvas (bottom) */}
    <ResizablePanelGroup orientation="vertical" className="flex-1">
      <ResizablePanel defaultSize={30} minSize={15} className="!overflow-hidden">
        <div className="flex h-full w-full flex-col px-4 py-4">
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border bg-card shadow-sm">
            <Textarea
              placeholder="What will you create?"
              className="min-h-0 flex-1 resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between border-t px-3 py-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  Claude Sonnet 4.6
                  <span className="text-muted-foreground">· High</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs">
                  <Wand2 className="h-3.5 w-3.5" />
                  Edit Automatically
                  <Switch className="ml-1 scale-75" defaultChecked />
                </Button>
              </div>
              <Button size="sm" className="h-7 gap-1.5 px-3 text-xs">
                <ImageIcon className="h-3.5 w-3.5" />
                Attach
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70} minSize={20} className="bg-muted/10">
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          Canvas
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

// ---------- Right: Changes / Files ----------
const ChangesContent: React.FC = () => (
  <div className="p-2">
    <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
      No changes yet
    </div>
  </div>
);

const FILES_TREE: { name: string; icon: React.ElementType; color?: string; depth?: number }[] = [
  { name: "design-kit", icon: FolderOpen, color: "text-amber-500" },
  { name: ".github", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: ".turbo", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: ".vscode", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: "apps", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: "node_modules", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: "packages", icon: Folder, color: "text-amber-500", depth: 1 },
  { name: ".gitignore", icon: FileText, depth: 1 },
  { name: ".npmrc", icon: FileText, depth: 1 },
  { name: ".nvmrc", icon: FileText, depth: 1 },
  { name: "CLAUDE.md", icon: FileText, color: "text-blue-500", depth: 1 },
  { name: "package.json", icon: Code2, color: "text-yellow-600", depth: 1 },
  { name: "pnpm-lock.yaml", icon: FileText, depth: 1 },
  { name: "pnpm-workspace.yaml", icon: FileText, depth: 1 },
  { name: "README.md", icon: FileText, color: "text-blue-500", depth: 1 },
  { name: "turbo.json", icon: Code2, color: "text-yellow-600", depth: 1 },
];

const FilesContent: React.FC = () => (
  <div className="py-1">
    {FILES_TREE.map((f, i) => {
      const Icon = f.icon;
      return (
        <div
          key={i}
          className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-accent cursor-pointer text-sm"
          style={{ paddingLeft: `${(f.depth ?? 0) * 12 + 8}px` }}
        >
          {f.depth === 0 || f.icon === Folder || f.icon === FolderOpen ? (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          ) : (
            <span className="w-3" />
          )}
          <Icon className={`h-3.5 w-3.5 ${f.color ?? "text-muted-foreground"}`} />
          <span className="truncate">{f.name}</span>
        </div>
      );
    })}
  </div>
);

const RightSection: React.FC = () => (
  <TabbedPanel
    tabs={[
      { value: "changes", label: "Changes", icon: GitBranch, content: <ChangesContent /> },
      { value: "files", label: "Files", icon: ListTree, content: <FilesContent /> },
    ]}
    defaultTab="files"
    bodyClassName="p-0"
    headerClassName="bg-muted/10"
  />
);

// ---------- Header ----------
const Header: React.FC = () => (
  <div className="flex w-full items-center justify-between px-3">
    <div className="flex items-center gap-2">
      <Home className="h-4 w-4 text-muted-foreground" />
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm font-medium">design-kit</span>
      <Badge variant="outline" className="h-5 text-[10px]">
        agent
      </Badge>
    </div>
    <div className="flex items-center gap-1.5">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Layers className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Sliders className="h-4 w-4" />
      </Button>
      <Avatar className="h-7 w-7">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </div>
  </div>
);

// ---------- Story ----------
export const Default: Story = {
  args: {
    leftNav,
    header: {
      className: "!h-[40px]",
      left: <Header />,
    },
    leftSection: {
      content: <LeftSection />,
      defaultSize: "300px",
      minSize: "220px",
      maxSize: "480px",
      collapsible: true,
    },
    mainSection: {
      content: <ChatCanvas />,
      defaultSize: "700px",
      minSize: "400px",
    },
    rightSection: {
      content: <RightSection />,
      defaultSize: "280px",
      minSize: "200px",
      maxSize: "500px",
      collapsible: true,
    },
    footer: {
      className: "!h-[25px]",
      left: (
        <div className="flex items-center gap-4 px-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" /> main
          </span>
          <span>Claude Sonnet 4.6 · High</span>
        </div>
      ),
      right: (
        <div className="flex items-center gap-3 px-3 text-xs text-muted-foreground">
          <span>Agent mode</span>
          <span>Ready</span>
        </div>
      ),
    },
    mainClassName: "h-[calc(100vh-65px)]",
  },
};
