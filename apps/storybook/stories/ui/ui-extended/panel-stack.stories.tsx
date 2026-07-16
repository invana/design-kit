import { Meta, StoryObj } from '@storybook/react-vite';
import { PanelStack, Badge } from '@invana/ui';
import {
  GitCommitVertical,
  RefreshCw,
  Check,
  MoreHorizontal,
  FileCode,
  FileText,
} from 'lucide-react';

/**
 * `PanelStack` — a vertical stack of collapsible, resizable panels in the style
 * of VS Code's Source Control view. Every section header stays visible;
 * expanding one fills the remaining column height, and when several are open
 * they share that height with a draggable divider between them ("show both
 * partially"). Each section collapses to just its header, independently.
 *
 * The stack fills the full height of its parent, so it lives inside a sized
 * container (here a fixed-height, fixed-width sidebar). Try collapsing
 * **Changes** to give **Graph** the whole column, or drag the divider between
 * them to rebalance.
 */
const meta: Meta<typeof PanelStack> = {
  title: 'UI/UI Extended/PanelStack',
  component: PanelStack,
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof PanelStack>;

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

const ChangesBody = () => (
  <div className="p-2">
    <input
      className="mb-2 w-full rounded border border-border bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
      placeholder="Message (⌘Enter to commit on &quot;main&quot;)"
      readOnly
    />
    <button className="mb-3 flex w-full items-center justify-center gap-2 rounded bg-primary py-1.5 text-sm font-medium text-primary-foreground">
      <Check className="h-4 w-4" /> Commit
    </button>
    <ul className="text-sm">
      {changedFiles.map((f) => (
        <li
          key={f.name}
          className="flex items-center gap-2 rounded px-1 py-1 hover:bg-accent/50"
        >
          <f.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-foreground">{f.name}</span>
          <span className="truncate text-xs text-muted-foreground">{f.dir}</span>
          <span className="ml-auto text-xs font-medium text-muted-foreground">
            {f.status}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const GraphBody = () => (
  <ul className="py-1 text-sm">
    {commits.map((c, i) => (
      <li
        key={i}
        className="flex items-center gap-2 px-2 py-1 hover:bg-accent/50"
      >
        <GitCommitVertical className="h-4 w-4 shrink-0 text-primary" />
        <span className="truncate text-foreground">{c}</span>
      </li>
    ))}
  </ul>
);

// A tiny header-action button — an icon in a hover target, click swallowed so
// it doesn't toggle the section.
const IconAction = ({ icon: Icon }: { icon: React.ElementType }) => (
  <button
    type="button"
    onClick={(e) => e.stopPropagation()}
    className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
  >
    <Icon className="h-3.5 w-3.5" />
  </button>
);

export const SourceControl: Story = {
  render: () => (
    <div className="h-[620px] w-[360px] overflow-hidden rounded-md border border-border bg-background">
      <PanelStack
        sections={[
          {
            id: 'changes',
            title: 'Changes',
            content: <ChangesBody />,
            actions: (
              <>
                <IconAction icon={Check} />
                <IconAction icon={RefreshCw} />
                <Badge variant="secondary" className="rounded-full px-1.5 py-0">
                  {changedFiles.length}
                </Badge>
              </>
            ),
          },
          {
            id: 'graph',
            title: 'Graph',
            content: <GraphBody />,
            actions: (
              <>
                <IconAction icon={RefreshCw} />
                <IconAction icon={MoreHorizontal} />
              </>
            ),
          },
        ]}
      />
    </div>
  ),
};
