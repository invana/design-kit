import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { PanelStack, Badge } from '@invana/ui';
import {
  GitCommitVertical,
  RefreshCw,
  Check,
  ArrowDownUp,
  Rows3,
  Filter,
  RotateCcw,
  FileCode,
  FileText,
  FolderGit2,
  GitBranch,
  Archive,
  Plus,
  Trash2,
  ArrowDownToLine,
  Cloud,
  CloudOff,
  MoreHorizontal,
} from 'lucide-react';

/**
 * `PanelStack` — a vertical stack of collapsible, resizable panels in the style
 * of VS Code's Source Control view. Every section header stays visible;
 * expanding one fills the remaining column height, and when several are open
 * they share that height with draggable dividers between them ("show both
 * partially"). Each section collapses to just its header, independently.
 *
 * The stack fills the full height of its parent, so it lives inside a sized
 * container (here a fixed-height, fixed-width sidebar). Five sections are
 * stacked below — **Changes** and **Graph** start expanded, the other three
 * start collapsed via `defaultCollapsed`. Expand **Branches** or **Stashes**
 * and the open sections share the column; drag a divider to rebalance.
 *
 * A section's right-hand chrome is `headerActions` — the same list of
 * `NavHorizontal` items `PanelContent` and `TabbedPanel` take, so a header is
 * described once and reads the same across the kit. Give an item `menuItems`
 * and it becomes a `…` dropdown. The whole row stays hidden until the header is hovered or
 * focused (`actionsOnHover`, on by default), so counts live in `title` where
 * they always read.
 *
 * Every menu here is live: **Graph** drives sort order, row density and a
 * release-commit filter; **Branches** toggles remotes; **Stashes** stashes,
 * applies and drops (a `destructive` item).
 */
const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof PanelStack>;

const repositories = [
  { name: 'design-kit', branch: 'feat/hifi-board-components', changes: 3 },
  { name: 'invana', branch: 'main', changes: 0 },
  { name: 'canvas', branch: 'fix/toolbar-density', changes: 7 },
];

const changedFiles = [
  { icon: FileCode, name: 'panel-stack.tsx', dir: 'packages/ui/src', status: 'U' },
  { icon: FileCode, name: 'index.ts', dir: 'packages/ui/src/components', status: 'M' },
  { icon: FileText, name: 'panel-stack.stories.tsx', dir: 'apps/storybook', status: 'U' },
];

const commits = [
  'release: v0.0.16',
  'docs(claude): require release.sh + --follow-tags for cutting releases',
  'release: v0.0.15',
  'docs(storybook): show bottomSpan badge on the bottom panel in AppV2',
  'feat(themes): add "main" bottomSpan to AppV2',
  'feat(themes): make leftNav optional in app-v1/app-v2',
  'release: v0.0.14',
  'ci(storybook): bump Storybook build to Node 22',
  'fix(themes): resolve lint findings surfaced by eslint 10 upgrade',
  'chore(deps): upgrade all dependencies to latest for testing',
  'feat(themes): let AppV2 bottom panel span left-main, main…',
  'fix(ui): narrow the resizable gutter to 4px',
  'fix(themes): use gutter dividers between AppV2 sections',
  'fix(ui): rework ResizableHandle for v4 and make TabbedPanel…',
  'feat(storybook): wire onClick handlers on streaming ChatSession',
  'feat(ui): support label-only nav items and drop hover on…',
  'release: v0.0.13',
];

const localBranches = [
  { name: 'feat/hifi-board-components', ahead: '3↑', current: true },
  { name: 'main', ahead: '', current: false },
  { name: 'feat/forms-object-field', ahead: '1↑ 2↓', current: false },
  { name: 'fix/panel-stack-menu', ahead: '5↑', current: false },
];

const remoteBranches = [
  { name: 'origin/main', ahead: '', current: false },
  { name: 'origin/feat/hifi-board-components', ahead: '', current: false },
];

const initialStashes = [
  { id: 'stash@{0}', message: 'WIP on feat/hifi-board-components: panel menus', when: '2 hours ago' },
  { id: 'stash@{1}', message: 'WIP on main: density token spike', when: 'yesterday' },
];

