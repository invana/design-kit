import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmissionCard, CitationMarker, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@invana/ui';

const meta: Meta<typeof EmissionCard> = {
  title: 'UI/UI Extended/EmissionCard',
  component: EmissionCard,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every kind is a body inside the same card (DS9). The reader learns one shape
 * and then only reads the body.
 */
export const Kinds: Story = {
  render: () => (
    <div className="flex w-[330px] flex-col gap-2">
      <EmissionCard kind="metric" template="stat-compact@1" citation="cite · 214 records">
        <div className="flex flex-col gap-0.5 p-2">
          <span className="text-base font-medium text-success">+4.8%</span>
          <span className="text-meta text-muted-foreground">Defence theme · 5 sessions</span>
          <span className="text-meta text-muted-foreground">Nifty +1.1% over the same window</span>
        </div>
      </EmissionCard>

      <EmissionCard kind="table" template="table-compact@3" citation="cite · 4 records">
        <Table>
          <TableHeader>
            <TableRow><TableHead>stock</TableHead><TableHead>week</TableHead><TableHead>call</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>BEL</TableCell><TableCell>+7.2%</TableCell><TableCell>hold</TableCell></TableRow>
            <TableRow><TableCell>MIDHANI</TableCell><TableCell>−1.2%</TableCell><TableCell>review</TableCell></TableRow>
          </TableBody>
        </Table>
      </EmissionCard>

      <EmissionCard kind="prose" template="prose-cited@2" citation="cite · 12 records">
        <p className="p-2">
          BEL and HAL carried the week<CitationMarker>1,2</CitationMarker>; MIDHANI left the
          flagged band on Thursday<CitationMarker>3</CitationMarker>.
        </p>
      </EmissionCard>

      <EmissionCard kind="empty" template="empty@1" citation="cite · 0 records">
        <p className="p-2 text-muted-foreground">
          The graph does not hold delivery % for BDL after 4 Sep.
        </p>
      </EmissionCard>
    </div>
  ),
};
