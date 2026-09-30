import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from '@invana/charts';
import { AccessStream } from '@invana/ui';
import { PALETTE, primedStore } from '../access-monitor/_feed';

const meta: Meta<typeof AccessStream> = {
  title: 'UI/UI Extended/AccessStream',
  component: AccessStream,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const snap = primedStore(60).getSnapshot();

/**
 * The same frame as the board: what is flowing at its current rate, then the
 * steps and the events worth reading one by one — egress, a refusal, first
 * touches. No touch is ever a row of its own.
 */
export const Default: Story = {
  args: {
    targets: snap.targets,
    events: snap.events,
    steps: snap.steps,
    palette: PALETTE,
    renderRate: (t) => <Sparkline values={t.history} width={56} height={16} endMarker={false} />,
  },
  render: (args) => (
    <div className="w-[520px]">
      <AccessStream {...args} />
    </div>
  ),
};
