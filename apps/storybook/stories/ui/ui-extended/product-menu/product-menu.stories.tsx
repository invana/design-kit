import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within, screen } from 'storybook/test';
import { Badge, HeaderTrail, ProductMenu, type ProductMenuGroup } from '@invana/ui';
import { Bot, Compass, Hexagon, House } from 'lucide-react';

interface Args {
  onSelect: (key: string) => void;
}

const meta = {
  title: 'UI/UI Extended/ProductMenu',
  parameters: { layout: 'padded' },
  args: { onSelect: fn() },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

function groupsFor(open: string, select: (key: string) => void): ProductMenuGroup[] {
  const item = (key: string, name: string, description: string, icon: React.ElementType, badge?: React.ReactNode) => ({
    key,
    name,
    description,
    icon,
    badge,
    current: key === open,
    onSelect: () => select(key),
  });
  return [
    {
      label: 'Invana',
      items: [
        item('home', 'Home', 'Your decisions across every Graph', House),
        item('agents', 'Agents', 'Agents and the skills they run', Bot, <Badge tone="info" size="xs">Experimental</Badge>),
      ],
    },
    {
      label: 'This Graph · airways',
      items: [
        item('model', 'Model', 'Types, stitches, worlds and guardrails', Hexagon),
        item('explore', 'Explore', 'Ask and draw the graph', Compass),
      ],
    },
  ];
}

function Demo({ onSelect }: Args) {
  const [open, setOpen] = React.useState('model');
  const select = (key: string) => {
    setOpen(key);
    onSelect(key);
  };
  return (
    <div className="flex h-10 items-center border-b border-border bg-chrome px-2">
      <HeaderTrail brand={<ProductMenu title="Invana" groups={groupsFor(open, select)} />} crumbs={[{ label: 'Models' }, { label: 'AirRoutes' }]} />
    </div>
  );
}

/**
 * The product menu at the left of an app header, passed as `HeaderTrail`'s `brand` so the trail
 * follows it. The trigger names the wordmark and the open product; the menu lists every product in
 * its groups with an icon, a description and an optional badge, the open one ticked. Picking one
 * calls its `onSelect`.
 */
export const InTheHeader: Story = {
  render: ({ onSelect }) => <Demo onSelect={onSelect} />,
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('The trigger names the open product, and the trail follows it', async () => {
      await expect(canvas.getByRole('button', { name: 'Products, Model open' })).toBeInTheDocument();
      await expect(canvas.getByText('AirRoutes')).toHaveAttribute('aria-current', 'page');
    });
    await step('The menu ticks the open product; picking another opens it', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Products, Model open' }));
      await expect(await screen.findByRole('menuitem', { name: /Model/ })).toHaveAttribute('aria-current', 'page');
      await userEvent.click(screen.getByRole('menuitem', { name: /Explore/ }));
      await expect(args.onSelect).toHaveBeenCalledWith('explore');
      await expect(canvas.getByRole('button', { name: 'Products, Explore open' })).toBeInTheDocument();
    });
  },
};
