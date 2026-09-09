import type { Meta, StoryObj } from '@storybook/react-vite';
import { PanelContent, PropertyList, PropertyRow, Badge, Button } from '@invana/ui';
import { X } from 'lucide-react';

const meta: Meta<typeof PanelContent> = {
  title: 'UI/UI Extended/PanelContent',
  component: PanelContent,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The panel in the job it was built for: an inspector docked beside the canvas,
 * showing what the selected thing is.
 */
export const InspectorPanel: Story = {
  render: () => (
    <div className="flex h-[380px] w-[640px] overflow-hidden rounded-md border">
      <div className="flex flex-1 items-center justify-center bg-muted/30 text-muted-foreground">
        Canvas
      </div>
      <div className="w-[280px] border-l">
        <PanelContent
          title={
            <span className="flex items-center gap-2">
              orders_by_region
              <Badge variant="soft" tone="success" size="xs">live</Badge>
            </span>
          }
          headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
          footerContent={
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Open query
            </Button>
          }
        >
          <PropertyList labelWidth={84}>
            <PropertyRow label="Type">Materialised view</PropertyRow>
            <PropertyRow label="Source" mono>warehouse.public.orders</PropertyRow>
            <PropertyRow label="Rows">1,284,913</PropertyRow>
            <PropertyRow label="Refreshed">12 minutes ago</PropertyRow>
            <PropertyRow label="Owner">data-platform</PropertyRow>
            <PropertyRow label="Id" mono>mv_8f31c0a4</PropertyRow>
          </PropertyList>
        </PanelContent>
      </div>
    </div>
  ),
};
