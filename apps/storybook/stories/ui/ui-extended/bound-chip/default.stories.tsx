import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoundChip, type Bound } from '@invana/ui';

const meta: Meta<typeof BoundChip> = {
  title: 'UI/UI Extended/BoundChip',
  component: BoundChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BOUNDS: Bound[] = [
  'none',
  'network',
  'graph_read',
  'graph_write',
  'schema_write',
  'ingest',
  'llm',
  'plan_write',
  'work_write',
];

/**
 * Nine bounds, one hue each, fixed — colour follows the bound, never its
 * position in a list.
 *
 * The **name is always there**. Nine hues cannot be told apart reliably, some
 * pairs sit close, and a colour-blind reader gets nothing from any of them: the
 * swatch speeds up scanning a list you can already read, and carries nothing on
 * its own.
 *
 * Not a `Badge` — a badge carries state and takes a tone from the status
 * palette. A bound is a fixed property of a callable and must not read as "this
 * went well" because it happens to be green.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[280px] flex-col gap-2">
      {BOUNDS.map((bound) => (
        <div key={bound} className="flex items-center gap-3">
          <BoundChip bound={bound} className="w-[104px]" />
          <span className="text-sm text-muted-foreground">
            {bound === 'none' ? 'emit_table · read_artefact' : `what ${bound} spends`}
          </span>
        </div>
      ))}
    </div>
  ),
};
