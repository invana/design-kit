import type { Meta, StoryObj } from '@storybook/react-vite';
import { AbsenceNote, PanelBox } from '@invana/ui';

const meta: Meta<typeof AbsenceNote> = {
  title: 'UI/UI Extended/AbsenceNote',
  component: AbsenceNote,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Three kinds of nothing, and a page that draws one empty table for all of them
 * is lying about two.
 *
 * *Nothing recorded* is a step still in flight — the interpreter writes
 * `result.json` when the row settles, so the panel is **absent**, not empty.
 * *Purged* is a document that existed and aged out; the counts and the outcome
 * stay. *None declared* is a step whose contract has no such output at all — a
 * read under `read_only: true` writes nothing, and that is the record working.
 */
export const Default: Story = {
  render: () => (
    <div className="grid w-[840px] grid-cols-3 gap-3">
      <PanelBox title="result.json" flush>
        <AbsenceNote reason="unrecorded">
          The interpreter writes this document when the row settles. The step is
          still in flight, so nobody has recorded one yet.
        </AbsenceNote>
      </PanelBox>
      <PanelBox title="Log for this step" flush>
        <AbsenceNote reason="purged">
          Kept 90 days. The step&rsquo;s counts and outcome stay on the record;
          its input, its output and its log were removed when the run aged out.
        </AbsenceNote>
      </PanelBox>
      <PanelBox title="What it wrote" flush>
        <AbsenceNote reason="declared-none" label="read_only: true">
          The step was dispatched read-only, and the world it ran under allows no
          write on the graph data layer. A read that changes a graph would be the
          bug; a read that says so is the record.
        </AbsenceNote>
      </PanelBox>
    </div>
  ),
};
