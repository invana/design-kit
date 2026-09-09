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
 * One label column for the whole list, so values line up down the panel — the
 * reason this exists rather than a row of flexes.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[320px] border border-border bg-card p-2">
      <PropertyList>
        <PropertyRow label="kind">thesis</PropertyRow>
        <PropertyRow label="direction">long</PropertyRow>
        <PropertyRow label="horizon">intraday</PropertyRow>
        <PropertyRow label="confidence">0.72</PropertyRow>
        <PropertyRow label="agent">Intraday Analyst</PropertyRow>
        <PropertyRow label="thinking" mono>7e21</PropertyRow>
      </PropertyList>
    </div>
  ),
};
