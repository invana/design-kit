import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@invana/ui";

const meta: Meta<typeof Button> = {
  title: "UI/UI/Button",
  component: Button,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "soft",
  "destructive",
] as const;

function ButtonRow() {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((v) => (
        <Button key={v} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  );
}

/**
 * Glass is a *mode*, not a variant: the same buttons render opaque normally and
 * translucent + blurred under any `data-glass="true"` ancestor. The colorful
 * canvas behind the panels is what the backdrop blur acts on — on a flat
 * background the blur is invisible (and that's fine).
 */
export const Glass: Story = {
  render: () => (
    <div className="relative min-h-screen overflow-hidden p-10">
      {/* Mock graph canvas — gives the backdrop-blur something to chew on */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 20%, #34d399 0%, transparent 60%)," +
            "radial-gradient(50% 50% at 80% 30%, #60a5fa 0%, transparent 55%)," +
            "radial-gradient(55% 55% at 60% 85%, #f472b6 0%, transparent 60%)," +
            "radial-gradient(45% 45% at 15% 80%, #fbbf24 0%, transparent 55%)",
        }}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Normal (opaque) */}
        <div className="rounded-xl border border-border bg-card/80 p-6">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Normal — <code>data-glass</code> off (opaque)
          </p>
          <ButtonRow />
        </div>

        {/* Glass — flip one attribute, every descendant button adapts */}
        <div
          data-glass="true"
          className="rounded-xl border border-white/15 p-6"
        >
          <p className="mb-4 text-sm font-medium text-white/80 [text-shadow:0_1px_2px_rgb(0_0_0/0.4)]">
            Glass — <code>data-glass=&quot;true&quot;</code> (translucent +
            blur)
          </p>
          <ButtonRow />
        </div>
      </div>

      {/* Single-element scope: glass on just one button */}
      <div className="mt-8 rounded-xl border border-border bg-card/80 p-6">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Per-element scope — <code>data-glass</code> on a single button
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">opaque</Button>
          <Button variant="default" data-glass="true">
            glass
          </Button>
        </div>
      </div>
    </div>
  ),
};
