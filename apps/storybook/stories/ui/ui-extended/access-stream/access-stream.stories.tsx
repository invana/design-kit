import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Sparkline } from '@invana/charts';
import { AccessStream as Component, type AccessStore, type AccessTargetState } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/access-stream.json';
import { DECLARED, PALETTE, primedStore, useReplayedStore, useSnapshot, WINDOWS } from '../access-monitor/_access';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

interface StreamVariant extends Variant {
  windows?: number;
  live?: boolean;
}

const VARIANTS = VARIANTS_JSON as StreamVariant[];

interface Args {
  variant: string;
  /** Milliseconds between windows in the live cell. */
  every: number;
  onFocusChange: (key: string | null) => void;
}

const meta = {
  title: 'UI/UI Extended/AccessStream',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Sparkline } from '@invana/charts';", "import { AccessStream, createAccessStore } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { declared: DECLARED, palette: PALETTE },
              setup: [
                'const store = React.useMemo(() => createAccessStore({ declared }), []);',
                v.live
                  ? 'React.useEffect(() => feed.subscribe((window) => store.push(window)), [store]);'
                  : `// ${v.windows} windows already pushed: a frozen frame.`,
                'const { targets, events, steps } = React.useSyncExternalStore(store.subscribe, store.getSnapshot);',
                '',
                '// Receives the key of the row pointed at — "graph_data␟Filing" — or null.',
                'const [focus, onFocusChange] = React.useState(null);',
                '// The trend cell: @invana/ui cannot import charts, so the caller hands it in.',
                'const renderRate = (t) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />;',
              ].join('\n'),
              call: [
                '<AccessStream',
                '  targets={targets}',
                '  events={events}',
                '  steps={steps}',
                '  palette={palette}',
                '  focus={focus}',
                '  onFocusChange={onFocusChange}',
                '  renderRate={renderRate}',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', every: 250, onFocusChange: fn() },
  argTypes: {
    variant: variantArg(VARIANTS),
    every: { control: { type: 'range', min: 100, max: 1000, step: 50 } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const renderRate = (t: AccessTargetState) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />;

function Stream({ store, args, log }: { store: AccessStore; args: Args; log: Log }) {
  const { targets, events, steps } = useSnapshot(store);
  const [focus, setFocus] = React.useState<string | null>(null);
  return (
    <Component
      targets={targets}
      events={events}
      steps={steps}
      palette={PALETTE}
      focus={focus}
      onFocusChange={(key) => {
        args.onFocusChange(key);
        log('onFocusChange', key);
        setFocus(key);
      }}
      renderRate={renderRate}
    />
  );
}

function Frozen({ windows, args, log }: { windows: number; args: Args; log: Log }) {
  const store = React.useMemo(() => primedStore(windows), [windows]);
  return <Stream store={store} args={args} log={log} />;
}

function Live({ args, log }: { args: Args; log: Log }) {
  const replay = useReplay(WINDOWS.length, { every: args.every });
  const store = useReplayedStore(replay.at);
  return (
    <ReplayFrame replay={replay} noun="window" width={520}>
      <Stream store={store} args={args} log={log} />
    </ReplayFrame>
  );
}

/**
 * What is flowing at its current rate, then the steps and the events worth reading one by one —
 * egress, a refusal, first touches. No touch is ever a row of its own. The frozen cell is the
 * board's frame; the live cell plays the recorded windows in, so rows climb and cool in place
 * while events arrive newest first. Point at a row: `onFocusChange` names its target.
 */
export const AccessStream: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(v, log) => (v.live ? <Live args={args} log={log} /> : <Frozen windows={v.windows ?? 0} args={args} log={log} />)}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('The frozen frame lists the refusal', async () => {
      const cell = within(canvas.getByRole('group', { name: 'The same frame as the board' }));
      await expect(cell.getAllByText('sec.gov/edgar').length).toBeGreaterThan(0);
    });
    await step('Point at a row and the stream names its target', async () => {
      const cell = within(canvas.getByRole('group', { name: 'The same frame as the board' }));
      await userEvent.hover(cell.getAllByText('sec.gov/edgar')[0]!);
      await waitFor(() => expect(args.onFocusChange).toHaveBeenCalled());
    });
    await step('The live cell plays to the end', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Live' }));
      await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
      await expect(cell.getByRole('status')).toHaveTextContent(`${WINDOWS.length} / ${WINDOWS.length} windows`);
    });
  },
};
