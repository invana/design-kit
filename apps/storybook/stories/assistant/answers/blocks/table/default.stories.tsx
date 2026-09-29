import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Table",
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
  label: "table",
  blocks: [
    {
      preset: "table",
      columns: [
        {
          key: "store",
          label: "Store",
        },
        {
          key: "margin",
          label: "Margin",
          align: "right",
        },
        {
          key: "delta",
          label: "Δ pts",
          align: "right",
        },
      ],
      rows: [
        {
          store: "North Mall",
          margin: "11.4%",
          delta: {
            value: "−3.1",
            tone: "bad",
          },
        },
        {
          store: "Northgate",
          margin: "12.0%",
          delta: {
            value: "−2.6",
            tone: "bad",
          },
        },
        {
          store: "Riverside",
          margin: "15.8%",
          delta: {
            value: "+0.4",
            tone: "good",
          },
        },
      ],
      total: 214,
      noun: "stores",
    },
  ],
};

/** The first rows of a longer table, with how many there are under them. A cell with a `tone` is inked by it; `strong` marks the figure a row turns on. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
