import type { Meta, StoryObj } from '@storybook/react-vite';
import { Terminal, TerminalLine, type TerminalLevel } from '@invana/ui';

const meta: Meta<typeof Terminal> = {
  title: 'UI/UI Extended/Terminal',
  component: Terminal,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LOG: Array<[string, TerminalLevel, string, string]> = [
  ['00.00', 'info', 'check_bundle', 'manifest read · 1 dataset · orders.csv'],
  ['00.04', 'info', 'fetch_source', 'GET s3://drops/orders.csv'],
  ['00.35', 'warn', 'fetch_source', 'refused · 503 · retrying (2 of 3)'],
  ['00.95', 'info', 'fetch_source', '200 · 1.4 MB in 0.6s'],
  ['02.10', 'warn', 'validate_records', '47 of 1,251 reported · see import_report'],
  ['02.15', 'info', 'import_dataset', 'fan-out · 3 lanes of 402'],
  ['05.60', 'error', 'announce', 'webhook refused · #data-eng · will retry'],
];

/**
 * The same transcript component carrying a **run's log** rather than a CLI
 * hand-off.
 *
 * `level` tints exactly one cell — the one `levelColumn` names, `1` by default,
 * because a log reads `time · LEVEL · source · message`. The message is never
 * tinted: a wall of amber sentences is unreadable, and what a reader scans is
 * the column, not the prose.
 *
 * The level **word** stays in `columns`. Colour is never the carrier.
 *
 * Setting `level` also drops the `kind` marker — a log line is not a transcript
 * line and does not want a `→` in front of it.
 */
export const RunLog: Story = {
  render: () => (
    <div className="w-[720px]">
      <Terminal columnTemplate="48px 44px 132px minmax(0,1fr)">
        {LOG.map(([time, level, task, message]) => (
          <TerminalLine
            key={time + task}
            level={level}
            columns={[time, level.toUpperCase(), task, message]}
          />
        ))}
      </Terminal>
    </div>
  ),
};
