import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Button,
} from '@invana/ui';
import { Settings } from 'lucide-react';

const meta: Meta<typeof Sheet> = {
  title: 'UI/UI/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Open settings
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Update your workspace details. Changes are applied immediately.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-6">
          <div className="grid gap-2">
            <label htmlFor="workspace" className="text-sm font-medium">
              Workspace name
            </label>
            <input
              id="workspace"
              defaultValue="Invana"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-medium">
              URL slug
            </label>
            <input
              id="slug"
              defaultValue="invana"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
