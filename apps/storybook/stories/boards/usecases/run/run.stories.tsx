import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Board, type ActionContext } from '@invana/boards';

import run from '../../../../fixtures/runs/agent-run.json';
import { jsx, snippet } from '../../../_story/source';
import { ICONS, Surface, useSent } from '../../_fixtures';
import { pick, runBoard, type Selection, type Trace } from './run-board';

// JSON widens the literal unions (`"succeeded"`, `"model"`); the shape is the trace's own.
const TRACE = run as unknown as Trace;

/** The task the board opens on: the connector whose second query was refused. */
const OPEN: Selection = { task: 'erp_contracts', call: null };

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Boards/Use Cases/Run',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { Board } from '@invana/boards';",
            "import { MoreHorizontal, X } from 'lucide-react'; // any icon set",
          ],
          data: { trace: TRACE },
          setup: [
            '// runBoard(trace, selection, tab) builds the BoardSpec — the run in tabs, the picked task as its inspector.',
            '// A task or call picked in Execution, or a row in the Access log → onAction("select", { panelId, value: <task key | call id> });',
            '//   the inspector\'s crumb menu sends "open-task" with { itemId }, its × sends "close",',
            '//   and a tab sends "tab" (the run) or "inspect-tab" (the task) with { option }.',
            'const onAction = (id, ctx) => {',
            '  if (id === "select") setSel(pick(trace, String(ctx.value)));',
            '  if (id === "open-task") setSel({ task: ctx.itemId });',
            '  if (id === "close") setSel({ task: null });',
            '  if (id === "tab") setTab(ctx.option);',
            '  if (id === "inspect-tab") setSel((s) => ({ ...s, tab: ctx.option }));',
            '};',
            'const icons = { more: MoreHorizontal, close: X };',
          ].join('\n'),
          call: jsx('Board', {
            spec: 'runBoard(trace, sel, tab)',
            icons: 'icons',
            onAction: 'onAction',
          }),
        }),
      },
    },
  },
  args: { onAction: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Live({ onAction }: Args) {
  const [sel, setSel] = React.useState<Selection>(OPEN);
  const [tab, setTab] = React.useState('trace');
  const [sent, record] = useSent(onAction);
  return (
    <Surface sent={sent}>
      <Board
        className="min-h-0 flex-1"
        spec={runBoard(TRACE, sel, tab)}
        icons={ICONS}
        onAction={(id, ctx) => {
          record(id, ctx);
          if (id === 'select') setSel((s) => pick(TRACE, String(ctx?.value)) ?? s);
          if (id === 'open-task') setSel({ task: ctx?.itemId ?? null });
          if (id === 'close') setSel({ task: null });
          if (id === 'tab' && ctx?.option) setTab(ctx.option);
          if (id === 'inspect-tab' && ctx?.option) setSel((s) => ({ ...s, tab: ctx.option }));
        }}
      />
    </Surface>
  );
}

/**
 * **What an agent did to answer one question** — a trace explorer over the run's own record
 * (`fixtures/runs/agent-run.json`).
 *
 * The run is three tabs. **Trace**: the budget in tokens, then **Execution**, the tree of
 * tasks the run executed on one clock, each task's calls as rows under it, painted by the layer
 * they crossed (model, graph model, graph data, dataset, skill, connector, web), a failed or
 * refused call in its status colour, a retry's failed attempt before the one that stuck.
 * **Access log**: every call as a table. **Log**: every line.
 *
 * Pick a task or a call, in Execution or the Access log, and it opens in the **inspector**
 * beside the run (`BoardSpec.inspector`), so the tree stays in view: its access labels
 * (used, granted and left alone, denied), input and output; its **calls**, each with what was
 * sent (a prompt, a query, a payload, secrets masked) and what came back; its log; and the raw
 * span. The board is built by the story's `runBoard(trace, selection)`, as a consumer would
 * build it from the API's trace. Every action is written in the footer.
 */
export const Run: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Opens on the connector, its denied label in view', async () => {
      await expect(canvas.getByText('connector:erp:pricing:read')).toBeInTheDocument();
    });
    await step('Pick a call in Execution — its task opens on Calls', async () => {
      await userEvent.click(canvas.getAllByRole('button', { name: 'graph.data · supply-graph@v12' })[0]);
      await expect(args.onAction).toHaveBeenLastCalledWith('select', { panelId: 'execution', value: 'find_suppliers/c1' });
      await expect(canvas.getByRole('tab', { name: /Calls · 1/, selected: true })).toBeInTheDocument();
      await expect(canvas.getByText('graph.data · cypher · supply-graph@v12')).toBeInTheDocument();
    });
    await step('Close the inspector', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('close', undefined);
      await expect(canvas.queryByRole('tab', { name: /Span/ })).not.toBeInTheDocument();
    });
  },
};
