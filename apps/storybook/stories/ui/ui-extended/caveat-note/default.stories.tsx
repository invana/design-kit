import type { Meta, StoryObj } from "@storybook/react-vite";
import { CaveatNote } from "@invana/ui";

const meta: Meta<typeof CaveatNote> = {
  title: "UI/UI Extended/CaveatNote",
  component: CaveatNote,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** What was left out, and how far to trust the figure. The label names the kind of caveat, so an association reads differently from a simulation. */
export const Default: Story = {
  args: {
    label: "indicative",
    children:
      "Based on 38 of 42 stores. Four with incomplete September data are excluded.",
  },
};
