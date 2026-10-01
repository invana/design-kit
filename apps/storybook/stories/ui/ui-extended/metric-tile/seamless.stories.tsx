import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardContent, MetricGrid, MetricTile } from '@invana/ui';

const meta: Meta<typeof MetricGrid> = {
  title: 'UI/UI Extended/MetricTile',
  component: MetricGrid,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `joined seamless` inside a card: no box around the strip, only the rules
 * between tiles, and the outer tiles flush with the card's content edge.
 */
export const Seamless: Story = {
  render: () => (
    <Card>
      <CardContent>
        <MetricGrid joined seamless columns={3}>
          <MetricTile variant="figure" label="Revenue" value="£4.1M" caption="▲ 4%" captionTone="success" />
          <MetricTile variant="figure" label="Orders" value="61.2k" caption="▲ 7%" captionTone="success" />
          <MetricTile variant="figure" label="AOV" value="£67" caption="▼ 3%" captionTone="error" />
        </MetricGrid>
      </CardContent>
    </Card>
  ),
};
