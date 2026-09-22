import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarkChip, PropertyList, PropertyRow } from '@invana/ui';

const meta: Meta<typeof MarkChip> = {
  title: 'UI/UI Extended/MarkChip',
  component: MarkChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What happened to a row that its own columns cannot say — and these are the
 * rows a reader opened the trace for.
 *
 * The tone is the severity of the exception, not of the step: a step that took
 * two attempts and succeeded is a warning mark on a successful row, because the
 * retry is the thing worth finding.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[520px]">
      <PropertyList labelWidth={104}>
        <PropertyRow label={<MarkChip>↺ 2 of 3</MarkChip>}>
          it ran twice — the first attempt timed out
        </PropertyRow>
        <PropertyRow label={<MarkChip>⏸ 1 of 3</MarkChip>}>
          a person was asked, and the round is bounded
        </PropertyRow>
        <PropertyRow label={<MarkChip tone="info">live</MarkChip>}>
          painting right now, in its place in the order
        </PropertyRow>
        <PropertyRow label={<MarkChip tone="info">↳ delegates</MarkChip>}>
          it opened a run of its own, nested under it
        </PropertyRow>
        <PropertyRow label={<MarkChip tone="warning">no answer</MarkChip>}>
          it succeeded, and the graph cannot answer inside this world
        </PropertyRow>
        <PropertyRow label={<MarkChip tone="destructive">↺ 3 of 3</MarkChip>}>
          the bound is spent — a fourth attempt is a change to the plan
        </PropertyRow>
        <PropertyRow label={<MarkChip tone="muted">stopped</MarkChip>}>
          cancelled mid-attempt, by a person
        </PropertyRow>
      </PropertyList>
    </div>
  ),
};
