import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Badge,
  Button,
  PanelBox,
  PanelContent,
  PropertyList,
  PropertyRow,
  SectionHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TimelineEntry,
  TimelineList,
  TypographyMuted,
  type NavHorizontalItem,
} from '@invana/ui';
import { ChevronsRight, Database, Filter, MoreHorizontal, Pin, RefreshCw, X } from 'lucide-react';

import FIXTURE from '../../../../fixtures/ui-extended/panel-content.json';
import { inline, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log } from '../../../_story/variant-grid';

/** The fixture's shape: one panel, or a column of them (`stack`). */
interface Action {
  name: string;
  icon: string;
  menu?: { id: string; label: string; shortcut?: string; destructive?: boolean; separatorBefore?: boolean }[];
}
interface Body {
  text?: string;
  events?: { when: string; text: string }[];
  labelWidth?: number;
  properties?: { label: string; value: string; mono?: boolean }[];
  table?: { columns: string[]; rows: string[][] };
  sections?: string[];
}
interface Panel {
  titleText?: string;
  title?: { icon?: string; text: string; count?: string; status?: string };
  actions?: Action[];
  actionsOnHover?: boolean;
  footer?: { note?: string; buttons: { label: string; variant?: string }[] };
  classes?: { className: string; headerClassName: string; bodyClassName: string; footerClassName: string };
  body?: Body;
}
interface Variant extends Panel {
  caption: string;
  height: number;
  width?: number;
  narrow?: boolean;
  stack?: Panel[];
}

const VARIANTS = FIXTURE as Variant[];

/** JSON names an icon; the story holds the glyph. */
const ICONS: Record<string, React.ElementType> = {
  x: X,
  hide: ChevronsRight,
  refresh: RefreshCw,
  pin: Pin,
  more: MoreHorizontal,
  filter: Filter,
  database: Database,
};
const ICON_NAMES: Record<string, string> = {
  x: 'X',
  hide: 'ChevronsRight',
  refresh: 'RefreshCw',
  pin: 'Pin',
  more: 'MoreHorizontal',
  filter: 'Filter',
  database: 'Database',
};

interface Args {
  variant: string;
  /** A header action or a footer button — its name. */
  onAction: (name: string) => void;
  /** A row of an overflow menu, or a row of the body — its id. */
  onSelect: (id: string) => void;
}

function actionsCode(actions: Action[]) {
  return [
    '[',
    ...actions.map((a) =>
      a.menu
        ? `  { name: "${a.name}", icon: ${ICON_NAMES[a.icon]}, menuItems: ${inline(a.menu).slice(0, -1)}.map((m) => ({ ...m, onSelect: () => onSelect(m.id) })) },`
        : `  { name: "${a.name}", icon: ${ICON_NAMES[a.icon]}, onClick: () => onAction("${a.name}") },`,
    ),
    ']',
  ].join('\n');
}

function panelCode(p: Panel) {
  const attrs: string[] = [];
  if (p.titleText) attrs.push(`titleText="${p.titleText}"`);
  if (p.title)
    attrs.push(
      `title={<>${p.title.icon ? `<${ICON_NAMES[p.title.icon]} size={14} /> ` : ''}${p.title.text}${p.title.status ? ` <Badge variant="soft" tone="success" size="xs">${p.title.status}</Badge>` : ''}</>}`,
    );
  if (p.title?.count) attrs.push(`count="${p.title.count}"`);
  if (p.actionsOnHover) attrs.push('actionsOnHover');
  if (p.actions) attrs.push(`headerActions={${actionsCode(p.actions).split('\n').join('\n  ')}}`);
  if (p.classes) Object.entries(p.classes).forEach(([k, v]) => attrs.push(`${k}="${v}"`));
  if (p.footer)
    attrs.push(
      `footerContent={<>${p.footer.note ? `<TypographyMuted>${p.footer.note}</TypographyMuted>` : ''}${p.footer.buttons
        .map((b) => `<Button${b.variant ? ` variant="${b.variant}"` : ''} size="sm" onClick={() => onAction("${b.label}")}>${b.label}</Button>`)
        .join('')}</>}`,
    );
  const b = p.body ?? {};
  const body = b.text
    ? `<TypographyMuted>${b.text}</TypographyMuted>`
    : b.events
      ? '<TimelineList variant="compact">\n    {events.map((e, i) => <TimelineEntry key={i} when={e.when}>{e.text}</TimelineEntry>)}\n  </TimelineList>'
      : b.properties
        ? `<PropertyList labelWidth={${b.labelWidth}}>\n    {properties.map((p) => <PropertyRow key={p.label} label={p.label} mono={p.mono}>{p.value}</PropertyRow>)}\n  </PropertyList>`
        : b.table
          ? '<Table seamless>…{rows.map((r) => <TableRow key={r[0]} onClick={() => onSelect(r[0])}>…</TableRow>)}</Table>'
          : '{sections.map((s) => <SectionHeader key={s} title={s} />)}';
  return `<PanelContent\n  ${attrs.join('\n  ')}\n>\n  ${body}\n</PanelContent>`;
}

function dataOf(p: Panel) {
  const b = p.body ?? {};
  return b.events
    ? { events: b.events }
    : b.properties
      ? { properties: b.properties }
      : b.table
        ? { rows: b.table.rows }
        : b.sections
          ? { sections: b.sections }
          : {};
}

