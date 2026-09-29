import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  ConversationTurn,
  resolveRegistry,
  type AnswerTurn,
} from "@invana/assistant";

const meta: Meta<typeof ConversationTurn> = {
  title: "Assistant/Answers/Blocks/Proposal",
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
  label: "answer",
  blocks: [
    {
      preset: "proposal",
      title: "from this answer",
      rows: [
        {
          label: "Alert",
          value: "Refunds > 2σ by store",
        },
        {
          label: "Checks",
          value: "Daily, 07:00",
        },
        {
          label: "Notify",
          value: "Store managers",
        },
      ],
      consequence:
        "Creates one alert rule. It would have fired 3 times in September.",
      actions: [
        {
          id: "create-alert",
          label: "Create alert",
          variant: "primary",
        },
        {
          id: "edit",
          label: "Edit",
          variant: "secondary",
        },
      ],
    },
  ],
};

/** A proposal renders as its own card under the answer. Each action sends an `action` event with its id (see the Actions panel). */
export const Default: Story = {
  args: { turn, registry: resolveRegistry(), onEvent: fn() },
};
