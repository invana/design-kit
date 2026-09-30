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
  ['extract', 'llm/ollama-local/llama-3.1-8b', 'set on the agent'],
  ['decide', 'nothing casts it', 'the call that matters'],
  ['judge', 'nothing casts it', 'checks an answer'],
];

/**
 * `seamless` — for a table inside a card, a panel or an answer, whose edge
 * already frames it. No box: only the rules between rows, and the first and
 * last columns flush with the text around the table.
 */
export const Seamless: Story = {
  render: () => (
    <div className="w-[420px]">
      <Table density="compact" seamless>
        <TableHeader>
          <TableRow>
            <TableHead>role</TableHead><TableHead>resolves to</TableHead><TableHead>why this one</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((r) => (
            <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i}>{c}</TableCell>)}</TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};