const meta = {
  title: 'UI/UI Extended/PanelContent',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Badge, Button, PanelContent, PropertyList, PropertyRow, SectionHeader, Table, TableRow, TimelineEntry, TimelineList, TypographyMuted } from '@invana/ui';",
              "import { ChevronsRight, Database, Filter, MoreHorizontal, Pin, RefreshCw, X } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: (v.stack ?? [v]).reduce<Record<string, unknown>>((d, p) => ({ ...d, ...dataOf(p) }), {}),
              setup:
                '// The panel fills its parent\'s height: give it a bounded track.\n// onAction receives an action\'s name ("Close panel" hides the panel); onSelect a menu row\'s id.\nconst onAction = (name) => {};\nconst onSelect = (id) => {};',
              call: (v.stack ?? [v]).map(panelCode).join('\n\n'),
            })),
          ),
        ),
      },
    },
  },
  // Twelve panels, each a bounded scroller: draw one at a time.
  args: { variant: VARIANTS[0].caption, onAction: fn(), onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

type Handlers = { log: Log } & Pick<Args, 'onAction' | 'onSelect'>;

function PanelBody({ body, log, onSelect }: { body: Body } & Pick<Handlers, 'log' | 'onSelect'>) {
  const [selected, setSelected] = React.useState<string>();
  if (body.text) return <TypographyMuted>{body.text}</TypographyMuted>;
  if (body.events)
    return (
      <TimelineList variant="compact">
        {body.events.map((e, i) => (
          <TimelineEntry key={i} when={e.when}>
            {e.text}
          </TimelineEntry>
        ))}
      </TimelineList>
    );
  if (body.properties)
    return (
      <PropertyList labelWidth={body.labelWidth}>
        {body.properties.map((p) => (
          <PropertyRow key={p.label} label={p.label} mono={p.mono}>
            {p.value}
          </PropertyRow>
        ))}
      </PropertyList>
    );
  if (body.table) {
    const { columns, rows } = body.table;
    return (
      <Table seamless>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c}>{c}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r[0]}
              data-state={selected === r[0] ? 'selected' : undefined}
              onClick={() => {
                onSelect(r[0]);
                log('onSelect', r[0]);
                setSelected(r[0]);
              }}
            >
              {r.map((c, i) => (
                <TableCell key={i}>{c}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  return (
    <>
      {body.sections?.map((s) => (
        <SectionHeader key={s} title={s} />
      ))}
    </>
  );
}

/** One panel as a consumer holds it: a close action hides it, and it can be reopened. */
function LivePanel({ p, height, log, onAction, onSelect }: { p: Panel; height: number } & Handlers) {
  const [open, setOpen] = React.useState(true);
  const name = p.titleText ?? p.title?.text ?? '';
  const act = (n: string) => {
    onAction(n);
    log('onAction', n);
    if (n === 'Close panel' || n === 'Hide panel') setOpen(false);
  };
  if (!open)
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Reopen {name}
      </Button>
    );
  const headerActions: NavHorizontalItem[] | undefined = p.actions?.map((a) => ({
    name: a.name,
    icon: ICONS[a.icon],
    ...(a.menu
      ? {
          menuItems: a.menu.map((m) => ({
            ...m,
            onSelect: () => {
              onSelect(m.id);
              log('onSelect', m.id);
            },
          })),
        }
      : { onClick: () => act(a.name) }),
  }));
  const TitleIcon = p.title?.icon ? ICONS[p.title.icon] : undefined;
  return (
    // Story chrome: PanelContent fills its parent's height, and a grid cell has none. A bordered
    // box with a bounded track is what an app's layout gives it.
    <PanelBox flush>
      <div style={{ height }}>
        <PanelContent
          titleText={p.titleText}
          count={p.title?.count}
          title={
            p.title ? (
              <>
                {TitleIcon ? <TitleIcon size={14} aria-hidden /> : null} {p.title.text}{' '}
                {p.title.status ? (
                  <Badge variant="soft" tone="success" size="xs">
                    {p.title.status}
                  </Badge>
                ) : null}
              </>
            ) : undefined
          }
          headerActions={headerActions}
          actionsOnHover={p.actionsOnHover}
          {...p.classes}
          footerContent={
            p.footer ? (
              <>
                {p.footer.note ? <TypographyMuted>{p.footer.note}</TypographyMuted> : null}
                {p.footer.buttons.map((b) => (
                  <Button
                    key={b.label}
                    variant={b.variant as 'ghost' | undefined}
                    size="sm"
                    onClick={() => act(b.label)}
                  >
                    {b.label}
                  </Button>
                ))}
              </>
            ) : undefined
          }
        >
          <PanelBody body={p.body ?? {}} log={log} onSelect={onSelect} />
        </PanelContent>
      </div>
    </PanelBox>
  );
}

/**
 * A panel shell: a titled header whose right side is a list of nav items, a body that is the
 * only part that scrolls, and an optional footer — from `fixtures/ui-extended/panel-content.json`.
 * There is no close prop: closing is one header action like any other, so a dismiss affordance is
 * described exactly like a refresh or a pin. Click an action, a menu row or a body row — each is
 * logged with what it carries, and a close hides the panel as its owner would.
 */
export const PanelContentStory: Story = {
  name: 'PanelContent',
  render: ({ variant, onAction, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) =>
        (v.stack ?? [v]).map((p, i) => (
          <LivePanel key={i} p={p} height={v.height} log={log} onAction={onAction} onSelect={onSelect} />
        ))
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: VARIANTS[0].caption }));
    await step('Save from the footer', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Save' }));
      await expect(args.onAction).toHaveBeenCalledWith('Save');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"Save"');
    });
    await step('Close the panel', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Close panel' }));
      await expect(args.onAction).toHaveBeenCalledWith('Close panel');
      await expect(cell.getByRole('button', { name: 'Reopen Panel title' })).toBeInTheDocument();
    });
  },
};
