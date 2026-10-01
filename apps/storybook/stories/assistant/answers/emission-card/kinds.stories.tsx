import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  MetricTile,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TypographyMuted,
} from '@invana/ui';
import { CitationMarker, EmissionBody, EmissionCard } from '@invana/assistant';

const meta: Meta<typeof EmissionCard> = {
  title: 'Assistant/Answers/EmissionCard',
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
        <EmissionBody>
          <MetricTile
            variant="hero"
            label="Defence theme · 5 sessions"
            value="+4.8%"
            tone="success"
            caption="Nifty +1.1% over the same window"
          />
        </EmissionBody>
      </EmissionCard>

      <EmissionCard kind="table" template="table-compact@3" citation="cite · 4 records">
        <EmissionBody>
          <Table density="compact" seamless>
            <TableHeader>
              <TableRow><TableHead>stock</TableHead><TableHead>week</TableHead><TableHead>call</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>BEL</TableCell><TableCell>+7.2%</TableCell><TableCell>hold</TableCell></TableRow>
              <TableRow><TableCell>MIDHANI</TableCell><TableCell>−1.2%</TableCell><TableCell>review</TableCell></TableRow>
            </TableBody>
          </Table>
        </EmissionBody>
      </EmissionCard>

      <EmissionCard kind="prose" template="prose-cited@2" citation="cite · 12 records">
        <EmissionBody>
          <p>
            BEL and HAL carried the week<CitationMarker>1,2</CitationMarker>; MIDHANI left the
            flagged band on Thursday<CitationMarker>3</CitationMarker>.
          </p>
        </EmissionBody>
      </EmissionCard>

      <EmissionCard kind="empty" template="empty@1" citation="cite · 0 records">
        <EmissionBody>
          <TypographyMuted>The graph does not hold delivery % for BDL after 4 Sep.</TypographyMuted>
        </EmissionBody>
      </EmissionCard>
    </div>
  ),
};
