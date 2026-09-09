import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChartH, BarChartV } from '@invana/ui';

const meta: Meta<typeof BarChartH> = {
  title: 'UI/UI Extended/Charts',
  component: BarChartH,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Magnitude, horizontal because the labels are words; and one measure over a
 * few periods, vertical because the axis is time.
 *
 * Both are single-series, so neither carries a legend — the caption names what
 * is plotted. Every bar is directly labelled, which is also what discharges the
 * data palette's light-mode contrast obligation.
 */
export const Bars: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <div className="w-[300px]">
        <BarChartH
          caption="5-session velocity · Defence"
          data={[
            { label: 'BEL', value: 2.4, display: '2.4×' },
            { label: 'HAL', value: 2.1, display: '2.1×' },
            { label: 'BDL', value: 1.6, display: '1.6×' },
            { label: 'MIDHANI', value: 0.9, display: '0.9×' },
          ]}
        />
      </div>
      <div className="w-[300px]">
        <BarChartV
          caption="accepted ÷ reviewed · Intraday Analyst"
          gridlines={[50, 75, 100]}
          max={100}
          data={[
            { label: 'wk 33', sublabel: '11–15 Aug', value: 79, display: '79%' },
            { label: 'wk 34', sublabel: '18–22 Aug', value: 84, display: '84%' },
            { label: 'wk 35', sublabel: '25–29 Aug', value: 86, display: '86%' },
            { label: 'wk 36', sublabel: '1–5 Sep', value: 91, display: '91%' },
          ]}
        />
      </div>
    </div>
  ),
};
