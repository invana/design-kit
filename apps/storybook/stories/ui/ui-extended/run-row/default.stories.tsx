import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, FilterBar, FilterChip, RunRow } from '@invana/ui';

const meta: Meta<typeof RunRow> = {
  title: 'UI/UI Extended/RunRow',
  component: RunRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RUNS = [
  {
    address: '7d3184f1',
    kind: 'ask',
    title: 'which carriers were late in H1?',
    meta: '2m 51s · 21.4k · 9/9 · 4 mins ago',
    status: 'succeeded',
    depth: 0,
    tasks: '9/9',
  },
  {
    address: 'c0193ab7',
    kind: 'bulk',
    title: 'Nightly bundle — 4 datasets',
    meta: '6m 12s · 12/14 · running',
    status: 'running',
    depth: 0,
    tasks: '12/14',
  },
  {
    address: '91be2204',
    kind: 'import',
    title: 'orders.csv → Brokerage.Order',
    meta: '1.4s · 5/7 · 18 mins ago',
    status: 'succeeded',
    depth: 1,
    tasks: '5/7',
  },
  {
    address: '3c77ba15',
    kind: 'import',
    title: 'news-tv.csv → Media.Story',
    meta: 'queued · 0/7',
    status: 'queued',
    depth: 1,
    tasks: '0/7',
  },
  {
    address: '44f7c8d2',
    kind: 'ask',
    title: 'which suppliers slipped twice?',
    meta: '18.2s · 9.1k · 6/6 · 1 hr ago',
    status: 'cannot_answer',
    depth: 0,
    tasks: '6/6',
  },
  {
    address: '6e5510cc',
    kind: 'enrich',
    title: 'Escalate a late supplier',
    meta: '2m 04s · 4/5 · waiting on ravi',
    status: 'awaiting_approval',
    depth: 0,
    tasks: '4/5',
  },
];

/**
 * The journal: everything that has run in this Graph, newest first.
 *
 * A question, a bundle, two imports under it, an enrichment parked on a person
 * — **one row type, because they are one record**. There is no panel per kind
 * and no icon per kind: the kind is a chip and a filter value, which is what
 * stops one journal becoming four lists that drift apart.
 *
 * Children sit **under** the run that spawned them, indented. The two imports
 * here belong to the bundle above them, and a flat list would make them read as
 * three unrelated loads.
 *
 * Addressed first, then described, then measured. A reader scanning for the run
 * they were just looking at finds it by its eight characters.
 */
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('7d3184f1');
    return (
      <div className="w-[420px] border border-border bg-card">
        <FilterBar summary="8 of 24 shown">
          <FilterChip label="kind" />
          <FilterChip label="status" />
          <FilterChip
            label="since"
            value="today"
            active
            onRemove={() => undefined}
          />
        </FilterBar>
        {RUNS.map((run) => (
          <RunRow
            key={run.address}
            status={run.status}
            kind={run.kind}
            address={run.address}
            title={run.title}
            meta={run.meta}
            depth={run.depth}
            aside={
              <Badge variant="outline" size="xs" tone="muted">
                {run.status}
              </Badge>
            }
            selected={selected === run.address}
            onSelect={() => setSelected(run.address)}
          />
        ))}
      </div>
    );
  },
};
