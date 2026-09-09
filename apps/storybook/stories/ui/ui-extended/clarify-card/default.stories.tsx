import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClarifyCard, Button } from '@invana/ui';
import { useState } from 'react';

const meta: Meta<typeof ClarifyCard> = {
  title: 'UI/UI Extended/ClarifyCard',
  component: ClarifyCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Parked, not failed. Answering resumes *this* thinking. */
export const Default: Story = {
  render: () => {
    const [v, setV] = useState('velocity');
    return (
      <div className="w-[330px]">
        <ClarifyCard
          step="understand"
          waiting="parked 14 min"
          question="Cooling by which measure? The graph holds both."
          value={v}
          onSelect={setV}
          options={[
            { value: 'velocity', label: 'Theme velocity, 5 sessions', detail: 'Theme.velocity_5d' },
            { value: 'price', label: 'Price against the 20-day average', detail: 'Bar.close' },
            { value: 'both', label: 'Both, ranked separately', detail: 'two emissions' },
          ]}
          actions={<Button size="xs">Answer</Button>}
          footnote="Options are the measures the model declares. Nothing here was generated."
        />
      </div>
    );
  },
};
