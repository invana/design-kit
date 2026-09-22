import type { Meta, StoryObj } from '@storybook/react-vite';
import { TaskNode, type BoundPalette } from '@invana/ui';

const meta: Meta<typeof TaskNode> = {
  title: 'UI/UI Extended/TaskNode',
  component: TaskNode,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BOUNDS: BoundPalette = {
  llm: 'bg-data-7',
  graph_read: 'bg-data-1',
  network: 'bg-data-8',
  none: 'bg-muted-foreground',
};

/**
 * The same node under a draft and under a run.
 *
 * On the **left**, the draft canvas: picked, with four corner handles, because
 * a handle is an offer to move something and on a draft that offer is real.
 *
 * On the **right**, a run: the ring says *this is the one you picked* and the
 * handles are gone. A run paints status onto the plan it ran and nothing on it
 * is editable — a handle there would be a control that does nothing, which is
 * worse on a record than no affordance at all. The branch this run never took
 * is dimmed rather than dropped, because *declared and not taken* is the shape
 * of the run.
 */
export const ReadOnly: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="flex flex-col gap-3">
        <TaskNode
          taskKey="execute_query"
          bound="graph_read"
          boundPalette={BOUNDS}
          meta="1,284 rows · 2.1s"
          selected
        />
      </div>
      <div className="flex flex-col gap-3">
        <TaskNode
          taskKey="execute_query"
          bound="graph_read"
          boundPalette={BOUNDS}
          status="success"
          tags={[{ label: '↺ 2', tone: 'warning' }]}
          meta="1,284 rows · 2.1s"
          selected
          readOnly
        />
        <TaskNode
          taskKey="call_enrichment"
          bound="network"
          boundPalette={BOUNDS}
          meta="never taken"
          dim
          readOnly
        />
      </div>
    </div>
  ),
};
