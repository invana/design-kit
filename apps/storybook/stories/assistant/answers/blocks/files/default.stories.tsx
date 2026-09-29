import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Files",
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
  label: "files",
  blocks: [
    {
      preset: "files",
      files: [
        {
          name: "margin-bridge-q3.xlsx",
          size: "48 KB",
          digest: "a91f03c2",
        },
        {
          name: "rejected-rows.csv",
          size: "6 KB",
          digest: "77be1d0e",
        },
        {
          name: "chart-freight.png",
          size: "112 KB",
          digest: "c0d45a9b",
        },
      ],
    },
  ],
};

/** The files an answer hands over: name, size and digest in bare rows. */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
