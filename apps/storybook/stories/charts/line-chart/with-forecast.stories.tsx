import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import { DEMAND, DEMAND_LOWER, DEMAND_TODAY, DEMAND_UPPER, DEMAND_WEEKS, units } from '../fixtures';

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Actuals run solid to today; the forecast runs dashed after it, inside its interval, which
 * widens with the horizon. The boundary is a rule named `today`.
 */
export const WithForecast: Story = {
  render: () => (
    <PanelBox title="Demand, units a week" aside="forecast to year end">
      <LineChart
        values={DEMAND}
        labels={DEMAND_WEEKS}
        format={units}
        zero={false}
        band={{ lower: DEMAND_LOWER, upper: DEMAND_UPPER }}
        forecastFrom={DEMAND_TODAY}
        forecastLabel="today"
      />
    </PanelBox>
  ),
};
