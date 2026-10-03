import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Legend,
  LegendItem,
  MarkChip,
  PanelBox,
  TraceGate,
  TraceList,
  TraceLoop,
  TraceStep,
  type LayerPalette,
  type LegendSwatchKind,
} from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/trace-list.json';
import run from '../../../../fixtures/runs/variance-run.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { EventLog, VariantGrid, type Log } from '../../../_story/variant-grid';

type MarkTone = React.ComponentProps<typeof MarkChip>['tone'];

interface StepItem {
  type: 'step';
  seq: number;
  name: string;
  description: string;
  layer: string;
  role: string;
  duration: string;
  note: string;
  mark?: { label: string; tone?: MarkTone };
  dim?: boolean;
  struck?: boolean;
  depth?: number;
}
interface LoopItem {
  type: 'loop';
  label: string;
  summary: string;
  steps: StepItem[];
}
interface GateItem {
  type: 'gate';
  label: string;
  note: string;
  tone?: 'destructive' | 'warning' | 'muted';
}
type Item = StepItem | LoopItem | GateItem;

interface TraceVariant {
  caption: string;
  wide?: boolean;
  width?: number;
  live?: boolean;
  aside: string;
  /** `seq-name` of the picked row; a variant with it is pickable. */
  selected?: string;
  items: Item[];
  legend?: { kind: LegendSwatchKind; color: string; label: string }[];
}

const VARIANTS = DATA as TraceVariant[];

/** The hues are the caller's — the kit ships none. Matching the Gantt's Layer access. */
const LAYER_PALETTE: LayerPalette = {
  graph_data: { swatch: 'bg-data-1', text: 'text-data-1' },
  llm: { swatch: 'bg-data-7', text: 'text-data-7' },
  third_party: { swatch: 'bg-data-8', text: 'text-data-8' },
  cache: { swatch: 'bg-data-3', text: 'text-data-3' },
  human: { swatch: 'bg-data-6', text: 'text-data-6' },
};

// ── The live cell: `fixtures/runs/variance-run.json` streamed as step events ──

type Status = 'done' | 'running' | 'pending' | 'failed' | 'waiting' | 'retrying' | 'stopped';
interface StepEvent {
  step: string;
  status: Status;
  duration?: string;
  error?: string | null;
}
interface ProgressStep {
  id: string;
  name: string;
  status: Status;
  duration?: string;
  error?: string;
}
const EVENTS = run.events as StepEvent[];

/** The run after `events`: every step pending until an event names it, then as it last said. */
function stepsAfter(events: StepEvent[]): ProgressStep[] {
  return run.steps.map((s) =>
    events
      .filter((e) => e.step === s.id)
      .reduce<ProgressStep>(
        (step, e) => ({
          ...step,
          status: e.status,
          duration: e.duration ?? step.duration,
          error: e.error === null ? undefined : (e.error ?? step.error),
        }),
        { ...s, status: 'pending' },
      ),
  );
}

function Progress() {
  const replay = useReplay(EVENTS.length, { every: 600 });
  const received = EVENTS.slice(0, replay.at);
  const steps = stepsAfter(received);
  const done = steps.filter((s) => s.status === 'done').length;
  return (
    <ReplayFrame replay={replay} noun="event" width={420}>
      <PanelBox title={run.title} aside={`${done} of ${steps.length} steps`}>
        <TraceList variant="progress">
          {steps.map((s) => (
            <TraceStep key={s.id} name={s.name} status={s.status} duration={s.duration} error={s.error} />
          ))}
        </TraceList>
      </PanelBox>
      <EventLog sent={received.slice(-3).map((e) => ({ name: 'event', payload: e }))} />
    </ReplayFrame>
  );
}

// ── The static readings ──

const keyOf = (s: StepItem) => `${s.seq}-${s.name}`;

function Trace({ v, log, onSelect }: { v: TraceVariant; log: Log; onSelect: Args['onSelect'] }) {
  const [selected, setSelected] = React.useState(v.selected);
  const pickable = v.selected != null;
  const row = (s: StepItem) => (
    <TraceStep
      key={keyOf(s)}
      seq={s.seq}
      name={s.name}
      description={s.description}
      layer={s.layer}
      role={s.role}
      duration={s.duration}
      note={s.note}
      dim={s.dim}
      struck={s.struck}
      depth={s.depth}
      mark={s.mark ? <MarkChip tone={s.mark.tone}>{s.mark.label}</MarkChip> : undefined}
      palette={LAYER_PALETTE}
      selected={pickable && selected === keyOf(s)}
      onSelect={
        pickable
          ? () => {
              const payload = { seq: s.seq, name: s.name };
              onSelect(payload);
              log('onSelect', payload);
              setSelected(keyOf(s));
            }
          : undefined
      }
    />
  );
  return (
    <PanelBox title={v.caption} aside={v.aside} flush>
      <TraceList>
        {v.items.map((item, i) =>
          item.type === 'loop' ? (
            <TraceLoop key={i} label={item.label} summary={item.summary}>
              {item.steps.map(row)}
            </TraceLoop>
          ) : item.type === 'gate' ? (
            <TraceGate key={i} label={item.label} note={item.note} tone={item.tone} />
          ) : (
            row(item)
          ),
        )}
      </TraceList>
      {v.legend ? (
        <Legend>
          {v.legend.map((l) => (
            <LegendItem key={l.label} kind={l.kind} color={l.color} label={l.label} />
          ))}
        </Legend>
      ) : null}
    </PanelBox>
  );
}

