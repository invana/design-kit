import type { Meta, StoryObj } from '@storybook/react-vite';
import { LensChip } from '@invana/ui';

const meta: Meta<typeof LensChip> = {
  title: 'UI/UI Extended/LensChip',
  component: LensChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Which world a run is being read under — the header's right-hand chip, and the
 * one on an agent's row.
 *
 * **No lens reads `Everything`, never blank and never `None`.** A Graph that
 * sets no lens sees the whole global model, every configured provider and every
 * third party its agents are credentialed for: the widest state is the default,
 * and it is a *state*, not a missing value. `None` would suggest nothing is in
 * view, which is the exact opposite of what is true — and `Everything` is still
 * inside the guardrails, which is why a guardrail is not a lens you pick.
 *
 * It carries the name and nothing else. What the world narrows belongs in the
 * drawer the chip opens; a chip that listed its rules would be a rule list that
 * happened to be in a header.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-3">
      <div className="flex items-center gap-3">
        <LensChip onPick={() => {}} />
        <span className="text-meta text-muted-foreground">
          no lens set — the default, and a real state
        </span>
      </div>
      <div className="flex items-center gap-3">
        <LensChip lens={{ name: 'EU · H1 2026' }} onPick={() => {}} />
        <span className="text-meta text-muted-foreground">picked</span>
      </div>
      <div className="flex items-center gap-3">
        <LensChip lens={{ name: 'Price-blind' }} />
        <span className="text-meta text-muted-foreground">
          no picker — a statement, so it is not pressable
        </span>
      </div>
    </div>
  ),
};
