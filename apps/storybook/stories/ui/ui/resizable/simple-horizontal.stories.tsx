import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@invana/ui";

const meta: Meta = {
  title: 'UI/UI/Resizable',
  parameters: {
    layout: 'fullscreen',
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleHorizontal: Story = {
  render: () => (
    <div className="h-screen w-screen">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full bg-blue-500 p-4 text-white">
            Left Panel - Try to resize me!
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full bg-green-500 p-4 text-white">
            Right Panel
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
