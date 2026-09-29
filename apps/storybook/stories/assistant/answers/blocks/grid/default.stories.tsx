import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Grid",
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
  label: "chart",
  blocks: [
    {
      preset: "grid",
      tiles: [
        {
          label: "Lead time",
          value: "26 d",
          delta: "▲ 8 d vs normal",
          tone: "bad",
        },
        {
          label: "On time",
          value: "61%",
          delta: "▼ 22 pts",
          tone: "bad",
        },
        {
          label: "Open POs",
          value: "142",
          delta: "£2.3M",
        },
      ],
    },
  ],
};

/** A band of figures in one joined strip. Each change is inked by its `tone`; one with none stays muted. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
