import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Record",
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
  label: "record",
  blocks: [
    {
      preset: "record",
      rows: [
        {
          label: "Customer",
          value: "Acme Holdings",
        },
        {
          label: "Segment",
          value: "Enterprise",
        },
        {
          label: "ARR",
          value: "£412,000",
        },
        {
          label: "Renewal",
          value: "14 Jan 2027",
        },
        {
          label: "Health",
          value: "At risk · 3 signals",
        },
      ],
    },
  ],
};

/** One entity, or the assumptions behind an answer, as label/value pairs with mono values. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
