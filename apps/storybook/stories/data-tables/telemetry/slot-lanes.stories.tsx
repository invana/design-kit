import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PanelBox, Gantt } from '@invana/ui';

import { jsx, snippet } from '../../_story/source';
import { VariantBoard } from '../../_story/variant-board';
import { RUN_SPAN_MS, SLOTS, formatMs, slotLaneTasks } from './fixtures';

const TASKS = slotLaneTasks();

const VARIANTS = [{ caption: 'Slot Lanes', wide: true }];

const meta = {
  title: 'Data Tables/Telemetry/Slot Lanes',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { PanelBox, Gantt } from '@invana/ui';"],
          comment: 'One row per worker slot: each task it ran is a labelled bar in `bars`, in its own status colour',
          data: { lanes: TASKS },
          call: [
            `<PanelBox title="Worker slots" aside="${SLOTS.length} slots · ${formatMs(RUN_SPAN_MS)}">`,
            `  ${jsx('Gantt', {
              rows: 'lanes',
              spanMs: String(RUN_SPAN_MS),
              ticks: '9',
            }).replace(/\n/g, '\n  ')}`,
            '</PanelBox>',
          ].join('\n'),
        }),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * The same run from the workers' side: what each of the three slots held, and when it sat idle.
 * Three fetches start together and the other two queue for a slot; the filings retry lands on
 * `w3` because `w2` was taken by then; after the fetches the run narrows to one or two lanes.
 * Each task is a bar of its own on its slot's row (`bars`), labelled with the task; hover a
 * bar for its task, a row for the lane's whole schedule — the card lists the row's bars. The
 * right-hand cell is how busy the slot was. `Gantt` here takes no callback, so nothing is logged.
 */
export const SlotLanes: Story = {
  render: () => (
    <VariantBoard variants={VARIANTS}>
      {() => (
        <PanelBox title="Worker slots" aside={`${SLOTS.length} slots · ${formatMs(RUN_SPAN_MS)}`}>
          <Gantt
            rows={TASKS}
            spanMs={RUN_SPAN_MS}
            ticks={9}
          />
        </PanelBox>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Slot Lanes' }));
    for (const slot of SLOTS) await expect(cell.getByText(slot)).toBeInTheDocument();
  },
};
