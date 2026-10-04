import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { EmptyState, Workbook as Component, type WorkbookPage, type WorkbookPageMenuItem } from '@invana/ui';
import { BarChart3, CircleHelp, Home, Settings, Table } from 'lucide-react';

import DATA from '../../../../fixtures/ui-extended/workbook.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface PageData {
  id: string;
  title: string;
  icon?: string;
  closable?: boolean;
  /** What the page shows — the story draws it as an `EmptyState`. */
  body: { title: string; description: string };
}

interface WorkbookVariant extends Variant {
  pages: PageData[];
  active: string;
  tabPosition?: 'top' | 'bottom';
  pagerPosition?: 'start' | 'end';
  /** Draws the `+`. */
  add?: boolean;
  menu?: Omit<WorkbookPageMenuItem, 'onSelect'>[];
  actions?: { id: string; label: string; icon: string }[];
}

const VARIANTS = DATA.variants as WorkbookVariant[];

/** The icon names the JSON uses — the kit ships none. */
const ICONS: Record<string, React.ElementType> = {
  home: Home,
  table: Table,
  chart: BarChart3,
  settings: Settings,
  help: CircleHelp,
};

interface Args {
  variant: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
  onMenu: (item: string, pageId: string) => void;
  onHeaderAction: (id: string) => void;
}

