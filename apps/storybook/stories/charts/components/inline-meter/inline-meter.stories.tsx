import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineMeter as Chart, type InlineMeterProps } from '@invana/charts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';

import data from '../../../../fixtures/charts/inline-meter.json';
import { variantArg } from '../../../_story/source';
import { VariantBoard } from '../../../_story/variant-board';
import { Framed, LiveProps, chartSnippet, chartSource, checkBoard, framedCall, type ChartVariant } from '../../_chart';

/** A meter alone, or — with `rows` — one per row of a table, each row giving its `value`. */
type Props = Omit<InlineMeterProps, 'value'> & {
  value?: number | null;
  rows?: { name: string; value: number | null }[];
} & Record<string, unknown>;

const VARIANTS = data as unknown as ChartVariant<Props>[];

/** The table a meter sits in, as the page writes it. */
function tableCall(v: ChartVariant<Props>) {
  const { rows: _rows, ...meter } = v.props;
  const attrs = Object.entries(meter)
    .map(([k, x]) => (typeof x === 'string' ? `${k}="${x}"` : `${k}={${x}}`))
    .join(' ');
  const [name, share] = v.columns ?? [];
  return framedCall(
    v.panel,
    [
      '<Table>',
      `  <TableHeader><TableRow><TableHead>${name}</TableHead><TableHead>${share}</TableHead></TableRow></TableHeader>`,
      '  <TableBody>',
      '    {rows.map((r) => (',
      '      <TableRow key={r.name}>',
      '        <TableCell>{r.name}</TableCell>',
      `        <TableCell><InlineMeter value={r.value} ${attrs} /></TableCell>`,
      '      </TableRow>',
      '    ))}',
      '  </TableBody>',
      '</Table>',
    ].join('\n'),
  );
}

interface Args {
  variant: string;
}

const meta = {
  title: 'Charts/Components/InlineMeter',
  parameters: {
    layout: 'padded',
    docs: {
      source: chartSource(
        VARIANTS,
        ["import { InlineMeter } from '@invana/charts';", "import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';"],
        (v) => (v.props.rows ? { comment: v.caption, data: { rows: v.props.rows }, call: tableCall(v) } : chartSnippet('InlineMeter', v)),
      ),
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * A share drawn inside a row — from `fixtures/charts/inline-meter.json`.
 *
 * - **In a table** — Plan page · each step's share of the plan's work. The shares are small, so
 *   `max` is the largest share: the longest bar fills its track while every number stays the true
 *   share. A step that did no work reads `—`.
 * - **Zero** — a model nobody has queried. Zero reads `—` with no track: an empty bar would look
 *   like a measured share of nothing.
 * - **Live** — a share filling as it is spent.
 */
export const InlineMeter: Story = {
  render: ({ variant }) => (
    <VariantBoard variants={VARIANTS} variant={variant}>
      {(v) => (
        <LiveProps variant={v} noun="update">
          {({ rows, ...meter }) =>
            rows ? (
              <Framed panel={v.panel} flush>
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
                      <TableRow key={r.name}>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>
                          <Chart {...meter} value={r.value} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Framed>
            ) : (
              <Chart {...meter} value={meter.value} />
            )
          }
        </LiveProps>
      )}
    </VariantBoard>
  ),
  play: async ({ canvasElement }) => checkBoard(canvasElement, VARIANTS, 'update'),
};
