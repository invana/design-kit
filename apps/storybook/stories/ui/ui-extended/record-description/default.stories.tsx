import type { Meta, StoryObj } from '@storybook/react-vite';
import { RecordDescription, RecordHeader } from '@invana/ui';

const meta: Meta<typeof RecordDescription> = {
  title: 'UI/UI Extended/RecordDescription',
  component: RecordDescription,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** One line under the header; `More` shows the whole description and the record's facts. */
export const Default: Story = {
  render: () => (
    <div>
      <RecordHeader crumbs={['Models', 'AirRoutes']} />
      <RecordDescription
        description="Airports, countries and continents, and the routes flown between them — the network every other model in this Graph is stitched onto."
        details={[
          { label: 'Validation', value: 'strict', mono: true },
          { label: 'Origin', value: 'starter' },
          { label: 'Status', value: 'active' },
          { label: 'Updated', value: '27 Sep 2026, 11:40' },
        ]}
      />
    </div>
  ),
};
