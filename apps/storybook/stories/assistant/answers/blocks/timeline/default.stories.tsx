import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Timeline",
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
  label: "timeline",
  blocks: [
    {
      preset: "timeline",
      events: [
        {
          when: "12 Sep",
          text: "Loaded at Rotterdam",
          tone: "good",
        },
        {
          when: "19 Sep",
          text: "Held at customs · 3 days",
          tone: "warn",
        },
        {
          when: "23 Sep",
          text: "Arrived Felixstowe",
        },
        {
          when: "26 Sep",
          text: "Delivered, 4 days late",
        },
      ],
    },
  ],
};

/** A few dated events, each marked by its `tone`. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
