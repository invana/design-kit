import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { TaskNode, type BoundPalette, type TaskNodeProps } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/task-node.json';
import { inline, jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';

const VARIANTS = DATA as { caption: string; props: Omit<TaskNodeProps, 'boundPalette'> }[];

/** The hues are the caller's — the kit ships none. */
const BOUNDS: BoundPalette = {
  llm: 'bg-data-7',
  graph_read: 'bg-data-1',
  network: 'bg-data-8',
  none: 'bg-muted-foreground',
};

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI Extended/TaskNode',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { TaskNode } from '@invana/ui';"],
            [
              { data: { boundPalette: BOUNDS }, call: '// The palette is yours; every node below takes it.' },
              ...picked.map((v) => ({
                comment: v.caption,
                call: jsx('TaskNode', {
                  ...Object.fromEntries(
                    Object.entries(v.props).map(([k, val]) => [k, typeof val === 'string' ? { literal: val } : inline(val)]),
                  ),
                  boundPalette: 'boundPalette',
                }),
              })),
            ],
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The same node under a draft and under a run, from `fixtures/ui-extended/task-node.json`.
 * On a draft, picked means four corner handles, because a handle is an offer to move something.
 * On a run, the ring says *this is the one you picked* and the handles are gone — nothing on a
 * record is editable. The branch the run never took is dimmed rather than dropped: *declared and
 * not taken* is the shape of the run.
 */
export const TaskNodeStory: Story = {
  name: 'TaskNode',
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => <TaskNode {...v.props} boundPalette={BOUNDS} />}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const v of VARIANTS) {
      await expect(within(canvas.getByRole('group', { name: v.caption })).getByText(v.props.taskKey as string)).toBeInTheDocument();
    }
  },
};
