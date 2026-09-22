import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Legend,
  LegendItem,
  MarkChip,
  PanelBox,
  TraceGate,
  TraceList,
  TraceLoop,
  TraceStep,
} from '@invana/ui';

import { AFTER_GATE, BEFORE_GATE, LAYER_PALETTE, ROUNDS } from './_run';

const meta: Meta<typeof TraceList> = {
  title: 'UI/UI Extended/TraceList',
  component: TraceList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `run:7d3184f1` in the order it happened — the default reading of a run.
 *
 * Three things are drawn rather than described. A **row is a step**, and the
 * layer it spent is the rail down its left edge, because a step spends exactly
 * one. A **loop contains its rounds**, so *understood on round 2* is visible as
 * a second `parse_intent` inside the same box. A **gate lies between rows**,
 * full width, with its chip on the side the cost falls on — above it, nothing
 * had been spent, and that is something the drawing says rather than something
 * a legend claims.
 *
 * Pick a row and it stays a row: the selected step keeps its place in the
 * order, so the shape of the run does not move under the reader.
 */
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('execute_query');
    const row = (step: (typeof ROUNDS)[number], mark?: React.ReactNode) => (
      <TraceStep
        key={`${step.seq}-${step.name}`}
        {...step}
        mark={mark}
        palette={LAYER_PALETTE}
        selected={selected === step.name}
        onSelect={() => setSelected(step.name)}
      />
    );

    return (
      <div className="w-[900px]">
        <PanelBox
          title="The run — in order"
          aside="seq ↓ · 6.4s of work, 2m 45s of waiting"
          flush
        >
          <TraceList>
            <TraceLoop
              label="↻ 2 of 3 rounds — understood on round 2"
              summary="3 events · 42.8s"
            >
              {ROUNDS.map((step) =>
                row(step, step.name === 'ask_user' ? <MarkChip>⏸ 1 of 3</MarkChip> : undefined),
              )}
            </TraceLoop>
            {BEFORE_GATE.map((step) => row(step))}
            <TraceGate
              label="approval — approved by ravi"
              note="est. 1.2M rows > 500,000 · waited 2m 04s · nothing was spent while it waited"
            />
            {AFTER_GATE.map((step) =>
              row(
                step,
                step.name === 'execute_query' ? <MarkChip>↺ 2 of 3</MarkChip> : undefined,
              ),
            )}
          </TraceList>
          <Legend className="border-t border-border px-3 py-1.5">
            <LegendItem
              kind="stripe"
              color="var(--color-data-1)"
              label="the stripe is the layer — a step touches exactly one"
            />
            <LegendItem
              kind="bracket"
              color="var(--color-warning)"
              label="a bounded repetition contains its rounds"
            />
            <LegendItem
              kind="rule"
              color="var(--color-destructive)"
              label="a gate lies between rows — above it, nothing is spent"
            />
          </Legend>
        </PanelBox>
      </div>
    );
  },
};
