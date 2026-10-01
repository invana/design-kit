import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PanelBox, TraceList, TraceStep } from '@invana/ui';

import run from '../../../../fixtures/runs/variance-run.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { snippet } from '../../../_story/source';
import { EventLog } from '../../../_story/variant-board';

type Status = 'done' | 'running' | 'pending' | 'failed' | 'waiting' | 'retrying' | 'stopped';

interface StepEvent {
  step: string;
  status: Status;
  duration?: string;
  error?: string | null;
}

interface Step {
  id: string;
  name: string;
  status: Status;
  duration?: string;
  error?: string;
}

const EVENTS = run.events as StepEvent[];

/** The run after `events`: every step pending until an event names it, then as it last said. */
function stepsAfter(events: StepEvent[]): Step[] {
  return run.steps.map((s) =>
    events
      .filter((e) => e.step === s.id)
      .reduce<Step>(
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

interface Args {
  /** Milliseconds between events. */
  every: number;
}

const meta = {
  title: 'UI/UI Extended/TraceList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { TraceList, TraceStep } from '@invana/ui';"],
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
        }),
      },
    },
  },
  args: { every: 600 },
  argTypes: { every: { control: { type: 'range', min: 100, max: 2000, step: 100 } } },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function Live({ every }: Args) {
  const replay = useReplay(EVENTS.length, { every });
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

/**
 * Progress — the trace a running answer streams, played from `fixtures/runs/variance-run.json`.
 * Each event replaces what one step last said: a count that climbs while a step runs, a retry
 * with its reason under it, then done. The last three events are written under the list.
 */
export const Progress: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('The first step starts running', async () => {
      await waitFor(() => expect(canvas.getAllByRole('img', { name: 'running' }).length).toBeGreaterThan(0), {
        timeout: 3000,
      });
    });
    await step('The run finishes with every step done', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Skip to end' }));
      await expect(canvas.getAllByRole('img', { name: 'done' })).toHaveLength(run.steps.length);
      await expect(canvas.queryByText(/timed out/)).toBeNull();
    });
  },
};
