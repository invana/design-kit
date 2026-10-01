import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SuggestionChips } from "@invana/assistant";

const meta: Meta<typeof SuggestionChips> = {
  title: "Assistant/Asks/SuggestionChips",
  component: SuggestionChips,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Follow-ups that reuse the current scope. Picking one sends it as the next prompt (see the Actions panel). */
export const Default: Story = {
  args: {
    items: [
      "Break freight down by carrier",
      "Compare with Q3 last year",
      "Alert me if it gets worse",
    ],
    onSelect: fn(),
  },
};
