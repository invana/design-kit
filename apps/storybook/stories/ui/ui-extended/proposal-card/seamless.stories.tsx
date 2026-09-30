import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  Button,
  ProposalCard,
  PropertyList,
  PropertyRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

type Args = React.ComponentProps<typeof ProposalCard> & { onAction: (id: string) => void };

const meta: Meta<Args> = {
  title: 'UI/UI Extended/ProposalCard',
  component: ProposalCard,
  parameters: { layout: 'padded' },
  args: { onAction: fn() },
};

export default meta;
type Story = StoryObj<Args>;

const INSTANCES = [
  ['North Mall', '14 Sep', '£3,120'],
  ['Northgate', '19 Sep', '£2,840'],
  ['Riverside', '26 Sep', '£2,410'],
];

/**
 * `seamless`: the evidence without its box, for evidence that is a seamless
 * table — only the rules between its rows, flush with the draft above it.
 */
export const Seamless: Story = {
  render: ({ onAction }) => (
    <ProposalCard
      flush
      seamless
      evidenceTitle="The three instances"
      evidenceMeta="30 days"
      evidence={
        <Table density="compact" seamless>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Refunds</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INSTANCES.map((r) => (
              <TableRow key={r[0]}>
                {r.map((c, i) => (
                  <TableCell key={i}>{c}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      consequence="Creates one alert rule. It would have fired 3 times in September."
      actions={
        <Button size="xs" onClick={() => onAction('create-alert')}>
          Create alert
        </Button>
      }
    >
      <PropertyList labelWidth="auto">
        <PropertyRow label="Alert" mono>
          Refunds &gt; 2σ by store
        </PropertyRow>
        <PropertyRow label="Checks" mono>
          Daily, 07:00
        </PropertyRow>
      </PropertyList>
    </ProposalCard>
  ),
};
