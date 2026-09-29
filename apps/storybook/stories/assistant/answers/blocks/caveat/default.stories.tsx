import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Caveat",
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
  label: "caveat",
  blocks: [
    {
      preset: "caveat",
      label: "indicative",
      text: "Based on 38 of 42 stores. Four with incomplete September data are excluded.",
    },
    {
      preset: "caveat",
      label: "association",
      text: "Delivery speed moves with repeat rate, but this does not show it causes it.",
    },
  ],
};

/** What was excluded, imputed or assumed. An answer’s envelope caveats draw with this same block, under the figures. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
