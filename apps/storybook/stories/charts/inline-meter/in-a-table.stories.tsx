import type { Meta, StoryObj } from '@storybook/react-vite';
import { InlineMeter } from '@invana/charts';
import {
  PanelBox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

const STEPS = [
  { name: 'parse_intent', share: 0.13 },
  { name: 'ask_user', share: null },
  { name: 'resolve_schema', share: 0.05 },
  { name: 'build_query', share: 0.18 },
  { name: 'validate_query', share: 0.02 },
  { name: 'execute_query', share: 0.32 },
  { name: 'summarise', share: 0.15 },
  { name: 'deliver', share: 0.02 },
  { name: 'call_enrichment', share: 0.01 },
];

const meta: Meta<typeof InlineMeter> = {
  title: 'Charts/InlineMeter',
  component: InlineMeter,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Plan page · each step's share of the plan's work. The shares are small, so `max`
 * is the largest share: the longest bar fills its track while every number stays the
 * true share. A step that did no work reads `—`.
 */
export const InATable: Story = {
  render: () => (
    <PanelBox title="Each step, across 1,204 runs" flush>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step</TableHead>
            <TableHead>Share of work</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {STEPS.map((s) => (
            <TableRow key={s.name}>
              <TableCell>{s.name}</TableCell>
              <TableCell>
                <InlineMeter value={s.share} max={0.32} label="share of work" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PanelBox>
  ),
};
