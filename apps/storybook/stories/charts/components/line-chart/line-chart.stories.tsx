import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LineChart as Chart, type LineChartProps } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import data from '../../../../fixtures/charts/line-chart.json';
import feed from '../../../../fixtures/charts/query-latency.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { jsx, variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import {
  FORMATS,
  Framed,
  chartSnippet,
  chartSource,
  formatted,
  type ChartVariant,
  type FormatName,
} from '../../_chart';

type Props = Omit<LineChartProps, 'format'> & { format?: FormatName } & Record<string, unknown>;

// JSON widens the literal unions; the shape is the chart's own props, with `format` by name.
// The `Streaming` cell is fed from `fixtures/charts/query-latency.json` instead of its props.
const VARIANTS = data as unknown as (ChartVariant<Props> & { stream?: boolean })[];

const STREAM_CODE = {
  comment: 'Streaming',
  data: { reference: feed.reference, seed: feed.points.slice(0, feed.seed) },
  setup: [
    `// Append each point as it arrives and keep the last ${feed.window}: the chart redraws from props.`,
    'const [points, setPoints] = React.useState(seed);',
    `React.useEffect(() => source.subscribe((p) => setPoints((ps) => [...ps, p].slice(-${feed.window}))), []);`,
    '',
    '// Ring every point over the SLO.',
    'const over = points.flatMap((p, index) => (p.value > reference.value ? [{ index, color: "var(--color-destructive)" }] : []));',
    FORMATS.seconds.code,
  ].join('\n'),
  call: jsx('LineChart', {
    values: 'points.map((p) => p.value)',
    labels: 'points.map((p) => p.at)',
    reference: 'reference',
    highlights: 'over',
    max: '10',
    format: 'seconds',
  }),
};

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/LineChart',
  parameters: {
    layout: 'padded',
    docs: {
      source: chartSource(VARIANTS, ["import { LineChart } from '@invana/charts';"], (v) =>
        v.stream ? STREAM_CODE : chartSnippet('LineChart', v),
      ),
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const seconds = FORMATS.seconds.fn;

/** A state holder: the feed's points arriving, the last `window` kept, the SLO's breaches ringed. */
function Streaming({ variant }: { variant: ChartVariant<Props> }) {
  const replay = useReplay(feed.points.length - feed.seed, { every: 700 });
  const end = feed.seed + replay.at;
  const points = feed.points.slice(Math.max(0, end - feed.window), end);
  const latest = points.at(-1)?.value;
  const over = points.flatMap((p, index) =>
    p.value != null && p.value > feed.reference.value ? [{ index, color: 'var(--color-destructive)' }] : [],
  );
  return (
    <ReplayFrame replay={replay} noun="point" width={variant.width}>
      <PanelBox title={feed.title} aside={latest == null ? '—' : `${seconds(latest)} now`}>
        <Chart
          values={points.map((p) => p.value)}
          labels={points.map((p) => p.at)}
          reference={feed.reference}
          highlights={over}
          max={10}
          format={seconds}
        />
      </PanelBox>
    </ReplayFrame>
  );
}

/**
 * One series over time on one axis — from `fixtures/charts/line-chart.json`. Hover, or focus and
 * use the arrow keys, to read a period.
 *
 * - **Thirty days** — Plan page · Work p50 a day. One series, so no legend: the panel title names it.
 * - **Streaming** — a feed arriving: a point every 700ms, the last 24 kept, the SLO drawn as a
 *   reference and every point over it ringed. The chart is fed nothing but new props.
 * - **Gaps** — days where nothing ran break the line rather than dropping it to zero; a measured
 *   day between two gaps is drawn as a point.
 * - **Off zero** — `zero={false}` sets a clean floor one step under the lowest value, so a 50%
 *   rise is not flattened.
 * - **Single point** — one value draws one point, centred, on an axis from zero to a clean number.
 * - **With band** — the normal range shaded and named under its right end.
 * - **With forecast** — actuals solid to `today`, the forecast dashed inside its widening interval.
 * - **With highlights** — weeks above the range ringed; a ring carries no label.
 * - **With marks** — each publish a dashed rule labelled at the top: an event, not a value.
 * - **With reference** — a dashed rule to compare against, on the same axis — never a second axis.
 * - **Against last year** — `compare` draws other lines behind the main one, and every line is
 *   named at its right end instead of in a legend.
 */
export const LineChart: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) =>
        v.stream ? (
          <Streaming variant={v} />
        ) : (
          <Framed panel={v.panel}>
            <Chart {...formatted(v.props)} />
          </Framed>
        )
      }
    </VariantBoard>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Every variant draws', async () => {
      for (const v of VARIANTS) await expect(canvas.getByRole('group', { name: v.caption })).toBeInTheDocument();
    });
    const cell = within(canvas.getByRole('group', { name: 'Streaming' }));
    await step('Points arrive', async () => {
      await waitFor(() => expect(cell.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
    });
    await step('Skip to the end of the feed', async () => {
      const n = feed.points.length - feed.seed;
      await userEvent.click(cell.getByRole('button', { name: 'Skip to end' }));
      await expect(cell.getByRole('status')).toHaveTextContent(`${n} / ${n} points`);
      await expect(cell.getByRole('button', { name: 'Replay' })).toBeEnabled();
    });
  },
};
