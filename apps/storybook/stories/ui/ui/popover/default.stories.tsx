import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Popover, PopoverContent, PopoverTrigger, TypographyH6 } from '@invana/ui';
import { Settings2 } from 'lucide-react';

const meta: Meta<typeof Popover> = {
  title: 'UI/UI/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 className="h-4 w-4" />
          Dimensions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <TypographyH6>Dimensions</TypographyH6>
            <p className="text-base text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width" className="text-base">
                Width
              </label>
              <input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8 rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height" className="text-base">
                Height
              </label>
              <input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8 rounded-md border border-input bg-transparent px-3 text-base outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
