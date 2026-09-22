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
  title: 'Dashboard/D7 Run · in order',
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
  title: 'run:7d3184f1',
  header: {
    tone: 'success',
    crumbs: ['runs', 'run:7d3184f1'],
    chips: [
      { label: 'succeeded' },
      { label: '9 events' },
      { label: '2 of 3 rounds' },
    ],
    actions: [
      {
        id: 'reading',
        options: ['In order', 'Layers', 'Flow', 'Lens'],
        value: 'In order',
      },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    {
      panels: [
        {
          kind: 'touched',
          title: 'What it touched',
          aside: 'declared 4 · touched 4 · refused 1',
          options: {
            palette: PALETTE,
            items: [
              { layer: 'llm', note: '3 calls' },
              { layer: 'graph_data', note: '1,284 rows' },
              { layer: 'agent', note: '2 checks' },
              { layer: 'human', note: 'asked + approved' },
              { layer: 'third_party', note: 'refused', refused: true },
              { layer: 'cache', note: 'miss', dim: true },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'trace',
          title: 'The run — in order',
          aside: 'seq ↓ · 6.4s of work, 2m 45s of waiting',
          flush: true,
          options: {
            palette: PALETTE,
            selectedId: 'execute_query',
            selectAction: 'open-step',
            entries: [
              {
                kind: 'loop',
                label: '↻ 2 of 3 rounds — understood on round 2',
                summary: '3 events · 42.8s',
                rounds: [
                  {
                    seq: 1,
                    id: 'parse_intent_1',
                    name: 'parse_intent',
                    description: 'Two readings: late by ship date, or by promise date',
                    layer: 'llm',
                    role: 'extract',
                    duration: '0.9s',
                    note: 'round 1',
                  },
                  {
                    seq: 2,
                    id: 'ask_user',
                    name: 'ask_user',
                    description: 'ravi chose — by promise date',
                    layer: 'human',
                    role: 'clarification',
                    duration: '41.2s',
                    note: 'answered',
                    mark: '⏸ 1 of 3',
                  },
                  {
                    seq: 3,
                    id: 'parse_intent_2',
                    name: 'parse_intent',
                    description: 'One reading now — 12 entities named',
                    layer: 'llm',
                    role: 'extract',
                    duration: '0.7s',
                    note: 'round 2',
                  },
                ],
              },
              {
                seq: 4,
                id: 'resolve_schema',
                name: 'resolve_schema',
                description: 'Routes@v4, Carriers@v2 — Deal@v3 allowed, never needed',
                layer: 'graph_data',
                role: 'schema',
                duration: '0.2s',
                note: '2 models',
              },
              {
                seq: 5,
                id: 'build_query',
                name: 'build_query',
                description: 'A read over Routes · H1 2026 · IE·DE·FR',
                layer: 'llm',
                role: 'decide',
                duration: '1.4s',
                note: 'ok',
              },
              {
                seq: 6,
                id: 'validate_query',
                name: 'validate_query',
                description: 'Inside the read subset',
                layer: 'agent',
                role: 'check',
                duration: '0.1s',
                note: 'passed',
              },
              {
                kind: 'gate',
                label: 'approval — approved by ravi',
                note: 'est. 1.2M rows > 500,000 · waited 2m 04s · nothing was spent',
              },
              {
                seq: 7,
                id: 'execute_query',
                name: 'execute_query',
                description: 'The first try timed out; the second returned',
                layer: 'graph_data',
                role: 'read_only',
                duration: '2.1s',
                note: '1,284 rows',
                mark: '↺ 2 of 3',
              },
              {
                seq: 8,
                id: 'summarise',
                name: 'summarise',
                description: 'Six carriers account for 71% of the lateness',
                layer: 'llm',
                role: 'extract',
                duration: '0.9s',
                note: 'ok',
              },
              {
                seq: 9,
                id: 'deliver',
                name: 'deliver',
                description: 'Rows and summary handed to the canvas',
                layer: 'agent',
                role: 'spine',
                duration: '0.1s',
                note: 'done',
              },
            ],
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'attempts',
          title: 'execute_query — its clock, attempt by attempt',
          aside: 'elapsed 32.4s · working 2.3s',
          flush: true,
          options: {
            summary: 'elapsed 32.4s · working 2.3s — the gap is the attempt that timed out',
            rows: [
              { label: 'queued', started: '+44.3s', took: '0.2s', what: 'dispatched to the graph connector', tone: 'muted' },
              { label: 'attempt 1', started: '+44.5s', took: '30.0s', what: 'timed out — the connector never answered', tone: 'destructive', struck: true },
              { label: 'attempt 2', started: '+74.6s', took: '2.1s', what: 'cursor drained · 1,284 rows', tone: 'success' },
              { label: 'settled', started: '+76.7s', took: '—', what: 'result.json written by the interpreter', tone: 'muted' },
            ],
          },
        },
      ],
    },
  ],
};

/**
 * A run page as a **spec**, not a page: the three readings this pack adds —
 * `touched`, `trace` and `attempts` — drawn by `Dashboard` from the same JSON
 * shape the engine already sends for tiles and logs.
 *
 * They arrive as `RUN_PANELS` rather than as built-in kinds. The default
 * registry is eleven kinds that two unrelated surfaces each need; these three
 * are one surface family's, so a consumer that only wanted tiles and a log does
 * not carry the run vocabulary — and a product that draws runs does not copy
 * the adapter.
 */
export const RunInOrder: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <Surface last={last}>
        <Dashboard
          spec={SPEC}
          registry={RUN_PANELS}
          icons={ICONS}
          onAction={(id, ctx) =>
            setLast(`${id}${ctx?.stepId ? ` · ${ctx.stepId}` : ''}`)
          }
        />
      </Surface>
    );
  },
};
