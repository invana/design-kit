import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, FilterChip, RunRow } from '@invana/ui';

const meta: Meta<typeof RunRow> = {
  title: 'UI/UI Extended/RunRow',
  component: RunRow,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RUNS = [
  { address: '7d3184f1', title: 'which carriers were late in H1?', meta: 'nl-query@5 · 2m 51s · 21.4k · 9/9 · 4 mins ago', status: 'succeeded', depth: 0 },
  { address: 'c0193ab7', title: 'Nightly bundle — 4 datasets', meta: 'bulk-load@2 · 6m 12s · 12/14', status: 'running', depth: 0 },
  { address: '91be2204', title: 'orders.csv → Brokerage.Order', meta: 'import@3 · 1.4s · 5/7 · 18 mins ago', status: 'succeeded', depth: 1 },
  { address: '3c77ba15', title: 'news-tv.csv → Media.Story', meta: 'import@3 · 0/7', status: 'queued', depth: 1 },
  { address: 'b738ba9c', title: 'MATCH (c:Carrier)-[:OPERATES]->(r:Route) RETURN c, r LIMIT 50', mono: true, meta: 'ql-query · 32ms · 3/3 · 38 mins ago', status: 'succeeded', depth: 0 },
  { address: '017c755e', title: 'which routes lost the most seats since March?', meta: 'nl-single@2 · 22s · 7.3k · 7/7 · served partial · 52 mins ago', status: 'partial', depth: 0 },
  { address: '44f7c8d2', title: 'which suppliers slipped twice?', meta: 'nl-query@5 · 18.2s · 9.1k · 6/6 · 1 hr ago', status: 'cannot_answer', depth: 0 },
  { address: '0f3da30e', title: 'MATCH (a:Airport {code: $code}) RETURN a', mono: true, meta: 'ql-direct@1 · 36ms · 2/5 · 1 hr ago', status: 'failed', depth: 0 },
  { address: '6e5510cc', title: 'Escalate a late supplier', meta: 'enrich@1 · 2m 04s · 4/5 · waiting on ravi', status: 'awaiting_approval', depth: 0 },
  { address: 'a41d07b3', title: 'how many flights left LHR yesterday?', meta: 'nl-query@5 · 3.2s · 2.1k · 2/9 · 3 hrs ago', status: 'cancelled', depth: 0 },
];

/**
 * The journal: everything that has run in this Graph, newest first.
 *
 * A question, a bundle, two imports under it, an enrichment parked on a person
 * — **one row type, because they are one record**. The status is the glyph in
 * front — a check, a cross, a spinner, a pause on a person — and never a word
 * on the row.
 *
 * Children sit **under** the run that spawned them, indented. The two imports
 * here belong to the bundle above them, and a flat list would make them read as
 * three unrelated loads.
 *
 * The prompt is line one, in the words it was asked; a query reads mono. The
 * id and the plan open line two.
 */
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('7d3184f1');
    return (
      <div className="w-[420px] border border-border bg-card">
        <FilterBar summary="10 of 24 shown">
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
            address={run.address}
            title={run.title}
            titleMono={run.mono}
            meta={run.meta}
            depth={run.depth}
            selected={selected === run.address}
            onSelect={() => setSelected(run.address)}
          />
        ))}
      </div>
    );
  },
};
