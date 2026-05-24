import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider, Label } from '@invana/forms';

const meta = {
  title: 'UI/UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof Slider>;


/**
 * Default slider.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteShowcase: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => (
    <div className="p-8 space-y-8 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Sliders</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="default">Default (0-100)</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="default" defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="min-max">Custom Range (10-90)</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="min-max" defaultValue={[50]} min={10} max={90} step={1} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Different Step Values</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="step-1">Step: 1</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="step-1" defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="step-5">Step: 5</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="step-5" defaultValue={[50]} max={100} step={5} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="step-10">Step: 10</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="step-10" defaultValue={[50]} max={100} step={10} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="step-25">Step: 25</Label>
              <span className="text-sm text-muted-foreground">50</span>
            </div>
            <Slider id="step-25" defaultValue={[50]} max={100} step={25} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="normal">Normal</Label>
            <Slider id="normal" defaultValue={[50]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled" className="text-muted-foreground">Disabled</Label>
            <Slider id="disabled" defaultValue={[50]} max={100} step={1} disabled />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Common Use Cases</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="volume">🔊 Volume</Label>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Slider id="volume" defaultValue={[75]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="brightness">☀️ Brightness</Label>
              <span className="text-sm text-muted-foreground">60%</span>
            </div>
            <Slider id="brightness" defaultValue={[60]} max={100} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="zoom">🔍 Zoom</Label>
              <span className="text-sm text-muted-foreground">100%</span>
            </div>
            <Slider id="zoom" defaultValue={[100]} min={50} max={200} step={10} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="price">💰 Price Range</Label>
              <span className="text-sm text-muted-foreground">$500</span>
            </div>
            <Slider id="price" defaultValue={[500]} max={1000} step={50} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rating">⭐ Rating</Label>
              <span className="text-sm text-muted-foreground">4</span>
            </div>
            <Slider id="rating" defaultValue={[4]} min={1} max={5} step={1} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">RGB Color Mixer</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="red" className="text-red-500">Red</Label>
              <span className="text-sm text-muted-foreground">255</span>
            </div>
            <Slider id="red" defaultValue={[255]} max={255} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="green" className="text-green-500">Green</Label>
              <span className="text-sm text-muted-foreground">128</span>
            </div>
            <Slider id="green" defaultValue={[128]} max={255} step={1} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="blue" className="text-blue-500">Blue</Label>
              <span className="text-sm text-muted-foreground">0</span>
            </div>
            <Slider id="blue" defaultValue={[0]} max={255} step={1} />
          </div>
        </div>
      </div>
    </div>
  ),
};
