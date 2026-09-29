import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Scope",
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
  label: "scope",
  blocks: [
    {
      preset: "scope",
      parts: [
        "Q3 2026",
        "vs Q2",
        "Stores, Online",
        "214 stores",
        "as of 06:00",
      ],
    },
  ],
};

/** Period, comparison, filters, population and freshness, as the query applied them. An answer’s envelope draws its scope with this same block. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
