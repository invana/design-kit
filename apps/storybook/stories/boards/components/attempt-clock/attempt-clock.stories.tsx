import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AttemptClock as Part, type AttemptRow } from '@invana/boards';
import { PanelBox } from '@invana/ui';

import data from '../../../../fixtures/board/attempt-clock.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ClockVariant extends Variant {
  panel: { title: string; aside?: string };
  props: { summary?: string; rows: AttemptRow[] };
  /** A live cell: the rows as they stand after each write. */
  frames?: AttemptRow[][];
}

// JSON widens `tone` to string; the shape is the part's own.
const VARIANTS = data as unknown as ClockVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'Boards/Components/AttemptClock',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { AttemptClock } from '@invana/boards';", "import { PanelBox } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              data: { rows: v.frames ? v.frames[0] : v.props.rows },
              setup: v.frames ? '// Live: pass the rows again as each attempt is written — the clock redraws from props.' : undefined,
              call: `<PanelBox title="${v.panel.title}" aside="${v.panel.aside}" flush>\n  ${jsx('AttemptClock', {
                summary: v.props.summary ? { literal: v.props.summary } : undefined,
                rows: 'rows',
              })}\n</PanelBox>`,
            })),
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

function Clock({ variant, rows }: { variant: ClockVariant; rows: AttemptRow[] }) {
  return (
    <PanelBox title={variant.panel.title} aside={variant.panel.aside} flush>
      <Part summary={variant.props.summary} rows={rows} />
    </PanelBox>
  );
}

/** A state holder: the rows as the engine writes them, one frame at a time. */
function Live({ variant }: { variant: ClockVariant }) {
  const frames = variant.frames!;
  const replay = useReplay(frames.length, { every: 900 });
  return (
    <ReplayFrame replay={replay} noun="write" width={720}>
      <Clock variant={variant} rows={replay.at ? frames[replay.at - 1] : variant.props.rows} />
    </ReplayFrame>
  );
}

/**
 * A step's clock, attempt by attempt — from `fixtures/board/attempt-clock.json`.
 *
 * `execute_query` took `2.1s`, and the reader waited `32.4s`. The gap **is** the first attempt,
 * and the clock says so rather than leaving a subtraction on the page. The attempt that timed out
 * keeps its place, struck: a step that was retried and a step that ran once are different
 * records. The live cell writes each attempt as the engine does. No callbacks — it is read.
 */
export const AttemptClock: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) => (v.frames ? <Live variant={v} /> : <Clock variant={v} rows={v.props.rows} />)}
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('The settled clock keeps the struck attempt', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Default' }));
      await expect(cell.getByText('timed out — the connector never answered')).toBeInTheDocument();
    });
    await step('The live clock plays to its last write', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Live · attempts arriving' }));
      await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
      await expect(cell.getByRole('status')).toHaveTextContent('5 / 5 writes');
      await expect(cell.getByText('settled')).toBeInTheDocument();
    });
  },
};