// ── The Code tab ──

function stepCall(s: StepItem, pickable: boolean) {
  const props = (['seq', 'name', 'description', 'layer', 'role', 'duration', 'note'] as const)
    .map((k) => (typeof s[k] === 'number' ? `${k}={${s[k]}}` : `${k}="${s[k]}"`))
    .concat(s.mark ? [`mark={<MarkChip${s.mark.tone ? ` tone="${s.mark.tone}"` : ''}>${s.mark.label}</MarkChip>}`] : [])
    .concat(s.dim ? ['dim'] : [], s.struck ? ['struck'] : [], s.depth ? [`depth={${s.depth}}`] : [])
    .concat(['palette={palette}'])
    .concat(pickable ? [`selected={selected === ${s.seq}}`, `onSelect={() => onSelect({ seq: ${s.seq}, name: "${s.name}" })}`] : []);
  return `<TraceStep ${props.join(' ')} />`;
}

function source(v: TraceVariant) {
  if (v.live) {
    return {
      comment: v.caption,
      data: { initial: run.steps.map((s) => ({ ...s, status: 'pending' })) },
      setup: [
        '// Each event the run streams — { step: "fx", status: "retrying", duration: "attempt 2", error: "…" } —',
        '// replaces what that step last said. The list redraws from props.',
        'const [steps, setSteps] = React.useState(initial);',
        'React.useEffect(() => run.subscribe((e) =>',
        '  setSteps((all) => all.map((s) => (s.id === e.step ? { ...s, ...e } : s))),',
        '), []);',
      ].join('\n'),
      call: [
        '<TraceList variant="progress">',
        '  {steps.map((s) => (',
        '    <TraceStep key={s.id} name={s.name} status={s.status} duration={s.duration} error={s.error} />',
        '  ))}',
        '</TraceList>',
      ].join('\n'),
    };
  }
  const pickable = v.selected != null;
  const lines = v.items.flatMap((item) =>
    item.type === 'loop'
      ? [
          `  <TraceLoop label="${item.label}" summary="${item.summary}">`,
          ...item.steps.map((s) => `    ${stepCall(s, pickable)}`),
          '  </TraceLoop>',
        ]
      : item.type === 'gate'
        ? [`  ${jsx('TraceGate', { label: { literal: item.label }, note: { literal: item.note }, tone: item.tone ? { literal: item.tone } : undefined }).replace(/\n\s*/g, ' ')}`]
        : [`  ${stepCall(item, pickable)}`],
  );
  return {
    comment: v.caption,
    data: { palette: LAYER_PALETTE },
    setup: pickable
      ? '// `TraceStep` calls `onSelect` with no argument, so each row closes over its own step:\n// onSelect({ seq: 8, name: "summarise" }).\nconst [selected, setSelected] = React.useState(7);\nconst onSelect = (step) => setSelected(step.seq);'
      : undefined,
    call: [
      `<PanelBox title="${v.caption}" aside="${v.aside}" flush>`,
      '<TraceList>',
      ...lines,
      '</TraceList>',
      ...(v.legend ? ['<Legend>', ...v.legend.map((l) => `  <LegendItem kind="${l.kind}" color="${l.color}" label="${l.label}" />`), '</Legend>'] : []),
      '</PanelBox>',
    ].join('\n'),
  };
}

interface Args {
  variant: string;
  onSelect: (step: { seq: number; name: string }) => void;
}

const meta = {
  title: 'UI/UI Extended/TraceList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Legend, LegendItem, MarkChip, PanelBox, TraceGate, TraceList, TraceLoop, TraceStep } from '@invana/ui';"],
            picked.map(source),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * `run:7d3184f1` read every way it can be, from `fixtures/ui-extended/trace-list.json`, and a
 * running answer's trace streamed live from `fixtures/runs/variance-run.json`.
 *
 * A **row is a step**, and the layer it spent is the rail down its left edge. A **loop contains
 * its rounds**; a **gate lies between rows**. A row keeps its place in every reading — in flight
 * the queued row is dim, not absent; failed, the spent step is struck and everything under it
 * says *skipped*; delegating, the child run sits under its step, indented. Pick a row in the first
 * cell: it stays where it is, and the pick is logged.
 */
export const TraceListStory: Story = {
  name: 'TraceList',
  render: ({ variant, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (v.live ? <Progress /> : <Trace v={v} log={log} onSelect={onSelect} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const order = within(canvas.getByRole('group', { name: VARIANTS[0].caption }));
    await step('Pick a step in the run', async () => {
      await userEvent.click(order.getByRole('button', { name: /summarise/ }));
      await expect(args.onSelect).toHaveBeenCalledWith({ seq: 8, name: 'summarise' });
      await expect(order.getByRole('list', { name: 'Events' })).toHaveTextContent('{ "seq": 8, "name": "summarise" }');
    });
    const live = within(canvas.getByRole('group', { name: 'Progress — streamed live' }));
    await step('The live run starts, then finishes with every step done', async () => {
      await waitFor(() => expect(live.getAllByRole('img', { name: 'running' }).length).toBeGreaterThan(0), {
        timeout: 3000,
      });
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getAllByRole('img', { name: 'done' })).toHaveLength(run.steps.length);
      await expect(live.queryByText(/timed out/)).toBeNull();
    });
  },
};
