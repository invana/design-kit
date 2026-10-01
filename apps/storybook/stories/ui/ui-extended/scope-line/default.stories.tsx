import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScopeLine } from "@invana/ui";

const meta: Meta<typeof ScopeLine> = {
  title: "UI/UI Extended/ScopeLine",
  component: ScopeLine,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Period, comparison, filters, population and freshness, as the query applied them, in one strip above the figures. */
export const Default: Story = {
  args: {
    parts: ["Q3 2026", "vs Q2", "Stores, Online", "214 stores", "as of 06:00"],
  },
};
