import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard, type DashboardSpec } from '@invana/dashboard';

import { ICONS, Surface, WHERE_IT_SITS } from './_fixtures';

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/D4 Step Llm',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SPEC: DashboardSpec = {
  header: {
    tone: 'success',
    crumbs: ['orders.csv → Brokerage.Order', 'understand_intent'],
    chips: [{ bound: 'llm', label: 'llm' }, { label: 'succeeded', tone: 'warning' }, { label: 'step dashboard' }],
    actions: [
      { id: 'prev', icon: 'prev', variant: 'ghost' },
      { id: 'next', icon: 'next', variant: 'ghost' },
      { id: 'view', options: ['Dashboard', 'dashboard.yml'], value: 'Dashboard' },
      { id: 'more', icon: 'more', variant: 'ghost' },
    ],
  },
  rows: [
    { panels: [{ kind: 'metrics', options: { tiles: [
      { label: 'Status', value: 'ok', caption: 'asked back once', tone: 'success' },
      { label: 'Duration', value: '0.7s', caption: 'incl. the pause' },
      { label: 'Tokens', value: '1.5k', caption: 'in 1,204 · out 312' },
      { label: 'Cost', value: '$0.01', caption: 'of $2.00 budget', meter: 0.005 },
      { label: 'Model', value: 'opus', caption: 'claude-opus-5' },
    ] } }] },
    {
      panels: [
        {
          kind: 'properties',
          title: 'Input · the request, resolved',
          aside: 'args after ${…} binding',
          options: { rows: [
            { label: 'question', value: '"Which suppliers are exposed…"' },
            { label: 'lens', value: '4 models · 6 stitches' },
            { label: 'skills offered', value: '2 · due-diligence, exposure' },
            { label: 'temperature', value: '0.2' },
            { label: 'clarification', value: 'allowed · 1 round' },
          ] },
        },
        {
          kind: 'json',
          title: 'result.json',
          aside: 'rendered from result.json',
          width: 340,
          flush: true,
          options: { maxHeight: 232, value: {
            task: 'understand_intent',
            status: 'ok',
            outputs: { intent: 'exposure_by_route', clarified: true, answer: 'Q3 2026' },
            llm: { model: 'claude-opus-5', tokens: { in: 1204, out: 312 }, usd: 0.01 },
            artifacts: ['prompt.txt', 'completion.json'],
          } },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'exchange',
          title: 'Output · the exchange',
          aside: 'prompt and completion, as recorded',
          options: {
            blocks: [
              {
                label: 'Prompt · 1,204 tokens',
                value: 'You are reading a question against a graph of 4 models…\nQuestion: "Which suppliers are exposed to the Red Sea route?"',
              },
              {
                label: 'Completion · 312 tokens',
                language: 'json',
                value: '{"intent": "exposure_by_route", "missing": ["quarter"], "ask_back": "Which quarter?"}',
              },
            ],
          },
        },
        {
          kind: 'list',
          title: 'Artifacts',
          aside: '2',
          width: 340,
          options: { items: [
              { id: 'prompt', icon: 'file', title: 'prompt.txt', mono: true, meta: '6 KB · exactly what was sent', chip: { label: 'output' }, action: 'open-artifact' },
              { id: 'completion', icon: 'file', title: 'completion.json', mono: true, meta: '1 KB', chip: { label: 'output' }, action: 'open-artifact' },
            ] },
        },
      ],
    },
    {
      panels: [
        {
          kind: 'log',
          title: 'Log · this task only',
          aside: '3 lines',
          flush: true,
          options: { lines: [
              { time: '00.00', level: 'info', source: 'understand_intent', message: 'intent · exposure by supplier and route' },
              { time: '00.35', level: 'warn', source: 'understand_intent', message: 'ambiguous · asked back: which quarter?' },
              { time: '00.70', level: 'info', source: 'understand_intent', message: 'answered · Q3 2026' },
            ] },
        },
        {
          kind: 'properties',
          title: 'Where it sits',
          width: 340,
          options: WHERE_IT_SITS('understand_intent', '—'),
        },
      ],
    },
  ],
};

/**
 * **D4 · a step that spends the llm** — `understand_intent`, which asked back once.
 *
 * Artboard 34n. The Output panel is an `exchange`: a prompt and its completion,
 * together, because a completion shown without the prompt that produced it is
 * not evidence.
 */
export const Default: Story = {
  render: () => {
    const [last, setLast] = React.useState('—');
    return (
      <Surface last={last}>
        <Dashboard
          spec={SPEC}
          icons={ICONS}
          onAction={(id, ctx) => setLast([id, ctx?.itemId, ctx?.option].filter(Boolean).join(' · '))}
          className="min-h-0 flex-1"
        />
      </Surface>
    );
  },
};
