import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Suggestions",
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
  label: "next",
  blocks: [
    {
      preset: "suggestions",
      items: [
        "Break freight down by carrier",
        "Compare with Q3 last year",
        "Alert me if it gets worse",
      ],
    },
  ],
};

/** Follow-ups that reuse the current scope. Picking one sends a `suggestion` event, which the API sends on as the next prompt (see the Actions panel). */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
