import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccessBoard } from '@invana/ui';
import { PALETTE, primedStore } from '../access-monitor/_feed';

const meta: Meta<typeof AccessBoard> = {
  title: 'UI/UI Extended/AccessBoard',
  component: AccessBoard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One frame, mid-way through *Enrich companies*.
 *
 * `Company.revenue` wears a ring on its light — it is being written.
 * `api.crunchbase.com` has a warning edge — data is leaving. `sec.gov/edgar`
 * is struck on a destructive edge: refused, and never declared, so the board
 * grew a tile for it rather than dropping it. `Person` is hollow — declared,
 * never touched. The *Read filings* targets are still faintly lit, cooling.
 */
export const Default: Story = {
  args: {
    targets: primedStore(60).getSnapshot().targets,
    palette: PALETTE,
  },
  render: (args) => (
    <div className="w-[520px]">
      <AccessBoard {...args} />
    </div>
  ),
};
