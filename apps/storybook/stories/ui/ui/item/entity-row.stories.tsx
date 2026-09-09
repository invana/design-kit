import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions,
  ItemGroup, StatusDot, Badge, AgentChip,
} from '@invana/ui';
import { Bot } from 'lucide-react';

const meta: Meta<typeof Item> = {
  title: 'UI/UI/Item',
  component: Item,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The application list row, at `size="xs"` — 30px.
 *
 * Nothing new was built for this: it is `Item` with a density and a selected
 * state. The roster, datasets, schedules, workflows, the review queue and the
 * model's type lists are all this row.
 */
export const EntityRow: Story = {
  render: () => (
    <div className="w-[420px] border border-border bg-card">
      <ItemGroup>
        <Item size="xs">
          <ItemMedia><StatusDot tone="success" size="md" /></ItemMedia>
          <ItemContent>
            <ItemTitle>
              Market Scout <Badge variant="outline" size="xs" tone="muted">default</Badge>
            </ItemTitle>
            <ItemDescription>claude-opus-5 · 4 skills · 1 running</ItemDescription>
          </ItemContent>
          <ItemActions><Badge variant="outline" size="sm" tone="success">active</Badge></ItemActions>
        </Item>

        <Item size="xs" selected>
          <ItemMedia><StatusDot tone="success" size="md" /></ItemMedia>
          <ItemContent>
            <ItemTitle>Intraday Analyst</ItemTitle>
            <ItemDescription>5 skills · 1 in review · 1 needs input</ItemDescription>
          </ItemContent>
          <ItemActions><Badge variant="outline" size="sm" tone="success">active</Badge></ItemActions>
        </Item>

        <Item size="xs" className="pl-6">
          <ItemMedia><StatusDot tone="muted" size="md" /></ItemMedia>
          <ItemContent>
            <ItemTitle>└ Risk Checker</ItemTitle>
            <ItemDescription>spawned · ephemeral · retired 6 min ago</ItemDescription>
          </ItemContent>
          <ItemActions><Badge variant="outline" size="sm" tone="muted">retired</Badge></ItemActions>
        </Item>

        <Item size="xs">
          <ItemMedia><StatusDot tone="warning" size="md" /></ItemMedia>
          <ItemContent>
            <ItemTitle>Setup check BEL</ItemTitle>
            <ItemDescription>
              <AgentChip icon={<Bot />} name="Intraday Analyst" /> · asked a question
            </ItemDescription>
          </ItemContent>
          <ItemActions><Badge variant="outline" size="sm" tone="warning">needs input</Badge></ItemActions>
        </Item>
      </ItemGroup>
    </div>
  ),
};
