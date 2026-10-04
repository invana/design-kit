import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  BoardPages as Component,
  type ActionContext,
  type BoardPageSpec,
  type BoardPagesSpec,
  type BoardSpec,
} from '@invana/boards';
import { BarChart3, FileText, Workflow } from 'lucide-react';

import data from '../../../../fixtures/board/board-pages.json';
import forecastRun from '../../../../fixtures/boards/forecast-run.json';
import plan from '../../../../fixtures/boards/plan.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';
import { ICONS as BOARD_ICONS } from '../../_fixtures';

/** The screens' own boards, by file name — a page names one rather than copying it, or carries its own. */
const BOARDS: Record<string, BoardSpec> = {
  plan: plan as BoardSpec,
  'forecast-run': forecastRun as BoardSpec,
};

type PageData = Omit<BoardPageSpec, 'board'> & { board: string | BoardSpec };

interface PagesVariant extends Variant {
  spec: Omit<BoardPagesSpec, 'pages'> & { pages: PageData[] };
  /** What `new-board` opens, for the host-controlled cell. */
  newBoard?: Omit<BoardPageSpec, 'id'>;
}

// JSON widens the literal unions; the shapes are the boards' own.
const VARIANTS = data as unknown as PagesVariant[];

const specOf = (v: PagesVariant): BoardPagesSpec => ({
  ...v.spec,
  pages: v.spec.pages.map((p) => ({ ...p, board: typeof p.board === 'string' ? BOARDS[p.board]! : p.board })),
});

const ICONS = { ...BOARD_ICONS, plan: Workflow, chart: BarChart3, record: FileText };

interface Args {
  variant: string;
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Boards/Components/BoardPages',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { BoardPages } from '@invana/boards';",
              "import { BarChart3, FileText, Workflow } from 'lucide-react'; // any icon set",
            ],
            picked.map((v) => ({
              comment: `${v.caption} — each page's \`board\` is a BoardSpec ("plan" and "forecast-run" stand for fixtures/boards/<name>.json)`,
              data: { spec: v.spec },
              setup: [
                'const icons = { plan: Workflow, chart: BarChart3, record: FileText };',
                v.spec.selectAction
                  ? [
                      '// The strip reports; the host changes the spec:',
                      `//   picking a tab → onAction(${inline(v.spec.selectAction)}, { pageId: "forecast" })`,
                      `//   a tab's ×     → onAction(${inline(v.spec.closeAction)}, { pageId: "forecast" })`,
                      `//   the +         → onAction(${inline(v.spec.addAction)})`,
                      '// and a board\'s own actions arrive with the page they came from: { pageId, panelId, … }',
                    ].join('\n')
                  : '// The tabs switch by themselves; a board\'s own actions arrive with { pageId, panelId, … }.',
                'const onAction = (id, ctx) => api.send({ id, ...ctx });',
              ].join('\n'),
              call: jsx('BoardPages', { spec: 'spec', icons: 'icons', onAction: 'onAction' }),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** One cell. A host-controlled spec gets the patch the API would send back for each action. */
function Cell({ v, args, log }: { v: PagesVariant; args: Args; log: Log }) {
  const [spec, setSpec] = React.useState(() => specOf(v));
  const added = React.useRef(0);

  const onAction = (id: string, ctx?: ActionContext) => {
    args.onAction(id, ctx);
    log('onAction', { id, ...ctx });
    if (id === v.spec.selectAction) setSpec((s) => ({ ...s, active: ctx?.pageId }));
    if (id === v.spec.closeAction)
      setSpec((s) => {
        const at = s.pages.findIndex((p) => p.id === ctx?.pageId);
        const pages = s.pages.filter((p) => p.id !== ctx?.pageId);
        // A closed active page hands the selection to its neighbour.
        const active = s.active === ctx?.pageId ? pages[Math.max(0, at - 1)]?.id : s.active;
        return { ...s, pages, active };
      });
    if (id === v.spec.addAction && v.newBoard) {
      const page = { ...v.newBoard, id: `new-${++added.current}`, closable: true };
      setSpec((s) => ({ ...s, pages: [...s.pages, page], active: page.id }));
    }
  };

  return <Component spec={spec} icons={ICONS} onAction={onAction} />;
}

/**
 * Several boards in one `Workbook`: each page is a `Board` drawn from its own spec, and every
 * page stays mounted, so switching keeps a board's scroll and tab. The tabs sit on top or at the
 * bottom. Left alone the strip switches by itself; a spec that names `selectAction` hands the
 * pick, a tab's `×` and the `+` to the host, which answers by changing the spec. A board's own
 * actions arrive with the page they came from. Data: `fixtures/board/board-pages.json`, whose
 * pages name the screens' boards in `fixtures/boards/`.
 */
export const BoardPages: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => <Cell v={v} args={args} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Left alone, a tab switches the board by itself', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Tabs on top' }));
      await userEvent.click(cell.getByRole('tab', { name: /Weekly demand/ }));
      await expect(cell.getByRole('tab', { name: /Weekly demand/ })).toHaveAttribute('aria-selected', 'true');
      await expect(args.onAction).not.toHaveBeenCalled();
    });
    const cell = within(canvas.getByRole('group', { name: 'Host-controlled: open, close and add' }));
    await step('Host-controlled, a pick is reported with its page and the host moves the tab', async () => {
      await userEvent.click(cell.getByRole('tab', { name: /Notes/ }));
      await expect(args.onAction).toHaveBeenCalledWith('open-board', { pageId: 'notes' });
      await expect(cell.getByRole('tab', { name: /Notes/ })).toHaveAttribute('aria-selected', 'true');
    });
    await step('A tab\'s × reports the close, and the page leaves', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Close Weekly demand' }));
      await expect(args.onAction).toHaveBeenCalledWith('close-board', { pageId: 'forecast' });
      await expect(cell.queryByRole('tab', { name: /Weekly demand/ })).not.toBeInTheDocument();
    });
    await step('The + reports the add, and the new board opens', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'New board' }));
      await expect(args.onAction).toHaveBeenCalledWith('new-board', undefined);
      await expect(cell.getByRole('tab', { name: /Untitled board/ })).toHaveAttribute('aria-selected', 'true');
    });
  },
};
