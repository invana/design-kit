import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelBox, SegmentedControl, Terminal, TerminalLine } from '@invana/ui';

const meta: Meta<typeof SegmentedControl> = {
  title: 'UI/UI/SegmentedControl',
  component: SegmentedControl,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const LINES = [
  ['+74.5s', 'error', 'connector timed out after 30s — no rows returned'],
  ['+74.6s', 'warn', 'retrying — attempt 2 of 3 · bound is 3'],
  ['+76.2s', 'info', 'cursor opened · 11 of 12 properties projected'],
  ['+76.7s', 'info', 'cursor drained · 1,284 rows · 2.1s'],
] as const;

/**
 * The same control filtering a log, stretched across the header it sits in, with
 * one option switched off because nothing in this slice is at that level.
 *
 * **A disabled option is still drawn.** `Debug` missing from the strip would
 * say this stream has no debug level; drawn and unpickable says this step left
 * none, which is the fact.
 */
export const Stretch: Story = {
  render: () => {
    const [level, setLevel] = React.useState('all');
    return (
      <div className="w-[520px]">
        <PanelBox
          title="Log for this step"
          aside={
            <SegmentedControl
              aria-label="Filter by level"
              size="xs"
              stretch
              value={level}
              onValueChange={setLevel}
              className="w-[260px]"
              options={[
                { value: 'all', label: 'All' },
                { value: 'info', label: 'Info' },
                { value: 'warn', label: 'Warn' },
                { value: 'error', label: 'Error' },
                { value: 'debug', label: 'Debug', disabled: true },
              ]}
            />
          }
          flush
        >
          <Terminal columnTemplate="64px 48px minmax(0,1fr)">
            {LINES.filter(
              ([, lvl]) => level === 'all' || level === lvl,
            ).map(([time, lvl, message]) => (
              <TerminalLine
                key={time}
                level={lvl as 'info' | 'warn' | 'error'}
                columns={[time, lvl.toUpperCase(), message]}
              />
            ))}
          </Terminal>
        </PanelBox>
      </div>
    );
  },
};
