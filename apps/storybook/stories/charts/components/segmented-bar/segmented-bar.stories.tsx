import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedBar as Chart, SegmentedBarLegend, type SegmentSeries } from '@invana/charts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';

import data from '../../../../fixtures/charts/segmented-bar.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSource, checkBoard, framedCall, type ChartVariant } from '../../_chart';

/** One bar per row of a table, every row on the same series in the same order. */
type Props = {
  series: SegmentSeries[];
  rows: { model: string; total: number; values: Record<string, number> }[];
} & Record<string, unknown>;

const VARIANTS = data as unknown as ChartVariant<Props>[];

/** The table the bars sit in, as the Model page writes it. */
function tableCall(v: ChartVariant<Props>) {
  const [model, queries, by] = v.columns ?? [];
  return framedCall(
    v.panel,
    [
      '<Table>',
      `  <TableHeader><TableRow><TableHead>${model}</TableHead><TableHead>${queries}</TableHead><TableHead>${by}</TableHead></TableRow></TableHeader>`,
      '  <TableBody>',
      '    {rows.map((r) => (',
      '      <TableRow key={r.model}>',
      '        <TableCell>{r.model}</TableCell>',
      '        <TableCell>{r.total.toLocaleString()}</TableCell>',
      '        <TableCell><SegmentedBar series={series} values={r.values} /></TableCell>',
      '      </TableRow>',
      '    ))}',
      '  </TableBody>',
      '</Table>',
    ].join('\n'),
    '<SegmentedBarLegend series={series} />',
  );
}

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/SegmentedBar',
  parameters: {
    layout: 'padded',
    docs: {
      source: chartSource(
        VARIANTS,
        [
          "import { SegmentedBar, SegmentedBarLegend } from '@invana/charts';",
          "import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';",
        ],
        (v) => ({
          comment: v.caption,
          data: { series: v.props.series, rows: v.props.rows },
          setup: v.live ? '// Live: pass the new rows as each count lands — every bar redraws from props.' : undefined,
          call: tableCall(v),
        }),
      ),
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A total split by category, inside a row — from `fixtures/charts/segmented-bar.json`. One legend
 * in the panel header names the colours for the whole column; every row uses the same series in
 * the same order, so `agent` is always first and always the same colour.
 *
 * - **In a table with legend** — Model page · Usage, queries by caller per model. A model with no
 *   queries draws an empty track.
 * - **One category** — every query came from the Explorer: each row is one full segment, still in
 *   the Explorer's colour and named by the shared legend, so it reads as that caller.
 * - **Live** — today's queries arriving.
 */
export const SegmentedBar: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="update">
          {({ series, rows }) => (
            <Framed panel={v.panel} aside={<SegmentedBarLegend series={series} />} flush>
              <Table>
                <TableHeader>
                  <TableRow>
                    {(v.columns ?? []).map((c) => (
                      <TableHead key={c}>{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.model}>
                      <TableCell>{r.model}</TableCell>
                      <TableCell>{r.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chart series={series} values={r.values} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Framed>
          )}
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'update'),
};
