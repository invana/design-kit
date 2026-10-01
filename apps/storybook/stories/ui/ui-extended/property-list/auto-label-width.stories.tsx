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
 * `labelWidth="auto"`: the label column is as wide as the widest label, and
 * every value still starts on the same x. For a short list of known labels,
 * such as the answers to an ask.
 */
export const AutoLabelWidth: Story = {
  args: {
    labelWidth: 'auto',
    children: [
      <PropertyRow key="report" label="Report" mono>Mondays, 08:00</PropertyRow>,
      <PropertyRow key="to" label="To" mono>You, Procurement lead</PropertyRow>,
      <PropertyRow key="alert" label="Alert" mono>55%</PropertyRow>,
      <PropertyRow key="until" label="Until" mono>End of Q1 2027</PropertyRow>,
    ],
  },
};
