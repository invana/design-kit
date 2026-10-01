import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ScopeLine } from "@invana/ui";

const meta: Meta<typeof ScopeLine> = {
  title: "UI/UI Extended/ScopeLine",
  component: ScopeLine,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Editable — click a part to change it in place; `Enter` sends the new value. The
 * freshness is fixed: it is a fact about the data, not a choice.
 */
export const Editable: Story = {
  args: {
    parts: ["Q3 2026", "vs Q2", "Stores, Online", "214 stores", "as of 06:00"],
    fixedParts: [4],
    onPartChange: fn(),
  },
};
