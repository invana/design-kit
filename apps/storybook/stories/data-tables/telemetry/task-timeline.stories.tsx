import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PanelBox, TaskGantt } from '@invana/ui';

import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { EVENTS, RUN_SPAN_MS, formatMs, ganttTasks } from './fixtures';

const TASKS = ganttTasks();
const FAILED = TASKS.filter((t) => t.status === 'failed').length;
const ASIDE = `${formatMs(RUN_SPAN_MS)} · ${TASKS.length} tasks · ${FAILED} failed · ${EVENTS.length} events`;

const VARIANTS = [{ caption: 'Task Timeline', wide: true }];

interface Args {
  onSelectTask: (key: string | null) => void;
}

function Live({ log, onSelectTask }: Args & { log: Log }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  return (
    <PanelBox title="Timeline" aside={ASIDE}>
      <TaskGantt
        tasks={TASKS}
        spanMs={RUN_SPAN_MS}
        ticks={9}
        detailProps={{ width: 300 }}
        selectedKey={selected}
        onSelectTask={(key) => {
          const next = key === selected ? null : key;
          onSelectTask(next);
          log('onSelectTask', next);
          setSelected(next);
        }}
      />
    </PanelBox>
  );
}

const meta = {
  title: 'Data Tables/Telemetry/Task Timeline',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { PanelBox, TaskGantt } from '@invana/ui';"],
          comment: 'The log folded into one row per task — derived from fixtures/data-tables/telemetry-run.json',
          data: { tasks: TASKS.slice(0, 3) },
          setup: [
            '// The task\'s key — pick it again to clear the pick.',
            'const [selected, setSelected] = React.useState(null);',
          ].join('\n'),
          call: `<PanelBox title="Timeline" aside="${ASIDE}">\n  ${jsx('TaskGantt', {
            tasks: 'tasks',
            spanMs: String(RUN_SPAN_MS),
            ticks: '9',
            detailProps: '{ width: 300 }',
            selectedKey: 'selected',
            onSelectTask: '(key) => setSelected(key === selected ? null : key)',
          }).replace(/\n/g, '\n  ')}\n</PanelBox>`,
        }),
      },
    },
  },
  args: { onSelectTask: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The log folded into one row per task, in plan order, on the run's clock.
 *
 * Empty track before a bar is time the task waited — for a slot, or for the tasks it depends on
 * (`analyse` waits on all five fetches). `fetch_filings` carries its rate-limited first attempt in
 * red to the left of the retry that stuck; `analyse.risk` failed and was not retried. Hover a row
 * for its agent, slots, call count, tokens and last log line; click one to pick it.
 */
export const TaskTimeline: Story = {
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Task Timeline' }));
    await step('Pick the plan', async () => {
      await userEvent.click(cell.getAllByRole('button', { pressed: false })[0]!);
      await expect(args.onSelectTask).toHaveBeenCalledWith('plan');
    });
    await step('The row is picked, and the pick is logged', async () => {
      await expect(cell.getByRole('button', { pressed: true })).toHaveTextContent('plan');
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('"plan"');
    });
  },
};
