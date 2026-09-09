import type { Meta, StoryObj } from '@storybook/react-vite';
import { DivergingBar, HeatStrip, Sparkline } from '@invana/ui';

const meta: Meta<typeof DivergingBar> = {
  title: 'UI/UI Extended/Charts',
  component: DivergingBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES = [
  { key: 'served', label: 'served', color: 'var(--color-success)' },
  { key: 'skipped', label: 'skipped · overlap', color: 'var(--color-muted-foreground)' },
  { key: 'cannot', label: 'cannot answer', color: 'var(--color-warning)', hollow: true },
  { key: 'failed', label: 'failed', color: 'var(--color-destructive)' },
];

const DAY = Array.from({ length: 21 }, (_, i) => ({
  at: `${9 + Math.floor(i / 4)}:${['00', '15', '30', '45'][i % 4]}`,
  state: i === 5 ? 'skipped' : i === 13 ? 'cannot' : i === 18 ? 'failed' : 'served',
}));

/**
 * Polarity around a real zero, and the shape of a day.
 *
 * `DivergingBar` uses the status colours because its two directions are good and
 * bad, not two categories — the one place status colour belongs on a chart.
 * `HeatStrip` is status too, so its legend is mandatory: a square carries no
 * label, and without the legend the strip would be colour-alone.
 */
export const PolarityAndTime: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-[360px]">
        <DivergingBar
          caption="net learning weight · 90 d"
          data={[
            { label: 'gap-continuation', value: 11 },
            { label: 'macro-to-sector', value: 7 },
            { label: 'theme-early', value: 5 },
            { label: 'theme-late', value: -4 },
            { label: 'event-day-entry', value: -6 },
            { label: 'gap-no-delivery', value: -9 },
          ]}
        />
      </div>

      <div className="w-[420px]">
        <HeatStrip
          cells={DAY}
          states={STATES}
          ticks={[{ at: 0, label: '09' }, { at: 4, label: '10' }, { at: 8, label: '11' }, { at: 12, label: '12' }, { at: 16, label: '13' }, { at: 20, label: '14' }]}
        />
      </div>

      <div className="flex items-center gap-2">
        <Sparkline values={[79, 81, 84, 83, 86, 88, 91]} label="accepted rate, 7 weeks" />
        <span className="text-meta text-muted-foreground">91% accepted · 7 weeks</span>
      </div>
    </div>
  ),
};
