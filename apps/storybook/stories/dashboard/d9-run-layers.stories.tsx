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
  title: 'Dashboard/D9 Run · layers and lens',
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
    chips: [{ label: 'succeeded' }, { label: '6.4s of work' }, { label: '2m 45s of waiting' }],
    actions: [
      { id: 'reading', options: ['In order', 'Layers', 'Flow', 'Lens'], value: 'Layers' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    {
      panels: [
        {
          kind: 'layers',
          title: 'Layers — what each participant did, and when',
          aside: '6.4s of work · 2m 45s of waiting',
          options: {
            palette: PALETTE,
            scale: 'elapsed',
            minTrackWidth: 70,
            bands: [
              { layer: 'human', note: '1 asked · 1 approved' },
              { layer: 'agent', note: '2 checks', spine: true },
              { layer: 'llm', note: '2 models · 3 calls' },
              { layer: 'graph_data', note: '2 models · 1,284 rows' },
              { layer: 'cache', note: 'miss — nothing was reused' },
              { layer: 'third_party', note: 'nothing left the graph' },
            ],
            items: [
              { id: 'parse-1', label: 'parse_intent', layer: 'llm', start: 0, end: 900, state: 'in', forecast: { p50: 800 } },
              { id: 'ask', label: 'ask_user', layer: 'human', start: 900, end: 42_100, state: 'in', forecast: { p50: 26_000, note: '+58%' } },
              { id: 'parse-2', label: 'parse_intent', layer: 'llm', start: 42_100, end: 42_800, state: 'in' },
              { id: 'resolve', label: 'resolve_schema', layer: 'graph_data', start: 42_800, end: 43_000, state: 'in' },
              { id: 'build', label: 'build_query', layer: 'llm', start: 43_000, end: 44_400, state: 'in' },
              { id: 'validate', label: 'validate_query', layer: 'agent', start: 44_400, end: 44_500, state: 'in' },
              { id: 'clearbit', label: 'api/clearbit.com/**', layer: 'third_party', start: 44_500, end: 44_600, state: 'refused', ruleMatched: 'third_party/api/clearbit.com/**' },
              { id: 'execute', label: 'execute_query', layer: 'graph_data', start: 168_000, end: 170_100, state: 'in', forecast: { p50: 1_900, note: '+11%' } },
              { id: 'summarise', label: 'summarise', layer: 'llm', start: 170_100, end: 171_000, state: 'in' },
            ],
            brackets: [
              { id: 'rounds', start: 0, end: 42_800, label: '↻ 2 of 3 rounds' },
            ],
            seams: [
              {
                id: 'approval',
                at: 44_600,
                label: 'approval — approved by ravi',
                note: 'waited 2m 04s · nothing spent',
                edge: 'before',
                noEstimate: true,
              },
            ],
            selectAction: 'open-step',
          },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'lens',
          title: 'Every participant this run could have spent',
          aside: 'refusals struck, never hidden',
          options: {
            palette: PALETTE,
            sections: [
              {
                layer: 'graph_data',
                summary: '3 allowed · 2 touched',
                participants: [
                  { address: 'graph_data/model/Routes@v4', verdict: 'touched', note: '1,284 rows · step 7' },
                  { address: 'graph_data/model/Carriers@v2', verdict: 'touched', note: 'schema only · step 4' },
                  { address: 'graph_data/model/Deal@v3', verdict: 'never touched', note: 'allowed, and nothing asked for it' },
                ],
              },
              {
                layer: 'llm',
                summary: '3 allowed · 2 touched',
                participants: [
                  { address: 'llm/anthropic-prod/claude-haiku-4.5', verdict: 'touched', note: '3 calls · extract' },
                  { address: 'llm/anthropic-prod/claude-opus-5', verdict: 'touched', note: '1 call · decide' },
                  { address: 'llm/ollama-local/llama-3.3', verdict: 'never touched', note: 'allowed as a judge, never asked' },
                ],
              },
              {
                layer: 'third_party',
                summary: '1 allowed · 0 touched',
                participants: [
                  { address: 'third_party/api/clearbit.com/**', verdict: 'refused', note: 'denied by a guardrail' },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};

/**
 * The run's other two readings, from the same record: **Layers** — the strip in
 * the run's tense, with the plan's median on each bar — and **Lens**, the gap
 * between what the world allowed and what the run did.
 *
 * The approval gate is dashed and says *no estimate exists*: how long a person
 * takes to say yes is not in the record, and two minutes of this three-minute
 * run sat there. Drawing a guess would be the one dishonest mark on the strip.
 */
export const RunLayers: Story = {
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
