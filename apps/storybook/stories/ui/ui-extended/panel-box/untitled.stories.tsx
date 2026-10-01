import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricGrid, MetricTile, PanelBox } from '@invana/ui';

const meta: Meta<typeof PanelBox> = {
  title: 'UI/UI Extended/PanelBox',
  component: PanelBox,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * No `title`, no label bar: the box frames its content alone. A seamless strip of figures sits
 * in it as it sits in an answer card, its outer tiles flush with the box's padding. Five tiles
 * at this width leave a short last row; its empty slot keeps the card's colour.
 */
export const Untitled: Story = {
  render: () => (
    <PanelBox className="max-w-[560px]">
      <MetricGrid joined seamless minTileWidth={150}>
        <MetricTile variant="figure" label="Tasks" value="4 / 7" caption="running" meter={4 / 7} />
        <MetricTile variant="figure" label="Elapsed" value="12s" caption="no timeout yet" />
        <MetricTile variant="figure" label="Tokens" value="8.2k" caption="of 40k ceiling" meter={0.21} />
        <MetricTile variant="figure" label="Rows" value="1,880" caption="so far" />
        <MetricTile variant="figure" label="Failed" value="1" caption="execute" captionTone="error" flagged />
      </MetricGrid>
    </PanelBox>
  ),
};
