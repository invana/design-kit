import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Sparkline } from '@invana/charts';
import { AccessMonitor as Component, type AccessTargetState } from '@invana/ui';

import { DECLARED, FEED, PALETTE, useReplayedStore, WINDOWS } from './_access';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../../_story/variant-board';

const VARIANTS = FEED.variants as Variant[];

interface Args {
  variant: string;
  /** Touches per second the recorded windows are re-summed at. */
  rate: number;
  /** How often a summed window arrives, in ms. */
  windowMs: number;
  onPausedChange: (paused: boolean) => void;
}

const meta = {
  title: 'UI/UI Extended/AccessMonitor',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Sparkline } from '@invana/charts';", "import { AccessMonitor, createAccessStore } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { declared: DECLARED, palette: PALETTE },
              setup: [
                '// The server sums touches into windows; the monitor reads the store itself.',
                'const store = React.useMemo(() => createAccessStore({ declared }), []);',
                'React.useEffect(() => feed.subscribe((window) => store.push(window)), [store]);',
                '',
                '// Receives true on Pause, false on Resume. Omit it and the monitor keeps its own.',
                'const onPausedChange = (paused) => {};',
                'const renderRate = (t) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />;',
              ].join('\n'),
              call: [
                '<AccessMonitor',
                '  store={store}',
                '  palette={palette}',
                '  renderRate={renderRate}',
                '  onPausedChange={onPausedChange}',
                '/>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', rate: FEED.rate, windowMs: FEED.windowMs, onPausedChange: fn() },
  argTypes: {
    variant: variantArg(VARIANTS),
    rate: { control: { type: 'range', min: 10, max: 10_000, step: 10 } },
    windowMs: { control: { type: 'select' }, options: [100, 250, 500, 1_000] },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const renderRate = (t: AccessTargetState) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />;

function Live({ args, log }: { args: Args; log: Log }) {
  const replay = useReplay(WINDOWS.length, { every: args.windowMs });
  const store = useReplayedStore(replay.at, args.rate);
  return (
    <ReplayFrame replay={replay} noun="window" width={1080}>
      <Component
        store={store}
        palette={PALETTE}
        renderRate={renderRate}
        onPausedChange={(paused) => {
          args.onPausedChange(paused);
          log('onPausedChange', paused);
        }}
      />
    </ReplayFrame>
  );
}

/**
 * A run at up to 10k touches a second, summed by the server into windows — one recorded cycle
 * from `fixtures/ui-extended/access-monitor.json`, replayed at `rate`.
 *
 * Tiles glow by rate and cool when a step moves on; a ring marks a target waking from cold. The
 * stream never lists touches — it shows what is flowing and, one by one, what leaves, what is
 * refused and what is touched for the first time. Point at a tile or a row to find its twin;
 * click a tile to narrow the stream; pause to freeze the frame (`onPausedChange`). Let the replay
 * end and the header says the feed went stale rather than calm. `sec.gov/edgar` is not declared,
 * and appears the moment it is refused.
 */
export const AccessMonitor: Story = {
  render: (args) => (
    <VariantBoard variants={VARIANTS} variant={args.variant}>
      {(_v, log) => <Live args={args} log={log} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Live' }));
    await step('Windows arrive', async () => {
      await waitFor(() => expect(cell.getAllByRole('status')[0]).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
    });
    await step('Pause freezes the frame', async () => {
      // The replay bar has a Pause of its own; the monitor's is the last.
      await userEvent.click(cell.getAllByRole('button', { name: 'Pause' }).at(-1)!);
      await expect(args.onPausedChange).toHaveBeenCalledWith(true);
      await expect(cell.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onPausedChange');
    });
  },
};
