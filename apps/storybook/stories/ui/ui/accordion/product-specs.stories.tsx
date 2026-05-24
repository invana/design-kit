import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@invana/ui';

const meta: Meta = {
  title: 'UI/UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};


// ===== BASIC ACCORDION EXAMPLES =====

/**
 * Basic single accordion.
 * Only one item can be open at a time (default behavior).
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const ProductSpecs: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[600px]">
      <AccordionItem value="features">
        <AccordionTrigger>Features & Benefits</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>High-performance processor for lightning-fast operations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Long-lasting battery with up to 20 hours of use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Sleek, lightweight design for portability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Advanced security features including fingerprint reader</span>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="specs">
        <AccordionTrigger>Technical Specifications</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Processor:</div>
            <div>Intel Core i7-12700H</div>
            <div className="font-medium">RAM:</div>
            <div>16GB DDR5</div>
            <div className="font-medium">Storage:</div>
            <div>512GB NVMe SSD</div>
            <div className="font-medium">Display:</div>
            <div>15.6" FHD (1920x1080)</div>
            <div className="font-medium">Graphics:</div>
            <div>NVIDIA RTX 3060</div>
            <div className="font-medium">Weight:</div>
            <div>4.2 lbs (1.9 kg)</div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="compatibility">
        <AccordionTrigger>Compatibility & Requirements</AccordionTrigger>
        <AccordionContent>
          <p className="mb-2"><strong>Operating Systems:</strong></p>
          <ul className="list-disc pl-5 mb-3">
            <li>Windows 11 Pro</li>
            <li>Compatible with Windows 10</li>
            <li>Linux support available</li>
          </ul>
          <p className="mb-2"><strong>Connectivity:</strong></p>
          <ul className="list-disc pl-5">
            <li>Wi-Fi 6E (802.11ax)</li>
            <li>Bluetooth 5.2</li>
            <li>3x USB-C, 2x USB-A, HDMI 2.1</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="package">
        <AccordionTrigger>What's in the Box</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1">
            <li>• Laptop computer</li>
            <li>• Power adapter and cable</li>
            <li>• Quick start guide</li>
            <li>• Warranty card</li>
            <li>• Cleaning cloth</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Settings Panel.
 * Use for organizing application settings and preferences.
 */
