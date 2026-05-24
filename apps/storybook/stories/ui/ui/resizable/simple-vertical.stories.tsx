import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@invana/ui";

const meta: Meta = {
  title: 'UI/UI/Resizable',
  parameters: {
    layout: 'fullscreen',
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleVertical: Story = {
  render: () => (
    <div className="h-screen w-screen">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full bg-purple-500 p-4 text-white">
            Top Panel - Try to resize me!
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className="h-full bg-orange-500 p-4 text-white">
            Bottom Panel
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
