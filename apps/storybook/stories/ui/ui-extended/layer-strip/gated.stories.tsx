import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  LayerStrip,
  type LayerBand,
  type LayerItem,
  type LayerSeam,
} from "@invana/ui";

import { LAYER_PALETTE } from "./_run";

const meta: Meta<typeof LayerStrip> = {
  title: "UI/UI Extended/LayerStrip",
  component: LayerStrip,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** `settle-invoice@4` — pay an approved invoice and tell the supplier. */
const BANDS: LayerBand[] = [
  { layer: "human", note: "0 tasks · the gates are not tasks" },
  { layer: "agent", spine: true },
  { layer: "cache", note: "nothing declared" },
  {
    layer: "llm",
    note: "1 role",
    parts: [
      { id: "decide", label: "role: decide", note: "it drafts the payment" },
    ],
  },
  {
    layer: "graph_data",
    note: "1 read · 1 write",
    parts: [
      {
        id: "invoice",
        label: "model/Invoice@v2",
        note: "the invoice, and its terms",
      },
      {
        id: "settlement",
        label: "model/Settlement@v1",
        note: "written only after the money moved",
      },
    ],
  },
  {
    layer: "third_party",
    note: "2 · both leave the graph",
    parts: [
      {
        id: "bank",
        label: "third_party/bank/payments",
        note: "egress: amount + IBAN",
      },
      { id: "email", label: "third_party/app/email", note: "egress: a note" },
    ],
  },
];

const ITEMS: LayerItem[] = [
  {
    id: "load_invoice",
    label: "load_invoice",
    layer: "graph_data",
    part: "invoice",
    start: 1,
    end: 2,
    note: "read",
  },
  {
    id: "draft_payment",
    label: "draft_payment",
    layer: "llm",
    part: "decide",
    start: 2,
    end: 3,
    note: "decide",
  },
  {
    id: "send_payment",
    label: "send_payment",
    layer: "third_party",
    part: "bank",
    start: 3,
    end: 4,
    note: "egress · money",
  },
  {
    id: "record_settlement",
    label: "record_settlement",
    layer: "graph_data",
    part: "settlement",
    start: 4,
    end: 5,
    note: "write",
  },
  {
    id: "notify_supplier",
    label: "notify_supplier",
    layer: "third_party",
    part: "email",
    start: 5,
    end: 6,
    note: "egress · text",
  },
];

/**
 * Three gates, three treatments — and none of them is a bar.
 *
 * `approval` is on the plan: a solid rule at step 3, with its label to the
 * **right** of it, because the step it gates has not started and declining
 * spends nothing. `if: envelope` is not on the plan at all — it resolves at
 * dispatch, so the same plan is gated for a junior caller and open for a
 * senior one, and a dashed rule says *this may appear*. `budget exhausted` has
 * no position: the runtime can raise it at any dispatch, so it runs the axis
 * rather than picking a moment to be wrong about.
 */
const SEAMS: LayerSeam[] = [
  {
    id: "envelope",
    at: 2,
    label: "if: envelope",
    conditional: true,
    note: "cost > threshold · not on the plan",
  },
  {
    id: "approval",
    at: 3,
    label: "approval · before dispatch",
    note: "nothing spent · finance-approvers · 4h",
  },
  {
    id: "budget",
    label: "budget exhausted · raised by the runtime",
    note: "any dispatch · the one pause with no deadline",
  },
];

/**
 * A plan with gates — what stops it, and what saying no costs.
 *
 * **A gate is a seam, never a row.** Nothing is dispatched at a gate: it holds
 * no pool slot, it has no form and it spends no participant, so it cannot sit
 * on the `human` band beside tasks that do all three. It stops every layer at
 * once, which makes it a **moment**, and a moment on a time axis is a rule the
 * bands are crossed by. This is also the only drawing left once task names
 * stop being the axis — there are no columns for a gate to sit between.
 *
 * **Position is the price.** The label hangs off the side the cost falls on:
 * before the line and nothing has been spent, after it and the pass is already
 * paid for. A reader gets what declining costs from where the mark sits,
 * before reading a word of it — which is how an **approval** and a **verdict**
 * are told apart without a legend.
 *
 * **A gate that is not on the plan is dashed.** `requires_approval` lives on
 * the envelope and its threshold is computed at dispatch, so a strip that drew
 * it solid would be lying for one of two callers.
 */
export const Gated: Story = {
  render: () => (
    <div className="w-[860px]">
      <LayerStrip
        palette={LAYER_PALETTE}
        bands={BANDS}
        items={ITEMS}
        seams={SEAMS}
        scale="seq"
        domain={[1, 6]}
      />
    </div>
  ),
};
