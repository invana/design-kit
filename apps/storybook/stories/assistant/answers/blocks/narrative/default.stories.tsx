import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Narrative",
  component: ConversationTurn,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const turn: AnswerTurn = {
  id: "t1",
  role: "assistant",
  kind: "answer",
  state: "complete",
  label: "prose",
  blocks: [
    {
      preset: "narrative",
      text: "Operating margin fell **1.8 pts** to **14.2%** in Q3. About two thirds of the fall came from freight costs in the North region, which rose after the July carrier change.",
      cites: [1, 2],
    },
  ],
};

/** The answer in two or three sentences, leading with the number. `**…**` marks the figures; `cites` add a marker per source. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
