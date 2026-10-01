import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { LineChart } from '@invana/charts';
import { PanelBox } from '@invana/ui';

import feed from '../../../fixtures/charts/query-latency.json';
import { ReplayFrame, useReplay } from '../../_story/replay';
import { jsx, snippet } from '../../_story/source';

interface Args {
  /** Milliseconds between points. */
  every: number;
}

const meta = {
  title: 'Charts/LineChart',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        code: snippet({
          imports: ["import { LineChart } from '@invana/charts';"],
          data: { reference: feed.reference, seed: feed.points.slice(0, feed.seed) },
          setup: [
            `// Append each point as it arrives and keep the last ${feed.window}: the chart redraws from props.`,
            'const [points, setPoints] = React.useState(seed);',
            `React.useEffect(() => source.subscribe((p) => setPoints((ps) => [...ps, p].slice(-${feed.window}))), []);`,
            '',
            '// Ring every point over the SLO.',
            'const over = points.flatMap((p, index) => (p.value > reference.value ? [{ index, color: "var(--color-destructive)" }] : []));',
            'const seconds = (v) => `${v.toFixed(1)}s`;',
          ].join('\n'),
          call: jsx('LineChart', {
            values: 'points.map((p) => p.value)',
            labels: 'points.map((p) => p.at)',
            reference: 'reference',
            highlights: 'over',
            max: '10',
            format: 'seconds',
          }),
        }),
      },
    },
  },
  args: { every: 700 },
  argTypes: { every: { control: { type: 'range', min: 100, max: 2000, step: 100 } } },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

const seconds = (v: number) => `${v.toFixed(1)}s`;

function Live({ every }: Args) {
  const replay = useReplay(feed.points.length - feed.seed, { every });
  const end = feed.seed + replay.at;
  const points = feed.points.slice(Math.max(0, end - feed.window), end);
  const latest = points.at(-1)?.value;
  const over = points.flatMap((p, index) =>
    p.value != null && p.value > feed.reference.value ? [{ index, color: 'var(--color-destructive)' }] : [],
  );

  return (
    <ReplayFrame replay={replay} noun="point">
      <PanelBox title={feed.title} aside={latest == null ? '—' : `${seconds(latest)} now`}>
        <LineChart
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
 * A feed arriving: a point every `every` ms from `fixtures/charts/query-latency.json`, the last
 * 24 kept, the SLO drawn as a reference and every point over it ringed. The chart is fed
 * nothing but new props — the way a socket or a poll would feed it. A gap in the feed breaks
 * the line rather than dropping it to zero.
 */
export const Streaming: Story = {
  render: (args) => <Live {...args} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Points arrive', async () => {
      await waitFor(() => expect(canvas.getByRole('status')).not.toHaveTextContent(/^0 \//), { timeout: 3000 });
    });
    await step('Skip to the end of the feed', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Skip to end' }));
      await expect(canvas.getByRole('status')).toHaveTextContent(`${feed.points.length - feed.seed} / ${feed.points.length - feed.seed} points`);
      await expect(canvas.getByRole('button', { name: 'Replay' })).toBeEnabled();
    });
  },
};
