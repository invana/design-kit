import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, RecordHeader, RecordPager, SegmentedControl } from '@invana/ui';

const meta: Meta<typeof RecordPager> = {
  title: 'UI/UI Extended/RecordPager',
  component: RecordPager,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = ['resolve_schema', 'build_query', 'validate_query', 'execute_query', 'summarise'];

/**
 * Walking a run one step at a time, from the step's own pagehead.
 *
 * The pager sits beside the reading switch because both are moves on the record
 * the reader already has open: one changes *which step*, the other changes *how
 * this step is read*.
 *
 * At the first step the back control is **disabled, not hidden** — a pager that
 * drops a button at the edges moves the other one under the cursor.
 */
export const Default: Story = {
  render: () => {
    const [index, setIndex] = React.useState(3);
    return (
      <div className="w-[860px] border border-border bg-card">
        <RecordHeader
          tone="success"
          crumbs={['runs', 'run:7d3184f1', `step:9b1c40e2 ${STEPS[index]}`]}
          chips={
            <>
              <Badge variant="outline" size="xs" tone="muted">
                graph_read
              </Badge>
              <Badge variant="outline" size="xs" tone="muted">
                succeeded
              </Badge>
            </>
          }
          actions={
            <>
              <SegmentedControl
                aria-label="How to read this step"
                options={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'touched', label: 'Touched' },
                  { value: 'log', label: 'Log' },
                ]}
              />
              <RecordPager
                position={`step ${index + 1} of ${STEPS.length}`}
                previousLabel="Previous step"
                nextLabel="Next step"
                onPrevious={index > 0 ? () => setIndex(index - 1) : undefined}
                onNext={
                  index < STEPS.length - 1 ? () => setIndex(index + 1) : undefined
                }
              />
            </>
          }
        />
      </div>
    );
  },
};
