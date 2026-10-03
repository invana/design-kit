import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, ButtonGroup, PanelBox, Stack, Gantt, type ExpandedKeys } from '@invana/ui';

import { jsx, snippet } from '../../_story/source';
import { VariantBoard, type Log } from '../../_story/variant-board';
import { EVENTS, RUN_SPAN_MS, everyTask, formatMs, ganttTasks } from './fixtures';

const TASKS = ganttTasks();
const ALL = everyTask(TASKS);
const FAILED = ALL.filter((t) => t.status === 'failed').length;
const ASIDE = `${formatMs(RUN_SPAN_MS)} · ${ALL.length} tasks · ${FAILED} failed · ${EVENTS.length} events`;

/** Every task on the way down to a failed one — what "Open failures" opens. */
function failurePaths(): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  const walk = (list: typeof TASKS): boolean =>
    list.some((t) => {
      const below = walk(t.rows ?? []);
      if (below) open[t.key] = true;
      return below || t.status === 'failed';
    });
  walk(TASKS);
  return open;
}

const VARIANTS = [{ caption: 'Task Timeline', wide: true }];

interface Args {
  onSelectRow: (key: string | null) => void;
  onExpandedChange: (expanded: ExpandedKeys) => void;
}

function Live({ log, onSelectRow, onExpandedChange }: Args & { log: Log }) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandedKeys>({ plan: true });
  const open = (next: ExpandedKeys, by: string) => {
    onExpandedChange(next);
    log(by, next);
    setExpanded(next);
  };
  return (
    <Stack gap="sm">
      <ButtonGroup>
        <Button size="xs" variant="outline" onClick={() => open(failurePaths(), 'Open failures')}>
          Open failures
        </Button>
        <Button size="xs" variant="outline" onClick={() => open(true, 'Open all')}>
          Open all
        </Button>
        <Button size="xs" variant="outline" onClick={() => open({}, 'Collapse all')}>
          Collapse all
        </Button>
      </ButtonGroup>
      <PanelBox title="Timeline" aside={ASIDE}>
        <Gantt
          rows={TASKS}
          spanMs={RUN_SPAN_MS}
          ticks={9}
          detailProps={{ width: 300 }}
          expanded={expanded}
          onExpandedChange={(next) => open(next, 'onExpandedChange')}
          selectedKey={selected}
          onSelectRow={(key) => {
            const next = key === selected ? null : key;
            onSelectRow(next);
            log('onSelectRow', next);
            setSelected(next);
          }}
        />
      </PanelBox>
    </Stack>
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
          imports: ["import { PanelBox, Gantt } from '@invana/ui';"],
          comment: 'The log folded into the plan\'s tree of tasks — derived from fixtures/data-tables/telemetry-run.json',
          data: { tasks: [{ ...TASKS[0]!, rows: TASKS[0]!.rows!.slice(0, 2) }] },
          setup: [
            '// Which tasks are open, by key: { plan: true, analyse: true } — or `true` for all.',
            'const [expanded, setExpanded] = React.useState({ plan: true });',
            '// The task\'s key — pick it again to clear the pick.',
            'const [selected, setSelected] = React.useState(null);',
          ].join('\n'),
          call: `<PanelBox title="Timeline" aside="${ASIDE}">\n  ${jsx('Gantt', {
            rows: 'tasks',
            spanMs: String(RUN_SPAN_MS),
            ticks: '9',
            detailProps: '{ width: 300 }',
            expanded: 'expanded',
            onExpandedChange: 'setExpanded',
            selectedKey: 'selected',
            onSelectRow: '(key) => setSelected(key === selected ? null : key)',
          }).replace(/\n/g, '\n  ')}\n</PanelBox>`,
        }),
      },
    },
  },
  args: { onSelectRow: fn(), onExpandedChange: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The log folded into the plan's tree of tasks, on the run's clock: `plan` opens into its five
 * fetches, `analyse`, `write` and `verify`, and `analyse` into `margins` and `risk`.
 *
 * Empty track before a bar is time the task waited — for a slot, or for the tasks it depends on
 * (`analyse` waits on all five fetches). `fetch_filings` carries its rate-limited first attempt in
 * red to the left of the retry that stuck; `analyse.risk` failed and was not retried. Hover a row
 * for its agent, slots, call count, tokens and last log line — the card opens beside the cursor;
 * click one to pick it. **Open failures** opens every task on the way to one.
 */
export const TaskTimeline: Story = {
  render: (args) => <VariantBoard variants={VARIANTS}>{(_v, log) => <Live {...args} log={log} />}</VariantBoard>,
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Task Timeline' }));
    await step('Pick the plan', async () => {
      await userEvent.click(cell.getAllByRole('button', { pressed: false })[0]!);
      await expect(args.onSelectRow).toHaveBeenCalledWith('plan');
      await expect(cell.getByRole('button', { pressed: true })).toHaveTextContent('plan');
    });
    await step('Open every failure: the failed subtask shows under analyse', async () => {
      await expect(cell.queryByText('analyse.risk')).toBeNull();
      await userEvent.click(cell.getByRole('button', { name: 'Open failures' }));
      await expect(args.onExpandedChange).toHaveBeenCalledWith(failurePaths());
      await expect(cell.getByText('analyse.risk')).toBeInTheDocument();
    });
    await step('Close analyse from its own chevron', async () => {
      await userEvent.click(cell.getByRole('button', { name: 'Close analyse' }));
      await expect(cell.queryByText('analyse.risk')).toBeNull();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onExpandedChange');
    });
  },
};
