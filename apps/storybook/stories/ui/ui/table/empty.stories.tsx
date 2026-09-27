import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@invana/ui';

const meta: Meta<typeof Table> = {
  title: 'UI/UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
};


export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <Table>
      <TableCaption>No data available</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* <TableRow> */}
        {/* <TableCell colSpan={4} className="text-center text-muted-foreground">
            No results
          </TableCell> */}
        {/* </TableRow> */}
      </TableBody>
    </Table>
  ),
};
