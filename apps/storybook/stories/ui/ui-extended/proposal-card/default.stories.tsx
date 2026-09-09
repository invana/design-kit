import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ProposalCard, PropertyList, PropertyRow, Button,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@invana/ui';

const meta: Meta<typeof ProposalCard> = {
  title: 'UI/UI Extended/ProposalCard',
  component: ProposalCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  ['2 Sep', 'INFY', '+1.7%', '24%', 'depreciate 2'],
  ['4 Sep', 'TATAMOTORS', '+2.1%', '28%', 'depreciate 1'],
  ['5 Sep', 'ONGC', '+1.6%', '19%', 'depreciate 1'],
];

/** The draft and the evidence it rests on, together — the decision is made against instances. */
export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <ProposalCard
        title="Draft pattern"
        source="from the agent's result"
        evidenceTitle="The instances"
        evidenceMeta="30 days"
        consequence="Authoring writes a Pattern node with these observations as its first instances. An agent proposes; a person publishes."
        actions={<><Button size="sm">Author pattern</Button><Button size="sm" variant="outline">Reject with note</Button></>}
        evidence={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>date</TableHead><TableHead>ticker</TableHead>
                <TableHead>gap</TableHead><TableHead>delivery</TableHead><TableHead>learning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((r) => (
                <TableRow key={r[1]}>{r.map((c, i) => <TableCell key={i} className="font-mono text-meta">{c}</TableCell>)}</TableRow>
              ))}
            </TableBody>
          </Table>
        }
      >
        <PropertyList labelWidth={74}>
          <PropertyRow label="key" mono>gap-no-delivery</PropertyRow>
          <PropertyRow label="if">gap ≥ 1.5% at open AND delivery % &lt; 30</PropertyRow>
          <PropertyRow label="then">fades to VWAP by 11:00; never a long</PropertyRow>
          <PropertyRow label="direction">avoid</PropertyRow>
        </PropertyList>
      </ProposalCard>
    </div>
  ),
};
