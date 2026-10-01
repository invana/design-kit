import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Archive,
  ArrowDownToLine,
  ArrowDownUp,
  BookMarked,
  Bug,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderGit2,
  GitBranch,
  GitCommitVertical,
  History,
  Image,
  Info,
  Layers,
  Link2,
  ListChecks,
  ListTree,
  MoreHorizontal,
  Palette,
  Pause,
  Pin,
  PinOff,
  Play,
  Plus,
  Quote,
  RefreshCw,
  RotateCcw,
  ScrollText,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Workflow,
} from 'lucide-react';
import {
  Badge,
  Button,
  ButtonGroup,
  EmptyState,
  Eyebrow,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Legend,
  LegendItem,
  PanelStack,
  PropertyList,
  PropertyRow,
  Terminal,
  TerminalLine,
  TypographyMuted,
  type NavHorizontalItem,
  type NavMenuItem,
  type PanelStackHandle,
  type PanelStackSection,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/panel-stack.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log } from '../../../_story/variant-board';

/** JSON names → icon components; the kit ships no icon set. */
const ICONS: Record<string, React.ElementType> = {
  apply: ArrowDownToLine,
  archive: Archive,
  branch: GitBranch,
  bug: Bug,
  catalogue: BookMarked,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  cloud: Cloud,
  'cloud-off': CloudOff,
  commit: GitCommitVertical,
  copy: Copy,
  download: Download,
  external: ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  'file-code': FileCode,
  'file-json': FileJson,
  'file-sheet': FileSpreadsheet,
  'file-text': FileText,
  filter: Filter,
  history: History,
  image: Image,
  info: Info,
  layers: Layers,
  link: Link2,
  log: ScrollText,
  more: MoreHorizontal,
  outline: ListTree,
  palette: Palette,
  pause: Pause,
  pin: Pin,
  'pin-off': PinOff,
  plans: Workflow,
  play: Play,
  plus: Plus,
  quote: Quote,
  refresh: RefreshCw,
  repo: FolderGit2,
  reset: RotateCcw,
  runs: ListChecks,
  sliders: SlidersHorizontal,
  sort: ArrowDownUp,
  sparkles: Sparkles,
  trash: Trash2,
};

interface Row {
  id: string;
  label: string;
  description?: string;
  meta?: string;
  badge?: string;
  icon?: string;
  current?: boolean;
}

type Body =
  | { kind: 'items'; rows: Row[]; pages?: Row[][]; extra?: Row[]; toggleable?: boolean; hidden?: string[]; empty?: { title: string; description?: string } }
  | { kind: 'properties'; rows: { label: string; value: string; mono?: boolean }[] }
  | { kind: 'log'; lines: string[][] }
  | { kind: 'legend'; items: { label: string; color: string }[] }
  | { kind: 'text'; text: string }
  | { kind: 'empty'; title: string; description?: string };

/** What a header action or menu entry does in this story — what a consumer's handler would. */
type Effect = 'page-previous' | 'page-next' | 'reset' | 'show-all' | 'clear-rows' | 'shift-row' | 'add-row';

interface MenuEntry {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  destructive?: boolean;
  separatorBefore?: boolean;
  effect?: Effect;
  /** Hide (or show again) the row with this id. */
  hide?: string;
  /** The entry is a switch: its label once on. */
  toggle?: { label?: string; icon?: string };
  /** Disabled unless the section has rows, hidden rows, or this toggle is on. */
  enabledWhen?: string;
}

interface Action {
  id: string;
  name: string;
  label?: string;
  icon?: string;
  effect?: Effect;
  add?: Row;
  toggle?: { name?: string; icon?: string };
  menu?: MenuEntry[];
}

interface Section {
  id: string;
  title: string | { text: string; count?: 'rows'; badge?: string; tone?: 'destructive' | 'warning'; icon?: string };
  icon?: string;
  defaultCollapsed?: boolean;
  defaultSize?: string;
  minSize?: string;
  actionsOnHover?: boolean;
  /** Toggle id → how it changes the rows: reversed, a prefix dropped, `extra` rows added. */
  view?: Record<string, 'reverse' | 'extra' | { dropPrefix: string }>;
  actions?: Action[];
  body: Body;
}

interface StackVariant {
  caption: string;
  width: number;
  height: number;
  withHandle?: boolean;
  headerHeight?: number;
  /** Only on the cell whose subject is className passthrough. */
  classes?: { className?: string; headerClassName?: string; bodyClassName?: string };
  /** Buttons outside the stack that open a section through `stackRef`. */
  outside?: { section: string; label: string }[];
  sections: Section[];
}

