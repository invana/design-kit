import type { Meta, StoryObj } from '@storybook/react-vite';
import { RatingControl, AgentChip } from '@invana/ui';
import { Textarea } from '@invana/forms';
import { User } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof RatingControl> = {
  title: 'UI/UI Extended/RatingControl',
  component: RatingControl,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The capture signal the learning loop runs on — so it states its consequence. */
export const Default: Story = {
  render: () => {
    const [verdict, setVerdict] = useState<'appreciate' | 'depreciate'>('appreciate');
    const [weight, setWeight] = useState(2);
    return (
      <div className="w-[420px]">
        <RatingControl
          verdict={verdict}
          onVerdictChange={setVerdict}
          weight={weight}
          onWeightChange={setWeight}
          refines="macro-to-sector"
          by={<AgentChip kind="person" icon={<User />} name="ravi" />}
        >
          <Textarea
            rows={2}
            defaultValue="clean read of the crude move into OMCs"
            className="text-meta"
          />
        </RatingControl>
      </div>
    );
  },
};
