import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChartH,
  Button,
  Eyebrow,
  TaskGantt,
  TaskGanttDetailCard,
  type TaskGanttTask,
} from '@invana/ui';

const meta: Meta<typeof TaskGantt> = {
  title: 'UI/UI Extended/TaskGantt',
  component: TaskGantt,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TASKS: TaskGanttTask[] = [
  {
    key: 'plan_queries',
    status: 'succeeded',
    startMs: 0,
    durationMs: 1200,
    result: { queries: 5, lanes: 2 },
    log: 'drafted 5 queries · 2 lanes',
  },
  {
    key: 'execute_graph_query',
    status: 'succeeded',
    startMs: 1200,
    durationMs: 3400,
    // The card body this row wants is a chart, so it says so on the row itself.
    detail: (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="min-w-0 flex-1 truncate font-mono text-meta font-medium">
            execute_graph_query
          </span>
          <span className="shrink-0 font-mono text-meta text-muted-foreground tabular-nums">3.4s</span>
        </div>
        <BarChartH
          caption="rows per lane"
          labelWidth={52}
          data={[
            { label: 'lane 1', value: 1204, display: '1,204' },
            { label: 'lane 2', value: 676, display: '676' },
            { label: 'lane 3', value: 412, display: '412' },
          ]}
        />
        <Button size="sm" variant="outline" className="self-start">
          Open the result
        </Button>
      </div>
    ),
  },
  {
    key: 'summarise',
    status: 'needs_input',
    startMs: 4600,
    durationMs: 700,
    summary: 'two suppliers matched no route — which one did you mean?',
    result: { tokens_in: 4210, tokens_out: 380, model: 'claude-opus-5' },
    log: 'asked back · awaiting an answer',
  },
];

/**
 * The card is yours — `renderDetail` for every row, `task.detail` for one.
 *
 * Here the middle row replaces the body outright with a chart and an action,
 * while the other two keep the default card wrapped in one line of context.
 * `TaskGanttDetailCard` is exported for exactly this: compose around the shared
 * header rather than redrawing it, so the status vocabulary cannot drift.
 */
export const CustomDetail: Story = {
  render: () => (
    <div className="w-[460px] border border-border bg-card">
      <div className="px-3 pt-2 pb-1">
        <Eyebrow aside={<span className="font-mono">5.3s</span>}>Performance</Eyebrow>
      </div>
      <div className="px-3 pb-2">
        <TaskGantt
          tasks={TASKS}
          detailProps={{ side: 'right', align: 'start', width: 300, openDelay: 120 }}
          renderDetail={(task) =>
            task.detail ?? (
              <div className="flex flex-col gap-2">
                <TaskGanttDetailCard task={task} />
                <span className="border-t border-border pt-1.5 text-meta text-muted-foreground">
                  part of <span className="font-mono">market-brief v1</span>
                </span>
              </div>
            )
          }
        />
      </div>
    </div>
  ),
};