const VARIANTS = DATA as unknown as StackVariant[];

interface Args {
  variant: string;
  onCollapsedChange: (collapsed: Record<string, boolean>) => void;
  onClick: (section: string, id: string) => void;
  onSelect: (section: string, id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/PanelStack',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { PanelStack, type PanelStackHandle } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { sections: v.sections.map(({ body: _body, view: _view, ...s }) => s) },
              setup: [
                '// Each section becomes { id, title, icon: ICONS[icon], content, headerActions } —',
                '// content is its body (an ItemGroup of Items, a PropertyList, a Terminal, a Legend…);',
                '// headerActions are NavHorizontal items: { name, icon, onClick } or { name, icon, menuItems: [{ id, label, onSelect }] }.',
                '// onCollapsedChange receives the whole map: { "changes": false, "graph": false, "stashes": true }.',
                'const onCollapsedChange = (collapsed) => saveLayout(collapsed);',
                v.outside ? 'const stack = React.useRef<PanelStackHandle>(null);\n// A route opens a drawer: stack.current?.expand("runs")' : '',
              ]
                .filter(Boolean)
                .join('\n'),
              call: jsx('PanelStack', {
                sections: 'sections.map(toSection)',
                stackRef: v.outside ? 'stack' : undefined,
                withHandle: v.withHandle ? 'true' : undefined,
                headerHeight: v.headerHeight ? String(v.headerHeight) : undefined,
                className: v.classes?.className ? { literal: v.classes.className } : undefined,
                headerClassName: v.classes?.headerClassName ? { literal: v.classes.headerClassName } : undefined,
                bodyClassName: v.classes?.bodyClassName ? { literal: v.classes.bodyClassName } : undefined,
                onCollapsedChange: 'onCollapsedChange',
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: VARIANTS[0].caption, onCollapsedChange: fn(), onClick: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const fill = (s: string, page: number, pages: number) =>
  s.replace('{page}', String(page + 1)).replace('{pages}', String(pages));

/** The state a consumer holds around a stack: rows, switches, pages, hidden rows, selection. */
function Live({ v, log, onCollapsedChange, onClick, onSelect }: { v: StackVariant; log: Log } & Omit<Args, 'variant'>) {
  const stack = React.useRef<PanelStackHandle>(null);
  const [rows, setRows] = React.useState(() =>
    Object.fromEntries(v.sections.map((s) => [s.id, s.body.kind === 'items' ? s.body.rows : []])),
  );
  const [hidden, setHidden] = React.useState<Record<string, string[]>>(() =>
    Object.fromEntries(v.sections.map((s) => [s.id, s.body.kind === 'items' ? (s.body.hidden ?? []) : []])),
  );
  const [on, setOn] = React.useState<Record<string, boolean>>({});
  const [page, setPage] = React.useState<Record<string, number>>({});
  const [selected, setSelected] = React.useState<Record<string, string>>({});

  const isOn = (s: Section, id: string) => !!on[`${s.id}:${id}`];
  const flip = (s: Section, id: string) => setOn((o) => ({ ...o, [`${s.id}:${id}`]: !o[`${s.id}:${id}`] }));
  const toggleHidden = (s: Section, id: string) =>
    setHidden((h) => ({ ...h, [s.id]: h[s.id].includes(id) ? h[s.id].filter((x) => x !== id) : [...h[s.id], id] }));

  const pagesOf = (s: Section) => (s.body.kind === 'items' ? (s.body.pages?.length ?? 0) : 0);

  const run = (s: Section, effect: Effect | undefined, add?: Row) => {
    const last = pagesOf(s) - 1;
    if (effect === 'page-previous') setPage((p) => ({ ...p, [s.id]: Math.max(0, (p[s.id] ?? 0) - 1) }));
    if (effect === 'page-next') setPage((p) => ({ ...p, [s.id]: Math.min(last, (p[s.id] ?? 0) + 1) }));
    if (effect === 'reset') setOn((o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith(`${s.id}:`))));
    if (effect === 'show-all') setHidden((h) => ({ ...h, [s.id]: [] }));
    if (effect === 'clear-rows') setRows((r) => ({ ...r, [s.id]: [] }));
    if (effect === 'shift-row') setRows((r) => ({ ...r, [s.id]: r[s.id].slice(1) }));
    if (effect === 'add-row' && add)
      setRows((r) => ({ ...r, [s.id]: [{ ...add, id: `${add.id}-${r[s.id].length}` }, ...r[s.id]] }));
  };

  /** The rows a section shows now, after its page, its switches and its hidden set. */
  const shown = (s: Section): Row[] => {
    if (s.body.kind !== 'items') return [];
    let out = s.body.pages ? s.body.pages[page[s.id] ?? 0] : rows[s.id];
    for (const [id, how] of Object.entries(s.view ?? {})) {
      if (!isOn(s, id)) continue;
      if (how === 'reverse') out = [...out].reverse();
      else if (how === 'extra') out = [...out, ...(s.body.extra ?? [])];
      else out = out.filter((r) => !r.label.startsWith(how.dropPrefix));
    }
    return s.body.toggleable ? out : out.filter((r) => !hidden[s.id].includes(r.id));
  };

  const enabled = (s: Section, when?: string) =>
    !when || (when === 'rows' ? rows[s.id].length > 0 : when === 'hidden' ? hidden[s.id].length > 0 : isOn(s, when));

  const headerActions = (s: Section): NavHorizontalItem[] =>
    (s.actions ?? []).map((a) => {
      const flipped = a.toggle && isOn(s, a.id);
      const p = page[s.id] ?? 0;
      const icon = ICONS[(flipped && a.toggle?.icon) || a.icon || ''];
      const name = fill((flipped && a.toggle?.name) || a.name, p, pagesOf(s));
      if (a.menu)
        return {
          name,
          icon,
          menuItems: a.menu.map<NavMenuItem>((m) => {
            const mOn = m.hide ? hidden[s.id].includes(m.hide) : isOn(s, m.id);
            return {
              id: m.id,
              label: (m.toggle && mOn && m.toggle.label) || m.label,
              icon: ICONS[(m.toggle && mOn && m.toggle.icon) || m.icon || ''],
              shortcut: m.shortcut,
              destructive: m.destructive,
              separatorBefore: m.separatorBefore,
              disabled: !enabled(s, m.enabledWhen),
              onSelect: () => {
                onSelect(s.id, m.id);
                log('onSelect', { section: s.id, item: m.id });
                if (m.hide) toggleHidden(s, m.hide);
                else if (m.toggle) flip(s, m.id);
                run(s, m.effect);
              },
            };
          }),
        };
      const atEdge =
        (a.effect === 'page-previous' && p === 0) || (a.effect === 'page-next' && p === pagesOf(s) - 1);
      return {
        key: a.id,
        name,
        icon,
        label: a.label ? fill(a.label, p, pagesOf(s)) : undefined,
        disabled: atEdge,
        onClick:
          a.label && !a.icon
            ? undefined
            : () => {
                onClick(s.id, a.id);
                log('onClick', { section: s.id, action: a.id });
                if (a.toggle) flip(s, a.id);
                run(s, a.effect, a.add);
              },
      };
    });

  const title = (s: Section): React.ReactNode => {
    if (typeof s.title === 'string') return s.title;
    const t = s.title;
    const count = t.count === 'rows' ? shown(s).length : undefined;
    const TitleIcon = t.icon ? ICONS[t.icon] : undefined;
    const tag = count ?? t.badge;
    return (
      <Eyebrow
        aside={
          tag != null ? (
            <Badge variant={t.tone ? 'soft' : 'secondary'} tone={t.tone} size="xs">
              {tag}
            </Badge>
          ) : undefined
        }
      >
        {TitleIcon ? <TitleIcon aria-hidden /> : null}
        {t.text}
      </Eyebrow>
    );
  };

  const content = (s: Section): React.ReactNode => {
    const b = s.body;
    switch (b.kind) {
      case 'items': {
        const list = shown(s);
        if (!list.length && b.empty) return <EmptyState title={b.empty.title} description={b.empty.description} />;
        return (
          <ItemGroup aria-label={typeof s.title === 'string' ? s.title : s.title.text}>
            {list.map((r) => {
              const Icon = r.icon ? ICONS[r.icon] : undefined;
              const off = hidden[s.id].includes(r.id);
              return (
                <Item
                  key={r.id}
                  role="listitem"
                  size="xs"
                  selected={selected[s.id] === r.id || (r.current && selected[s.id] === undefined)}
                  onClick={() => {
                    onClick(s.id, r.id);
                    log('onClick', { section: s.id, row: r.id });
                    setSelected((sel) => ({ ...sel, [s.id]: r.id }));
                  }}
                >
                  {b.toggleable ? (
                    <ItemMedia>
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label={`${off ? 'Show' : 'Hide'} ${r.label}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onClick(s.id, `toggle:${r.id}`);
                          log('onClick', { section: s.id, toggle: r.id, hidden: !off });
                          toggleHidden(s, r.id);
                        }}
                      >
                        {off ? <EyeOff /> : <Eye />}
                      </Button>
                    </ItemMedia>
                  ) : Icon ? (
                    <ItemMedia>
                      <Icon aria-hidden />
                    </ItemMedia>
                  ) : null}
                  <ItemContent>
                    <ItemTitle>{r.label}</ItemTitle>
                    {r.description ? <ItemDescription>{r.description}</ItemDescription> : null}
                  </ItemContent>
                  {r.meta || r.badge || off ? (
                    <ItemActions>
                      {r.badge ? (
                        <Badge variant="secondary" size="xs">
                          {r.badge}
                        </Badge>
                      ) : (
                        <ItemDescription>{off ? 'hidden' : r.meta}</ItemDescription>
                      )}
                    </ItemActions>
                  ) : null}
                </Item>
              );
            })}
          </ItemGroup>
        );
      }
      case 'properties':
        return (
          <PropertyList labelWidth="auto">
            {b.rows.map((r) => (
              <PropertyRow key={r.label} label={r.label} mono={r.mono}>
                {r.value}
              </PropertyRow>
            ))}
          </PropertyList>
        );
      case 'log':
        return (
          <Terminal columnTemplate="auto auto minmax(0,1fr)" cursor={!!s.actions?.some((a) => a.id === 'running') && !isOn(s, 'running')}>
            {b.lines.map((l) => (
              <TerminalLine key={l.join(' ')} level={l[1]} columns={l} />
            ))}
          </Terminal>
        );
      case 'legend':
        return (
          <Legend orientation="column">
            {b.items.map((i) => (
              <LegendItem key={i.label} color={i.color} label={i.label} />
            ))}
          </Legend>
        );
      case 'text':
        return <TypographyMuted>{b.text}</TypographyMuted>;
      case 'empty':
        return <EmptyState title={b.title} description={b.description} />;
    }
  };

  const sections: PanelStackSection[] = v.sections.map((s) => ({
    id: s.id,
    title: title(s),
    icon: s.icon ? ICONS[s.icon] : undefined,
    defaultCollapsed: s.defaultCollapsed,
    defaultSize: s.defaultSize,
    minSize: s.minSize,
    actionsOnHover: s.actionsOnHover,
    headerActions: s.actions ? headerActions(s) : undefined,
    content: content(s),
  }));

  const stackEl = (
    <PanelStack
      sections={sections}
      stackRef={stack}
      withHandle={v.withHandle}
      headerHeight={v.headerHeight}
      className={v.classes?.className}
      headerClassName={v.classes?.headerClassName}
      bodyClassName={v.classes?.bodyClassName}
      onCollapsedChange={(collapsed) => {
        onCollapsedChange(collapsed);
        log('onCollapsedChange', collapsed);
      }}
    />
  );

  return (
    <>
      {v.outside ? (
        <ButtonGroup>
          {v.outside.map((o) => (
            <Button
              key={o.section}
              size="sm"
              variant="outline"
              onClick={() => {
                log('expand', o.section);
                stack.current?.expand(o.section);
              }}
            >
              {o.label}
            </Button>
          ))}
        </ButtonGroup>
      ) : null}
      {/* A stack fills its parent's height; the kit has no sized frame, so the cell gives it one. */}
      <div style={{ height: v.height }}>{stackEl}</div>
    </>
  );
}

/**
 * A vertical stack of collapsible, resizable panels — VS Code's view container — from
 * `fixtures/ui-extended/panel-stack.json`. Every header stays visible; open sections share the
 * column with draggable dividers. Headers take `headerActions` (the `NavHorizontal` item list
 * `PanelContent` and `TabbedPanel` take), quiet until hovered unless `actionsOnHover: false`;
 * counts go in `title` where they always read. Collapsed state is **reported, not dictated**:
 * `onCollapsedChange` gets the whole map, and `stackRef` is how something outside opens one.
 * Every menu is live — sort, filter, show remotes, stash, drop, pin, page — and logged.
 */
export const PanelStackStory: Story = {
  name: 'PanelStack',
  render: ({ variant, ...handlers }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} log={log} {...handlers} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Source control' }));
    await step('Picking a changed file selects it', async () => {
      await userEvent.click(cell.getByText('index.ts'));
      await expect(args.onClick).toHaveBeenCalledWith('changes', 'index.ts');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('{ "section": "changes", "row": "index.ts" }');
    });
    await step('Opening a collapsed section reports the whole map', async () => {
      await userEvent.click(cell.getByText('Stashes'));
      await waitFor(() => expect(args.onCollapsedChange).toHaveBeenCalled());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"stashes": false');
    });
  },
};