const meta = {
  title: 'UI/UI Extended/Workbook',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Workbook } from '@invana/ui';",
              "import { Home, Table } from 'lucide-react'; // any icon set",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { pages: v.pages.map(({ body: _body, ...p }) => p) },
              setup: [
                '// The host owns the pages and the active one; each page\'s `content` is any node.',
                `const [active, onSelect] = React.useState(${JSON.stringify(v.active)}); // receives the picked page's id`,
                v.add ? 'const onAdd = () => api.newPage(); // receives nothing' : '',
                v.pages.some((p) => p.closable) ? 'const onClose = (id) => api.closePage(id); // receives the page\'s id' : '',
                v.menu ? `const pageMenuItems = ${JSON.stringify(v.menu)}.map((item) => ({ ...item, onSelect: (pageId) => api.act(item.id, pageId) }));` : '',
                v.actions ? `const headerActions = ${JSON.stringify(v.actions.map(({ icon: _i, ...a }) => a))}.map((a) => ({ ...a, icon: Settings, onClick: () => api.act(a.id) }));` : '',
              ]
                .filter(Boolean)
                .join('\n'),
              call: jsx('Workbook', {
                pages: 'pages.map((p) => ({ ...p, content: <Page id={p.id} /> }))',
                activeId: 'active',
                onSelect: 'onSelect',
                tabPosition: v.tabPosition ? { literal: v.tabPosition } : undefined,
                pagerPosition: v.pagerPosition ? { literal: v.pagerPosition } : undefined,
                onAdd: v.add ? 'onAdd' : undefined,
                onClose: v.pages.some((p) => p.closable) ? 'onClose' : undefined,
                pageMenuItems: v.menu ? 'pageMenuItems' : undefined,
                headerActions: v.actions ? 'headerActions' : undefined,
              }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn(), onAdd: fn(), onClose: fn(), onMenu: fn(), onHeaderAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One cell: holds the pages and the active one, and answers each callback as a host would. */
function Cell({ v, args, log }: { v: WorkbookVariant; args: Args; log: Log }) {
  const [pages, setPages] = React.useState(v.pages);
  const [active, setActive] = React.useState(v.active);
  const added = React.useRef(0);

  const select = (id: string) => {
    args.onSelect(id);
    log('onSelect', id);
    setActive(id);
  };
  // A closed or removed page hands the selection to its neighbour.
  const drop = (id: string) => {
    const at = pages.findIndex((p) => p.id === id);
    const rest = pages.filter((p) => p.id !== id);
    setPages(rest);
    if (id === active && rest.length) setActive(rest[Math.max(0, at - 1)]!.id);
  };

  const shown: WorkbookPage[] = pages.map((p) => ({
    id: p.id,
    title: p.title,
    icon: p.icon ? ICONS[p.icon] : undefined,
    closable: p.closable,
    content: <EmptyState title={p.body.title} description={p.body.description} />,
  }));

  return (
    <Component
      pages={shown}
      activeId={active}
      onSelect={select}
      tabPosition={v.tabPosition}
      pagerPosition={v.pagerPosition}
      onAdd={
        v.add
          ? () => {
              args.onAdd();
              log('onAdd', undefined);
              const n = ++added.current;
              const id = `new-${n}`;
              setPages((ps) => [
                ...ps,
                { id, title: `Untitled ${n}`, body: { title: `Untitled ${n}`, description: 'A new, empty page.' } },
              ]);
              setActive(id);
            }
          : undefined
      }
      onClose={(id) => {
        args.onClose(id);
        log('onClose', id);
        drop(id);
      }}
      pageMenuItems={v.menu?.map((item) => ({
        ...item,
        disabled: item.id === 'remove' ? () => pages.length < 2 : undefined,
        onSelect: (pageId: string) => {
          args.onMenu(item.id, pageId);
          log('onSelect', { item: item.id, pageId });
          if (item.id === 'remove') drop(pageId);
          if (item.id === 'duplicate') {
            const page = pages.find((p) => p.id === pageId)!;
            const copy = { ...page, id: `${page.id}-copy-${++added.current}`, title: `${page.title} copy` };
            setPages((ps) => [...ps.slice(0, ps.indexOf(page) + 1), copy, ...ps.slice(ps.indexOf(page) + 1)]);
            setActive(copy.id);
          }
        },
      }))}
      headerActions={v.actions?.map((a) => ({
        id: a.id,
        label: a.label,
        icon: ICONS[a.icon]!,
        onClick: () => {
          args.onHeaderAction(a.id);
          log('onClick', a.id);
        },
      }))}
    />
  );
}

/**
 * Several separate pages behind one folder-tab strip — a shell's open boards, a set of
 * canvases, documents kept open side by side. Every page stays mounted, so switching keeps its
 * state. The tabs sit on top or, the spreadsheet look, at the bottom; the active tab can carry a
 * menu, a page can be closable, and tabs that don't fit fold into `…`. Not `TabbedPanel`, whose
 * tabs are views of one thing. Data: `fixtures/ui-extended/workbook.json`.
 */
export const Workbook: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Picking a tab reports its id and shows its page', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Tabs on top' }));
      await userEvent.click(cell.getByRole('tab', { name: /Accounts/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('accounts');
      await expect(cell.getByText('Every account, its segment, ARR and owner.')).toBeVisible();
    });
    await step('The pager steps through the tabs at the bottom', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Tabs at the bottom' }));
      await userEvent.click(cell.getByRole('button', { name: 'Next tab' }));
      await expect(args.onSelect).toHaveBeenCalledWith('accounts');
      await expect(cell.getByRole('tab', { name: /Accounts/ })).toHaveAttribute('aria-selected', 'true');
    });
    await step('A closable tab closes, and its neighbour takes the selection', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Closable pages' }));
      await userEvent.click(cell.getByRole('button', { name: /Close Funding/ }));
      await expect(args.onClose).toHaveBeenCalledWith('funding');
      await expect(cell.queryByRole('tab', { name: /Funding/ })).not.toBeInTheDocument();
      await expect(cell.getByRole('tab', { name: /Accounts/ })).toHaveAttribute('aria-selected', 'true');
    });
    await step('The page menu acts on the active page', async () => {
      const cell = within(canvas.getByRole('group', { name: 'With a page menu' }));
      await userEvent.click(cell.getByRole('button', { name: 'Accounts menu' }));
      await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Duplicate' }));
      await expect(args.onMenu).toHaveBeenCalledWith('duplicate', 'accounts');
      await expect(cell.getByRole('tab', { name: /Accounts copy/ })).toHaveAttribute('aria-selected', 'true');
    });
  },
};
