import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';

const meta: Meta<typeof Table> = {
  title: 'UI/UI/Table',
  component: Table,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  ['gap-continuation', '14', '12', '+6'],
  ['gap-no-delivery', '6', '2', '−5'],
  ['orb-hold', '9', '8', '+3'],
];

/** One `density` on the table — never a size per cell, or a table ends up with two. */
export const Compact: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-4">
      <Table density="compact">
        <TableHeader>
          <TableRow>
            <TableHead>pattern</TableHead><TableHead>instances</TableHead>
            <TableHead>accepted</TableHead><TableHead>net</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i}>{c}</TableCell>)}</TableRow>
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow><TableHead>default density, unchanged</TableHead></TableRow>
        </TableHeader>
        <TableBody><TableRow><TableCell>gap-continuation</TableCell></TableRow></TableBody>
      </Table>
    </div>
  ),
};
