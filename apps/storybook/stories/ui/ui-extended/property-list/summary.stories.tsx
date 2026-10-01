import type { Meta, StoryObj } from '@storybook/react-vite';
import { PropertyList, PropertyRow } from '@invana/ui';

const meta: Meta<typeof PropertyList> = {
  title: 'UI/UI Extended/PropertyList',
  component: PropertyList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `variant="summary"`: the rows set tight, for a settled answer read at a
 * glance — the values an ask was answered with, a proposal's terms.
 */
export const Summary: Story = {
  args: {
    labelWidth: 'auto',
    variant: 'summary',
    children: [
      <PropertyRow key="report" label="Report" mono>Mondays, 08:00</PropertyRow>,
      <PropertyRow key="to" label="To" mono>You, Procurement lead</PropertyRow>,
      <PropertyRow key="alert" label="Alert" mono>55%</PropertyRow>,
      <PropertyRow key="until" label="Until" mono>End of Q1 2027</PropertyRow>,
    ],
  },
};
