import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dashboard,
  RUN_PANELS,
  type DashboardSpec,
  type RunPanelOptions,
} from '@invana/dashboard';
import type { LayerPalette } from '@invana/ui';

import { ICONS, Surface } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D8 Step · touched',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1' },
  llm: { swatch: 'bg-data-7' },
  third_party: { swatch: 'bg-data-8' },
  cache: { swatch: 'bg-data-3' },
  human: { swatch: 'bg-data-6' },
};

const SPEC: DashboardSpec<RunPanelOptions> = {
  title: 'step:9b1c40e2',
  header: {
    tone: 'success',
    crumbs: ['runs', 'run:7d3184f1', 'step:9b1c40e2 execute_query'],
    chips: [{ label: 'graph_read' }, { label: 'succeeded' }],
    actions: [
      { id: 'reading', options: ['Overview', 'Touched', 'Log'], value: 'Touched' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    {
      panels: [
        {
          kind: 'metrics',
          options: {
            tiles: [
              { label: 'Read', value: '1,284 rows', caption: 'from one model, in one pass', tone: 'success' },
              { label: 'Written', value: 'nothing', caption: 'the step declared read_only' },
              { label: 'Refused', value: '1', caption: 'a guardrail, not an error', tone: 'error' },
              { label: 'Files it left', value: '2', caption: 'both addressed by digest' },
              { label: 'Cache', value: 'miss', caption: 'nothing to reuse' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'table',
          title: 'What it read',
          aside: 'one row per participant · the count is what came back, not what exists',
          flush: true,
          options: {
            columns: [
              { key: 'address', label: 'address', mono: true },
              { key: 'back', label: 'what came back' },
              { key: 'took', label: 'took', mono: true, align: 'right' },
            ],
            rows: [
              { address: 'graph_data/model/Routes@v4', back: '1,284 rows · 11 of 12 properties', took: '2.1s' },
              { address: 'graph_data/model/Carriers@v2', back: 'schema only — no rows', took: '0.2s' },
              { address: 'cache/query/2f1a9c', back: 'miss — nothing to reuse', took: '—' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'text',
          title: 'What it wrote',
          absent: {
            reason: 'declared-none',
            label: 'read_only: true',
            note: 'The step was dispatched read-only, and the world it ran under allows no write on the graph data layer. A read that changes a graph would be the bug; a read that says so is the record.',
          },
          options: { text: '' },
        },
        {
          kind: 'lens',
          title: 'What it was refused',
          aside: 'struck in place, never hidden',
          options: {
            palette: PALETTE,
            sections: [
              {
                layer: 'third_party',
                summary: '1 allowed · 0 touched',
                participants: [
                  {
                    address: 'third_party/api/clearbit.com/**',
                    verdict: 'refused',
                    note: 'denied by Enrich carriers',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'artifacts',
          title: 'Files it left',
          aside: 'a file is addressed by its digest — the same bytes twice are one artifact',
          flush: true,
          options: {
            openAction: 'open-file',
            downloadAction: 'download-file',
            files: [
              { name: 'result.json', kind: 'interpreter', size: '1.2 KB', digest: '4b1c9e02', written: '+76.7s' },
              { name: 'rows-1284.csv', kind: 'export', size: '142 KB', digest: '9f31a7c4', written: '+76.8s' },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'clarification',
          title: 'Output · an exchange',
          aside: 'the same step shell, when a person was asked',
          flush: true,
          options: {
            asker: 'the agent asks',
            question: '“Late by ship date, or by the date we promised the customer?”',
            why: 'because parse_intent found two readings and was told not to guess',
            options: [
              { label: 'by ship date' },
              { label: 'by promise date', chosen: true },
            ],
            answerer: 'ravi answers',
            answer: 'by promise date',
            answerNote: 'after 41.2s · the run resumed on round 2 with one reading',
          },
        },
        {
          kind: 'json',
          title: 'result.json',
          absent: {
            reason: 'unrecorded',
            note: 'The interpreter writes this document when the row settles. This step is still in flight, so nobody has recorded one yet.',
          },
          options: { value: '{}' },
        },
      ],
    },
  ],
};

/**
 * A step's `Touched` reading — and the two ways a band with nothing in it is
 * handled, which are **not** the same way.
 *
 * *What it wrote* is `declared-none`: the step ran read-only, so the band stays
 * and says so in the words of its own contract. That is the record working, and
 * it is worth a box.
 *
 * *result.json* is `unrecorded`, and it is **not on this page at all** — the
 * spec declares it, and the dashboard drops it. The interpreter writes that
 * document when the row settles, so while a step is in flight there is no
 * `result.json` panel ([SR59]); a box reading *nothing recorded* would be a
 * box claiming the step recorded nothing. Count the panels: the exchange below
 * has the row to itself.
 *
 * Absence is a rule of the **dashboard**, not of each renderer: every kind has
 * the same three ways of having nothing to show — dropped, purged, none
 * declared — and a renderer left to decide for itself reaches for the empty
 * table.
 */
export const StepTouched: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <Surface last={last}>
        <Dashboard
          spec={SPEC}
          registry={RUN_PANELS}
          icons={ICONS}
          onAction={(id, ctx) =>
            setLast(`${id}${ctx?.itemId ? ` · ${ctx.itemId}` : ''}`)
          }
        />
      </Surface>
    );
  },
};
