import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  Badge,
  BoundChip,
  Button,
  ButtonGroup,
  RecordHeader,
  ToggleGroup,
  ToggleGroupItem,
} from '@invana/ui';

const meta: Meta<typeof RecordHeader> = {
  title: 'UI/UI Extended/RecordHeader',
  component: RecordHeader,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Which record you are looking at, across the top of the surface showing it.
 *
 * The **last** crumb is the record and is set solid; the ones before it are the
 * path to it and are muted — so a task opened from a run is never read out of
 * context. Crumbs are mono because they are identifiers, not prose.
 *
 * Not a `ContextBar`: that sits under a panel and describes the *view* — counts,
 * a keyboard hint. This sits above the content and names the *record*.
 *
 * `lg` by default: 40px, a control's height, holding `sm` chips and buttons.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-full max-w-[860px] flex-col gap-4">
      <RecordHeader
        tone="running"
        crumbs={['Which suppliers are exposed to the Red Sea route?']}
        chips={
          <>
            <BoundChip bound="llm" />
            <Badge variant="outline" size="sm">running</Badge>
          </>
        }
        actions={
          <>
            <ToggleGroup type="single" value="dashboard" size="sm">
              <ToggleGroupItem value="dashboard">Dashboard</ToggleGroupItem>
              <ToggleGroupItem value="yml">dashboard.yml</ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal />
            </Button>
          </>
        }
      />

      <RecordHeader
        tone="success"
        crumbs={['orders.csv → Brokerage.Order', 'import_dataset']}
        chips={
          <>
            <BoundChip bound="ingest" />
            <Badge variant="outline" size="sm">succeeded</Badge>
          </>
        }
        actions={
          <ButtonGroup>
            <Button variant="ghost" size="icon-sm" aria-label="Previous task">
              <ChevronLeft />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Next task">
              <ChevronRight />
            </Button>
          </ButtonGroup>
        }
      />

      <RecordHeader
        tone="warning"
        crumbs={['nightly-load', 'import_dataset']}
        chips={<Badge variant="outline" size="sm">draft v5</Badge>}
        actions={<Button size="sm">Publish v5</Button>}
      />
    </div>
  ),
};
