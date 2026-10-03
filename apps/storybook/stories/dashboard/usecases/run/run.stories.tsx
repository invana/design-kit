import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { GanttOptions } from '@invana/blocks';
import { Dashboard, type ActionContext, type DashboardSpec, type LogOptions } from '@invana/dashboard';

import run from '../../../../fixtures/dashboards/run.json';
import { jsx, snippet } from '../../../_story/source';
import { ICONS, Surface, panelsOf, useSent } from '../../_fixtures';

// JSON widens the literal unions (`"succeeded"`, `"info"`); the shape is the dashboard's own.
const SPEC = run as unknown as DashboardSpec;

type Task = GanttOptions['tasks'][number];
const flatten = (tasks: Task[]): Task[] => tasks.flatMap((t) => [t, ...flatten(t.subtasks ?? [])]);

/**
 * The run's own record, read back out of its spec: every task of the Gantt — a lane under the
 * task that split into it — and the log's lines.
 */
const TRACE = flatten((panelsOf(SPEC).find((p) => p.id === 'performance')!.options as GanttOptions).tasks);
const LOG = (panelsOf(SPEC).find((p) => p.id === 'log')!.options as LogOptions).lines;

interface Args {
  onAction: (id: string, ctx?: ActionContext) => void;
}

const meta = {
  title: 'Dashboard/Use Cases/Run',
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: [
            "import { Dashboard } from '@invana/dashboard';",
            "import { MoreHorizontal, Upload } from 'lucide-react'; // any icon set",
          ],
          data: { spec: SPEC },
          setup: [
            '// A task picked in Performance → onAction("select", { panelId: "performance", value: "fetch_source" });',
            '//   a bar picked in Worker slots or Layer access sends its own key — { panelId: "layers", value: "fetch_source#1" },',
            '//   an earlier attempt being `<key>#<n>` → draw that step\'s own spec; its crumb menu sends "open-step"',
            '//   with { itemId }, and the run\'s crumb sends "open-run" with no context.',
            'const onAction = (id, ctx) => {',
            '  if (id === "select") setStep(String(ctx.value).split("#")[0]);',
            '  if (id === "open-step") setStep(ctx.itemId);',
            '  if (id === "open-run") setStep(null);',
            '};',
            'const icons = { more: MoreHorizontal, file: Upload };',
          ].join('\n'),
          call: jsx('Dashboard', {
            spec: 'step ? stepSpec(step) : spec',
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

// ── a step, opened inside the run — derived from the run's own record ─────

const STEP_TONE = { succeeded: 'success', skipped: 'queued', needs_input: 'warning' } as const;
const tone = (t: Task) => STEP_TONE[t.status as keyof typeof STEP_TONE];
const seconds = (ms?: number) => (ms === undefined ? '—' : ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);

function stepSpec(task: Task): DashboardSpec {
  const lines = LOG.filter((line) => line.source === task.key);
  const attempts = (task.attempts?.length ?? 0) + 1;
  const status = String(task.status).replace('_', ' ');
  return {
    header: {
      tone: tone(task),
      crumbs: [SPEC.title!, task.key],
      crumbActions: ['open-run'],
      crumbMenu: {
        action: 'open-step',
        placeholder: 'Jump to a task',
        items: TRACE.map((t) => ({ id: t.key, label: t.key, aside: seconds(t.durationMs), tone: tone(t) })),
        selected: task.key,
      },
      chips: [{ label: status }],
    },
    rows: [],
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        rows: [
          {
            panels: [
              {
                kind: 'grid',
                options: {
                  tiles: [
                    { label: 'Status', value: status },
                    { label: 'Duration', value: seconds(task.durationMs) },
                    { label: 'Attempts', value: String(attempts), flag: attempts > 1 },
                  ],
                },
              },
            ],
          },
          {
            panels: [
              {
                kind: 'list',
                title: 'Artifacts',
                options: {
                  items: [
                    { id: 'input', icon: 'file', title: 'input.json', mono: true, meta: 'the request, resolved', chip: { label: 'input' } },
                    { id: 'result', icon: 'file', title: 'result.json', mono: true, meta: 'what it merged', chip: { label: 'output' } },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'exchange',
        label: 'Exchange',
        rows: [
          {
            panels: [
              {
                kind: 'exchange',
                title: 'What went in, what came out',
                options: {
                  blocks: [
                    { label: 'Input', language: 'json', value: JSON.stringify({ task: task.key, run: '9f2c…a41' }, null, 2) },
                    { label: 'Output', language: 'json', value: JSON.stringify({ status: task.status, ms: task.durationMs ?? null }, null, 2) },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'log',
        label: 'Log',
        rows: [
          {
            panels: [
              lines.length
                ? { kind: 'log', title: 'Log · this task only', flush: true, options: { lines } }
                : { kind: 'log', title: 'Log · this task only', options: { lines: [] }, absent: { reason: 'unrecorded', note: 'This task wrote nothing to the log.' } },
            ],
          },
        ],
      },
    ],
  };
}

/** The run's header after `Cancel` — what the API's answer would patch in. */
function cancelled(spec: DashboardSpec): DashboardSpec {
  const header = spec.header!;
  return {
    ...spec,
    header: {
      ...header,
      tone: 'muted',
      chips: header.chips?.map((c) => (c.label === 'running' ? { label: 'cancelling', tone: 'warning' } : c)),
      actions: header.actions?.map((a) => (a.id === 'cancel' ? { ...a, disabled: true } : a)),
    },
  };
}

function Live({ onAction }: Args) {
  const [spec, setSpec] = React.useState(SPEC);
  const [step, setStep] = React.useState<string | null>(null);
  const [sent, record] = useSent(onAction);
  const task = TRACE.find((t) => t.key === step);
  return (
    <Surface sent={sent}>
      <Dashboard
        key={task?.key ?? 'run'}
        className="min-h-0 flex-1"
        spec={task ? stepSpec(task) : spec}
        icons={ICONS}
        onAction={(id, ctx) => {
          record(id, ctx);
          // Every Gantt sends `select`: a row's key from Performance, a bar's from slots and layers.
          if (id === 'select') setStep(String(ctx?.value).split('#')[0]);
          if (id === 'open-step') setStep(ctx?.itemId ?? null);
          if (id === 'open-run') setStep(null);
          if (id === 'cancel') setSpec(cancelled);
          if (id === 'view' && ctx?.option)
            setSpec((s) => ({ ...s, header: { ...s.header!, actions: s.header!.actions?.map((a) => (a.id === 'view' ? { ...a, value: ctx.option } : a)) } }));
        }}
      />
    </Surface>
  );
}

/**
 * **A run, read as a report** — the budget against its ceiling, then three readings of one clock
 * stacked so their axes line up: **Performance** (every task, a split task open into its lanes,
 * a retry's failed attempt before the one that stuck), **Worker slots** (what each slot held, in
 * order) and **Layer access** (what each task reached, by layer and participant, with the approval
 * gate as a seam). All three are the `gantt` block — the slots and layers as rows of many bars —
 * so the same spec draws in a conversation too. Then what was reported, the input, `result.json`
 * and the log; one `DashboardSpec` in `fixtures/dashboards/run.json`.
 *
 * Pick a task in **Performance**, or a bar in **Worker slots** or **Layer access**, to open it
 * inside the run: the run's crumb becomes a link back
 * (`crumbActions`), the task's crumb opens every task of the run (`crumbMenu`), and the step
 * carries its own tabs — derived from the run's own Gantt and log, as a consumer would. `Cancel`
 * marks the run cancelling. Every action is written in the footer.
 */
export const Run: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('Open a task from Performance', async () => {
      // Performance draws first, so its row is the first `fetch_source` button; slots and layers have bars too.
      await userEvent.click(canvas.getAllByRole('button', { name: /fetch_source/ })[0]);
      await expect(args.onAction).toHaveBeenCalledWith('select', { panelId: 'performance', value: 'fetch_source' });
      await expect(canvas.getByRole('tab', { name: 'Exchange' })).toBeInTheDocument();
    });
    await step('Back to the run by its crumb', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Red Sea exposure' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('open-run', undefined);
      await expect(canvas.getByText('Performance')).toBeInTheDocument();
      await expect(canvas.getByRole('list', { name: 'Events' })).toHaveTextContent('onAction("open-run")');
    });
    await step('Open the failed attempt from Layer access', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'fetch_source · attempt 1 · 503' }));
      await expect(args.onAction).toHaveBeenLastCalledWith('select', { panelId: 'layers', value: 'fetch_source#1' });
      await expect(canvas.getByRole('tab', { name: 'Exchange' })).toBeInTheDocument();
    });
  },
};
