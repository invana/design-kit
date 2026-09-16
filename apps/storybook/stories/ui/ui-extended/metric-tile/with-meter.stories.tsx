import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricGrid, MetricTile } from '@invana/ui';

const meta: Meta<typeof MetricTile> = {
  title: 'UI/UI Extended/MetricTile',
  component: MetricTile,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A run's tile strip: some numbers have a state, some have a ceiling, most have
 * neither.
 *
 * `meter` is only for a value with a **real ceiling** — a budget, a token limit,
 * a lane pool, a task count. `Elapsed` and `Rows` have none, so they get no bar:
 * a sliver under `12s` would invent a deadline that does not exist.
 *
 * `tone` is for a number whose *state* is the thing being read. Two of six here,
 * deliberately — a grid where every tile is coloured carries no signal.
 */
export const WithMeter: Story = {
  render: () => (
    <div className="w-full max-w-[860px]">
      <MetricGrid minTileWidth={130}>
        <MetricTile label="Tasks" value="4 / 7" caption="running" tone="running" meter={4 / 7} />
        <MetricTile label="Elapsed" value="12s" caption="no timeout yet" />
        <MetricTile label="Tokens" value="8.2k" caption="of 40k ceiling" meter={0.21} />
        <MetricTile label="Cost" value="$0.04" caption="of $2.00 budget" meter={0.02} />
        <MetricTile label="Rows" value="1,880" caption="so far" />
        <MetricTile label="Lanes" value="2 / 5" caption="execute_graph_query" meter={0.4} />
      </MetricGrid>
    </div>
  ),
};
