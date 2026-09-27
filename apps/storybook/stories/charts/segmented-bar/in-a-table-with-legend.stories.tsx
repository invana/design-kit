import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedBar, SegmentedBarLegend } from '@invana/charts';
import {
  PanelBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';
import { CALLERS } from '../fixtures';

const split = (total: number, [agent, plan, explorer, api]: number[]) => ({
  model: '',
  total,
  values: {
    agent: Math.round((total * agent) / 100),
    plan: Math.round((total * plan) / 100),
    explorer: Math.round((total * explorer) / 100),
    api: Math.round((total * api) / 100),
  },
});

const ROWS = [
  { ...split(33670, [58, 25, 14, 3]), model: 'AirRoutes' },
  { ...split(13250, [70, 20, 8, 2]), model: 'NewsArticles' },
  { ...split(7730, [40, 10, 48, 2]), model: 'Twitter' },
  { ...split(0, [0, 0, 0, 0]), model: 'Deals' },
];

const meta: Meta<typeof SegmentedBar> = {
  title: 'Charts/SegmentedBar',
  component: SegmentedBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Model page · Usage, queries by caller per model. One legend in the panel header
 * names the colours for the whole column; every row uses the same callers in the same
 * order, so agent is always first and always the same colour. A model with no queries
 * draws an empty track.
 */
export const InATableWithLegend: Story = {
  render: () => (
    <PanelBox title="Usage" aside={<SegmentedBarLegend series={CALLERS} />} flush>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Queries</TableHead>
            <TableHead>By caller</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r.model}>
              <TableCell>{r.model}</TableCell>
              <TableCell>{r.total.toLocaleString()}</TableCell>
              <TableCell>
                <SegmentedBar series={CALLERS} values={r.values} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PanelBox>
  ),
};
