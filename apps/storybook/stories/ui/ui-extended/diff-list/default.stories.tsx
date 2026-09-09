import type { Meta, StoryObj } from '@storybook/react-vite';
import { DiffList, DiffRow } from '@invana/ui';

const meta: Meta<typeof DiffList> = {
  title: 'UI/UI Extended/DiffList',
  component: DiffList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** The sign is spelled out per row — colour alone must not decide an approval. */
export const Default: Story = {
  render: () => (
    <div className="w-[420px] border border-border bg-card p-2">
      <DiffList>
        <DiffRow op="add" kind="node">Pattern</DiffRow>
        <DiffRow op="add" kind="node">Learning</DiffRow>
        <DiffRow op="add" kind="edge">INSTANCE_OF · Observation → Pattern</DiffRow>
        <DiffRow op="change" kind="property">confidence · float → decimal</DiffRow>
        <DiffRow op="remove" kind="edge">MENTIONS · Article → Company</DiffRow>
      </DiffList>
    </div>
  ),
};
