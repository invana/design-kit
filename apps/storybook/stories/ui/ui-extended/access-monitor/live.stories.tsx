import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from '@invana/charts';
import { AccessMonitor, createAccessStore } from '@invana/ui';
import { createFeed, DECLARED, PALETTE } from './_feed';

interface LiveArgs {
  /** Touches per second the pretend server is summing. */
  rate: number;
  /** How often a summed window arrives. */
  windowMs: number;
}

const meta: Meta<LiveArgs> = {
  title: 'UI/UI Extended/AccessMonitor',
  parameters: { layout: 'padded' },
  args: { rate: 8_000, windowMs: 250 },
  argTypes: {
    rate: { control: { type: 'range', min: 10, max: 10_000, step: 10 } },
    windowMs: { control: { type: 'select' }, options: [100, 250, 500, 1_000] },
  },
};

export default meta;
type Story = StoryObj<LiveArgs>;

function LiveMonitor({ rate, windowMs }: LiveArgs) {
  const store = React.useMemo(() => createAccessStore({ declared: DECLARED }), []);
  const rateRef = React.useRef(rate);
  React.useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  React.useEffect(() => {
    store.reset();
    const feed = createFeed({ windowMs, start: Date.now() });
    const id = window.setInterval(() => store.push(feed.next(rateRef.current)), windowMs);
    return () => window.clearInterval(id);
  }, [store, windowMs]);

  return (
    <AccessMonitor
      store={store}
      palette={PALETTE}
      renderRate={(t) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />}
    />
  );
}

/**
 * A run at up to 10k touches a second, summed by the server into windows.
 *
 * Tiles glow by rate and cool when a step moves on; a ring marks a target
 * waking from cold. The stream never lists touches — it shows what is flowing
 * and, one by one, what leaves, what is refused and what is touched for the
 * first time. Point at a tile or a row to find its twin; click a tile to narrow
 * the stream; pause to freeze the frame. `sec.gov/edgar` is not declared, and
 * appears the moment it is refused.
 */
export const Live: Story = {
  render: (args) => (
    <div className="h-[640px] w-[1080px]">
      <LiveMonitor {...args} />
    </div>
  ),
};
