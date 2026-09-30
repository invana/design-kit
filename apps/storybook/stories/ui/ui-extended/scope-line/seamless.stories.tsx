import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScopeLine } from "@invana/ui";

const meta: Meta<typeof ScopeLine> = {
  title: "UI/UI Extended/ScopeLine",
  component: ScopeLine,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `seamless`: no box around the strip, only the rules between parts, and the
 * first part flush with the text around it — for a scope inside an answer.
 */
export const Seamless: Story = {
  args: {
    parts: ["Q3 2026", "vs Q2", "Stores, Online", "214 stores", "as of 06:00"],
    seamless: true,
  },
};
