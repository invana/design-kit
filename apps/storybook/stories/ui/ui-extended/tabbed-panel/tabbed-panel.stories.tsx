import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  AlertCircle,
  Bug,
  Clock,
  Copy,
  Database,
  File,
  FileCode,
  FileText,
  Filter,
  Folder,
  FolderOpen,
  GitBranch,
  History,
  Info,
  Layers,
  Maximize2,
  MoreHorizontal,
  MousePointerClick,
  Network,
  Paintbrush,
  Plus,
  RefreshCw,
  ScanSearch,
  Search,
  Settings,
  Terminal as TerminalIcon,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  Button,
  DiffList,
  DiffRow,
  EmptyState,
  PropertyList,
  PropertyRow,
  SearchInput,
  SectionHeader,
  TabbedPanel,
  Terminal,
  TerminalLine,
  TimelineEntry,
  TimelineList,
  ToggleGroup,
  ToggleGroupItem,
  TreeView,
  type TreeItem,
} from '@invana/ui';

import RAW from '../../../../fixtures/ui-extended/tabbed-panel.json';
import { inline, json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

/** Icons are code, not data: the JSON names one, this map draws it. */
const ICONS: Record<string, React.ElementType> = {
  'alert-circle': AlertCircle,
  bug: Bug,
  clock: Clock,
  copy: Copy,
  database: Database,
  file: File,
  'file-code': FileCode,
  'file-text': FileText,
  filter: Filter,
  folder: Folder,
  'folder-open': FolderOpen,
  'git-branch': GitBranch,
  history: History,
  info: Info,
  layers: Layers,
  maximize: Maximize2,
  more: MoreHorizontal,
  pointer: MousePointerClick,
  network: Network,
  paintbrush: Paintbrush,
  plus: Plus,
  refresh: RefreshCw,
  scan: ScanSearch,
  search: Search,
  settings: Settings,
  terminal: TerminalIcon,
  trash: Trash2,
  users: Users,
  x: X,
};

interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

/** What a tab's body holds — each drawn by the kit component that owns the role. */
type Body =
  | { kind: 'empty'; title: string; description?: string }
  | { kind: 'window'; title: string }
  | { kind: 'tree'; items: TreeNode[] }
  | { kind: 'results'; title: string; count: string; rows: { label: string; value: string }[] }
  | { kind: 'changes'; title: string; count: string; rows: { op: string; kind: string; text: string }[] }
  | { kind: 'history'; entries: { when: string; title: string }[] }
  | { kind: 'properties'; title: string; note: string; rows: { label: string; value: string; mono?: boolean }[] }
  | { kind: 'find'; placeholder: string }
  | { kind: 'terminal'; cursor?: boolean; lines: { kind: 'prompt' | 'output' | 'comment'; text: string }[] }
  | {
      kind: 'chat';
      title: string;
      sessions: { when: string; title: string; note: string }[];
      empty: { title: string; description: string; action: string };
    };

interface Tab {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  body: Body;
}

interface Action {
  name: string;
  icon: string;
  separator?: boolean;
}

interface Variant {
  caption: string;
  wide?: boolean;
  width?: number;
  defaultTab: string;
  tabs: Tab[];
  actions?: Action[];
  headerContent?: { label: string; options: string[]; value: string };
  overflow?: boolean;
  keepMounted?: boolean;
  classes?: { className: string; headerClassName: string; bodyClassName: string };
}

const VARIANTS = RAW as unknown as Variant[];

interface Args {
  variant: string;
  /** The tab's `value`. */
  onTabChange: (value: string) => void;
  /** A header action's `onClick` — the story passes the action's name. */
  onAction: (name: string) => void;
  /** A tree row's `onClick(id, label)`. */
  onItemClick: (id: string | number, label: string) => void;
  /** The `headerContent` toggle's `onValueChange`. */
  onValueChange: (value: string) => void;
  /** The chat body's empty-state action. */
  onClick: (label: string) => void;
}

type Handlers = Omit<Args, 'variant'> & { log: Log };

function treeItems(nodes: TreeNode[], h: Handlers): TreeItem[] {
  return nodes.map((n) => {
    const Icon = n.icon ? ICONS[n.icon] : undefined;
    return {
      id: n.id,
      label: n.label,
      icon: Icon ? <Icon size={16} aria-hidden /> : undefined,
      children: n.children ? treeItems(n.children, h) : undefined,
      onClick: (id, label) => {
        h.onItemClick(id, label);
        h.log('onClick', [id, label]);
      },
    };
  });
}

/** A body that keeps what is typed — what `keepMounted` exists to preserve. */
function Find({ placeholder }: { placeholder: string }) {
  const [q, setQ] = React.useState('');
  return (
    <>
      <SearchInput value={q} onChange={setQ} placeholder={placeholder} />
      <EmptyState
        title={q ? `Searching for “${q}”` : 'Nothing searched yet'}
        description={q ? 'This survives a tab switch.' : undefined}
      />
    </>
  );
}

function TabBody({ body, span, h }: { body: Body; span: string; h: Handlers }) {
  switch (body.kind) {
    case 'empty':
      return <EmptyState title={body.title} description={body.description} />;
    case 'window':
      return <EmptyState title={body.title} description={`Read over the last ${span}.`} />;
    case 'tree':
      return <TreeView items={treeItems(body.items, h)} />;
    case 'results':
      return (
        <>
          <SectionHeader title={body.title} count={body.count} bare />
          <PropertyList labelWidth="auto">
            {body.rows.map((r) => (
              <PropertyRow key={r.label} label={r.label} mono>
                {r.value}
              </PropertyRow>
            ))}
          </PropertyList>
        </>
      );
    case 'changes':
      return (
        <>
          <SectionHeader title={body.title} count={body.count} bare />
          <DiffList>
            {body.rows.map((r) => (
              <DiffRow key={r.text} op={r.op} kind={r.kind}>
                {r.text}
              </DiffRow>
            ))}
          </DiffList>
        </>
      );
    case 'history':
      return (
        <TimelineList variant="compact">
          {body.entries.map((e) => (
            <TimelineEntry key={e.title} when={e.when} title={e.title} />
          ))}
        </TimelineList>
      );
    case 'properties':
      return (
        <>
          <SectionHeader title={body.title} count={body.note} bare />
          <PropertyList>
            {body.rows.map((r) => (
              <PropertyRow key={r.label} label={r.label} mono={r.mono}>
                {r.value}
              </PropertyRow>
            ))}
          </PropertyList>
        </>
      );
    case 'find':
      return <Find placeholder={body.placeholder} />;
    case 'terminal':
      return (
        <Terminal cursor={body.cursor}>
          {body.lines.map((l, i) => (
            <TerminalLine key={i} kind={l.kind}>
              {l.text}
            </TerminalLine>
          ))}
        </Terminal>
      );
    case 'chat':
      return (
        <>
          <SectionHeader title={body.title} count={String(body.sessions.length)} bare />
          <TimelineList variant="compact">
            {body.sessions.map((s) => (
              <TimelineEntry key={s.title} when={s.when} title={s.title}>
                {s.note}
              </TimelineEntry>
            ))}
          </TimelineList>
          <EmptyState
            title={body.empty.title}
            description={body.empty.description}
            actions={
              <Button
                variant="link"
                onClick={() => {
                  h.onClick(body.empty.action);
                  h.log('onClick', body.empty.action);
                }}
              >
                {body.empty.action}
              </Button>
            }
          />
        </>
      );
  }
}

/** Holds what a consumer holds: the active tab, the header control's value, whether the panel is open. */
function Live({ v, ...h }: { v: Variant } & Handlers) {
  const [tab, setTab] = React.useState(v.defaultTab);
  const [span, setSpan] = React.useState(v.headerContent?.value ?? '');
  const [open, setOpen] = React.useState(true);

  if (!open) {
    return (
      <EmptyState
        title="Panel closed"
        actions={
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            Reopen panel
          </Button>
        }
      />
    );
  }

  return (
    <TabbedPanel
      tabs={v.tabs.map((t) => ({
        value: t.value,
        label: t.label,
        icon: t.icon ? ICONS[t.icon] : undefined,
        disabled: t.disabled,
        content: <TabBody body={t.body} span={span} h={h} />,
      }))}
      activeTab={tab}
      onTabChange={(value) => {
        h.onTabChange(value);
        h.log('onTabChange', value);
        setTab(value);
      }}
      headerActions={v.actions?.map((a) => ({
        name: a.name,
        icon: ICONS[a.icon],
        tooltip: a.name,
        showSeperator: a.separator,
        onClick: () => {
          h.onAction(a.name);
          h.log('onClick', a.name);
          if (a.name === 'Close panel') setOpen(false);
        },
      }))}
      headerContent={
        v.headerContent ? (
          <ToggleGroup
            type="single"
            size="sm"
            aria-label={v.headerContent.label}
            value={span}
            onValueChange={(value: string) => {
              if (!value) return;
              h.onValueChange(value);
              h.log('onValueChange', value);
              setSpan(value);
            }}
          >
            {v.headerContent.options.map((o) => (
              <ToggleGroupItem key={o} value={o}>
                {o}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        ) : undefined
      }
      overflow={v.overflow}
      keepMounted={v.keepMounted}
      {...v.classes}
    />
  );
}

/** The Code tab: the tabs and actions as data, then the controlled call. */
function code(v: Variant) {
  const attrs = [
    '  tabs={tabs.map((t) => ({ ...t, icon: ICONS[t.icon], content: <TabBody body={t.body} /> }))}',
    '  activeTab={tab}',
    '  onTabChange={setTab}',
    v.actions
      ? '  headerActions={actions.map((a) => ({ ...a, icon: ICONS[a.icon], tooltip: a.name, onClick: () => onAction(a.name) }))}'
      : '',
    v.headerContent
      ? [
          '  headerContent={',
          `    <ToggleGroup type="single" size="sm" value={span} onValueChange={setSpan}>`,
          `      {${inline(v.headerContent.options)}.map((o) => <ToggleGroupItem key={o} value={o}>{o}</ToggleGroupItem>)}`,
          '    </ToggleGroup>',
          '  }',
        ].join('\n')
      : '',
    v.overflow ? '  overflow' : '',
    v.keepMounted ? '  keepMounted' : '',
    ...Object.entries(v.classes ?? {}).map(([k, c]) => `  ${k}="${c}"`),
  ].filter(Boolean);
  return `<TabbedPanel\n${attrs.join('\n')}\n/>`;
}

const meta = {
  title: 'UI/UI Extended/TabbedPanel',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { TabbedPanel, ToggleGroup, ToggleGroupItem } from '@invana/ui';",
              '// ICONS maps the names below to lucide icons; TabBody draws a body with kit components.',
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { tabs: v.tabs, ...(v.actions ? { actions: v.actions } : {}) },
              setup: [
                `// onTabChange receives the tab's value: ${json(v.tabs[1]?.value ?? v.tabs[0]!.value)}`,
                `const [tab, setTab] = React.useState(${json(v.defaultTab)});`,
                v.headerContent
                  ? `// onValueChange receives the option: ${json(v.headerContent.options[0])}\nconst [span, setSpan] = React.useState(${json(v.headerContent.value)});`
                  : '',
                v.actions ? `// onAction receives the action's name: ${json(v.actions[0]!.name)}` : '',
              ]
                .filter(Boolean)
                .join('\n'),
              call: code(v),
            })),
          ),
        ),
      },
    },
  },
  args: {
    variant: VARIANTS[0]!.caption,
    onTabChange: fn(),
    onAction: fn(),
    onItemClick: fn(),
    onValueChange: fn(),
    onClick: fn(),
  },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A panel whose views sit behind one `md` tab strip, from
 * `fixtures/ui-extended/tabbed-panel.json`: plain tabs, icons, a disabled tab, header actions,
 * a `headerContent` control every tab reads, `overflow` folding the strip into a `…` menu
 * (with `keepMounted` — type in Find, switch, come back), and the explorer, database, chat and
 * bottom panels an app shell puts it in. Every body is a kit component fed from the JSON.
 * The story holds the active tab: pick one and it is logged with its value; a header action logs
 * its name, and *Close panel* closes it. Panels are heavy, so one draws at a time — pick `All`
 * to see every one.
 */
export const TabbedPanelStory: Story = {
  name: 'TabbedPanel',
  render: ({ variant, ...handlers }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} {...handlers} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Basic' }));
    await step('Pick the second tab', async () => {
      await userEvent.click(cell.getByRole('tab', { name: 'Tab 2' }));
      await expect(args.onTabChange).toHaveBeenCalledWith('tab2');
      await expect(cell.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      await expect(cell.getByText('Content for Tab 2')).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onTabChange"tab2"');
    });
  },
};
