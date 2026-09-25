import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow, TaskGantt, type TaskGanttTask } from '@invana/ui';

const meta: Meta<typeof TaskGantt> = {
  title: 'UI/UI Extended/TaskGantt',
  component: TaskGantt,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `run:7d3184f1` — an ask that asked back once, waited on an approval, and
 * retried its query. Nine tasks on a 2m 51s clock.
 */
const TASKS: TaskGanttTask[] = [
  { key: 'parse_intent', label: 'parse_intent', status: 'succeeded', startMs: 0, durationMs: 900 },
  { key: 'ask_user', status: 'succeeded', startMs: 900, durationMs: 41_200, summary: 'ravi chose — by promise date' },
  { key: 'parse_intent·2', label: 'parse_intent', status: 'succeeded', startMs: 42_100, durationMs: 700 },
  { key: 'resolve_schema', status: 'succeeded', startMs: 42_800, durationMs: 200 },
  { key: 'build_query', status: 'succeeded', startMs: 43_000, durationMs: 1_400 },
  { key: 'validate_query', status: 'succeeded', startMs: 44_400, durationMs: 100 },
  {
    key: 'execute_query',
    status: 'succeeded',
    startMs: 168_500,
    durationMs: 2_100,
    attempts: [{ startMs: 166_000, durationMs: 2_400, status: 'failed', title: 'timed out — retried' }],
  },
  { key: 'summarise', status: 'succeeded', startMs: 170_600, durationMs: 900 },
  { key: 'deliver', status: 'succeeded', startMs: 171_500, durationMs: 100 },
];

/**
 * The loop and the gate, on the clock rather than beside it.
 *
 * A bounded repetition is a **bracket** over the rounds it holds, labelled on
 * its own line; a gate is a **seam** — a rule across the stretch of the clock
 * it held, between the rows it lies between. The label and duration columns
 * take their content's width, so the chart fills whatever it is given.
 */
export const LoopAndGate: Story = {
  render: function Render() {
    const [selected, setSelected] = React.useState<string | null>(null);
    return (
      <div className="border border-border bg-card">
        <div className="px-3 pt-2 pb-1">
          <Eyebrow aside="6.4s of work · 2m 45s of waiting">Waterfall</Eyebrow>
        </div>
        <div className="px-3 pb-2">
          <TaskGantt
            tasks={TASKS}
            ticks={6}
            brackets={[{ from: 'parse_intent', to: 'parse_intent·2', label: '↻ 2 of 3 rounds — understood on round 2' }]}
            seams={[
              {
                after: 'validate_query',
                label: 'approval',
                note: 'approved by ravi · nothing spent while it waited',
                startMs: 44_500,
                durationMs: 124_000,
              },
            ]}
            selectedKey={selected}
            onSelectTask={(key) => setSelected((prev) => (prev === key ? null : key))}
          />
        </div>
      </div>
    );
  },
};
