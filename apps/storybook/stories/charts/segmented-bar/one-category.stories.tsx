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

const ROWS = [
  { model: 'AirRoutes', explorer: 21 },
  { model: 'NewsArticles', explorer: 7 },
  { model: 'Twitter', explorer: 3 },
];

const meta: Meta<typeof SegmentedBar> = {
  title: 'Charts/SegmentedBar',
  component: SegmentedBar,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Too few queries to call anything unused, and every one came from the Explorer. Each
 * row is one full segment — still in the Explorer's colour, still named by the shared
 * legend, so a single category reads as that caller rather than as a plain bar.
 */
export const OneCategory: Story = {
  render: () => (
    <PanelBox title="Usage · 7 days" aside={<SegmentedBarLegend series={CALLERS} />} flush>
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
              <TableCell>{r.explorer}</TableCell>
              <TableCell>
                <SegmentedBar series={CALLERS} values={{ explorer: r.explorer }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PanelBox>
  ),
};
