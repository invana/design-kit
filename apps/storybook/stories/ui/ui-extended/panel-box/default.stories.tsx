import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  PanelBox,
  PropertyList,
  PropertyRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

const meta: Meta<typeof PanelBox> = {
  title: 'UI/UI Extended/PanelBox',
  component: PanelBox,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One band of a dashboard. The column scrolls; a band never does.
 *
 * `aside` is the fact on the right — a count, a provenance note, a badge. It is
 * not a toolbar: a band that wants icon buttons in its header is a panel, and a
 * panel is `PanelContent`.
 *
 * `flush` drops the body padding so a full-bleed child meets the border — which
 * is how a table's header rule lines up with the box instead of floating inside
 * it.
 */
export const Default: Story = {
  render: () => (
    <div className="flex max-w-[760px] flex-col gap-3">
      <PanelBox
        title="Input · what opened this run"
        aside={<span className="font-mono">args after ${'{…}'} binding</span>}
      >
        <PropertyList labelWidth={108}>
          <PropertyRow label="trigger">session · message #214</PropertyRow>
          <PropertyRow label="plan">market-brief v1 · reused</PropertyRow>
          <PropertyRow label="budget">$2.00 · 40k tokens · 5 lanes</PropertyRow>
        </PropertyList>
      </PanelBox>

      <PanelBox title="Reported" aside={<Badge variant="outline">47</Badge>}>
        <PropertyList labelWidth={108}>
          <PropertyRow label="unresolved isin">31</PropertyRow>
          <PropertyRow label="bad quantity">12</PropertyRow>
          <PropertyRow label="out of window">4</PropertyRow>
        </PropertyList>
      </PanelBox>

      <PanelBox title="Output · rows" aside="1,880 rows · first 3" flush>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>supplier</TableHead>
              <TableHead>route</TableHead>
              <TableHead>exposure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono">Meridian Parts</TableCell>
              <TableCell className="font-mono">RED_SEA</TableCell>
              <TableCell className="font-mono">0.82</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">Kalyan Steel</TableCell>
              <TableCell className="font-mono">RED_SEA</TableCell>
              <TableCell className="font-mono">0.71</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono">Onyx Logistics</TableCell>
              <TableCell className="font-mono">SUEZ</TableCell>
              <TableCell className="font-mono">0.44</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </PanelBox>
    </div>
  ),
};
