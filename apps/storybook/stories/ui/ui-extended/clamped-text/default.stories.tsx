import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClampedText } from "@invana/ui";

const meta: Meta<typeof ClampedText> = {
  title: "UI/UI Extended/ClampedText",
  component: ClampedText,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Prose that shows its first few lines and offers the rest in place.
 *
 * The toggle is measured, not guessed: the short paragraph below gets no
 * `Show more`, because there is nothing behind it. That is the whole point —
 * a control that reveals nothing teaches the reader to stop pressing it.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[360px] flex-col gap-6">
      <section className="flex flex-col gap-1">
        <div className="text-meta text-muted-foreground">Purpose</div>
        <ClampedText>
          Map the exposure of the refinery supply chain, end to end: which
          terminals feed which depots, which carriers move between them, and
          which of those links have a single point of failure. The graph is the
          record every agent on this project plans from, so it has to hold the
          contracts as well as the geography — a route that exists on paper and
          not in a contract is not a route.
        </ClampedText>
      </section>

      <section className="flex flex-col gap-1">
        <div className="text-meta text-muted-foreground">Purpose</div>
        <ClampedText>Weekly intraday scan.</ClampedText>
      </section>
    </div>
  ),
};