const RepositoriesBody = () => (
  <ul className="py-1">
    {repositories.map((r) => (
      <li
        key={r.name}
        className="flex items-center gap-2 px-2 py-1 hover:bg-accent/50"
      >
        <FolderGit2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate text-foreground">{r.name}</span>
        <span className="truncate text-meta text-muted-foreground">{r.branch}</span>
        {r.changes > 0 && (
          <Badge variant="secondary" className="ml-auto rounded-full px-1.5 py-0">
            {r.changes}
          </Badge>
        )}
      </li>
    ))}
  </ul>
);

const ChangesBody = () => (
  <div className="p-2">
    <input
      className="mb-2 w-full rounded border border-border bg-transparent px-2 py-1.5 text-foreground placeholder:text-muted-foreground"
      placeholder="Message (⌘Enter to commit on &quot;main&quot;)"
      readOnly
    />
    <button className="mb-3 flex w-full items-center justify-center gap-2 rounded bg-primary py-1.5 font-medium text-primary-foreground">
      <Check className="h-4 w-4" /> Commit
    </button>
    <ul>
      {changedFiles.map((f) => (
        <li
          key={f.name}
          className="flex items-center gap-2 rounded px-1 py-1 hover:bg-accent/50"
        >
          <f.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-foreground">{f.name}</span>
          <span className="truncate text-meta text-muted-foreground">{f.dir}</span>
          <span className="ml-auto text-meta font-medium text-muted-foreground">
            {f.status}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

type GraphView = { newestFirst: boolean; compact: boolean; hideReleases: boolean };

const defaultGraphView: GraphView = {
  newestFirst: true,
  compact: false,
  hideReleases: false,
};

const GraphBody = ({ view }: { view: GraphView }) => {
  const shown = commits.filter(
    (c) => !view.hideReleases || !c.startsWith('release:')
  );
  if (!view.newestFirst) shown.reverse();
  return (
    <ul className="py-1">
      {shown.map((c) => (
        <li
          key={c}
          className={`flex items-center gap-2 px-2 hover:bg-accent/50 ${
            view.compact ? 'py-0' : 'py-1'
          }`}
        >
          <GitCommitVertical className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate text-foreground">{c}</span>
        </li>
      ))}
    </ul>
  );
};

const BranchesBody = ({ showRemotes }: { showRemotes: boolean }) => (
  <ul className="py-1">
    {[...localBranches, ...(showRemotes ? remoteBranches : [])].map((b) => (
      <li
        key={b.name}
        className="flex items-center gap-2 px-2 py-1 hover:bg-accent/50"
      >
        <GitBranch
          className={`h-4 w-4 shrink-0 ${
            b.current ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
        <span
          className={`truncate ${
            b.current ? 'font-medium text-foreground' : 'text-foreground'
          }`}
        >
          {b.name}
        </span>
        {b.ahead && (
          <span className="ml-auto shrink-0 text-meta text-muted-foreground">
            {b.ahead}
          </span>
        )}
      </li>
    ))}
  </ul>
);

const StashesBody = ({ stashes }: { stashes: typeof initialStashes }) =>
  stashes.length === 0 ? (
    <p className="px-2 py-3 text-meta text-muted-foreground">
      No stashes. Use the header menu to stash the current changes.
    </p>
  ) : (
    <ul className="py-1">
      {stashes.map((s) => (
        <li
          key={s.id}
          className="flex items-center gap-2 px-2 py-1 hover:bg-accent/50"
        >
          <Archive className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-foreground">{s.message}</span>
          <span className="ml-auto shrink-0 text-meta text-muted-foreground">
            {s.when}
          </span>
        </li>
      ))}
    </ul>
  );

// The default header look (compact, uppercase, muted) plus a count that has to
// stay legible — so it belongs in `title`, not in the hover-revealed actions.
const Title = ({ children, count }: { children: string; count?: number }) => (
  <span className="flex min-w-0 items-center gap-2">
    <span className="truncate text-meta font-semibold uppercase tracking-wide">
      {children}
    </span>
    {count != null && (
      <Badge variant="secondary" className="rounded-full px-1.5 py-0">
        {count}
      </Badge>
    )}
  </span>
);

const SourceControlDemo = () => {
  const [view, setView] = useState<GraphView>(defaultGraphView);
  const [showRemotes, setShowRemotes] = useState(false);
  const [stashes, setStashes] = useState(initialStashes);
  const set = (patch: Partial<GraphView>) =>
    setView((prev) => ({ ...prev, ...patch }));

  return (
    <div className="h-[620px] w-[360px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'repositories',
            title: <Title count={repositories.length}>Repositories</Title>,
            content: <RepositoriesBody />,
            defaultCollapsed: true,
          },
          {
            id: 'changes',
            title: <Title count={changedFiles.length}>Changes</Title>,
            content: <ChangesBody />,
            headerActions: [
              { name: 'Commit', icon: Check, onClick: () => {} },
              { name: 'Refresh', icon: RefreshCw, onClick: () => {} },
            ],
          },
          {
            id: 'graph',
            title: <Title>Graph</Title>,
            content: <GraphBody view={view} />,
            headerActions: [
              { name: 'Refresh', icon: RefreshCw, onClick: () => {} },
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  {
                    id: 'sort',
                    label: view.newestFirst
                      ? 'Sort oldest first'
                      : 'Sort newest first',
                    icon: ArrowDownUp,
                    onSelect: () => set({ newestFirst: !view.newestFirst }),
                  },
                  {
                    id: 'density',
                    label: view.compact ? 'Comfortable rows' : 'Compact rows',
                    icon: Rows3,
                    onSelect: () => set({ compact: !view.compact }),
                  },
                  {
                    id: 'releases',
                    label: view.hideReleases
                      ? 'Show release commits'
                      : 'Hide release commits',
                    icon: Filter,
                    onSelect: () => set({ hideReleases: !view.hideReleases }),
                  },
                  {
                    id: 'reset',
                    label: 'Reset view',
                    icon: RotateCcw,
                    shortcut: '⌘R',
                    separatorBefore: true,
                    onSelect: () => setView(defaultGraphView),
                  },
                ],
              },
            ],
          },
          {
            id: 'branches',
            title: (
              <Title
                count={
                  localBranches.length +
                  (showRemotes ? remoteBranches.length : 0)
                }
              >
                Branches
              </Title>
            ),
            content: <BranchesBody showRemotes={showRemotes} />,
            defaultCollapsed: true,
            headerActions: [
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  {
                    id: 'remotes',
                    label: showRemotes
                      ? 'Hide remote branches'
                      : 'Show remote branches',
                    icon: showRemotes ? CloudOff : Cloud,
                    onSelect: () => setShowRemotes((v) => !v),
                  },
                  {
                    id: 'fetch',
                    label: 'Fetch all remotes',
                    icon: RefreshCw,
                    shortcut: '⌘⇧F',
                    disabled: !showRemotes,
                  },
                ],
              },
            ],
          },
          {
            id: 'stashes',
            title: (
              <Title count={stashes.length || undefined}>Stashes</Title>
            ),
            content: <StashesBody stashes={stashes} />,
            defaultCollapsed: true,
            headerActions: [
              {
                name: 'Stash current changes',
                icon: Plus,
                onClick: () =>
                  setStashes((prev) => [
                    {
                      id: `stash@{${prev.length}}`,
                      message: `WIP on feat/hifi-board-components: ${changedFiles.length} files`,
                      when: 'just now',
                    },
                    ...prev,
                  ]),
              },
              {
                name: 'More options',
                icon: MoreHorizontal,
                menuItems: [
                  {
                    id: 'apply',
                    label: 'Apply latest stash',
                    icon: ArrowDownToLine,
                    disabled: stashes.length === 0,
                    onSelect: () => setStashes((prev) => prev.slice(1)),
                  },
                  {
                    id: 'drop',
                    label: 'Drop all stashes',
                    icon: Trash2,
                    destructive: true,
                    separatorBefore: true,
                    disabled: stashes.length === 0,
                    onSelect: () => setStashes([]),
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export const SourceControl: Story = {
  render: () => <SourceControlDemo />,
};
