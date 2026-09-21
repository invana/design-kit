import { Link, TypographyP } from "@invana/ui"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "UI/UI/Link",
  component: Link,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The three variants, each in the sentence it belongs to — a link takes the
 * size of the text around it, so there is nothing to show it at except inside
 * one.
 */
export const Default: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-4">
      <TypographyP>
        A run is grounded in the graph it was asked against. Read{" "}
        <Link href="#">how grounding works</Link> before changing a world.
      </TypographyP>

      <TypographyP>
        By continuing you accept the{" "}
        <Link href="#" variant="underlined">
          terms of service
        </Link>
        .
      </TypographyP>

      <TypographyP>
        <Link href="#" variant="quiet">
          Privacy
        </Link>{" "}
        <Link href="#" variant="quiet">
          Terms
        </Link>
      </TypographyP>

      <TypographyP>
        The catalogue ships with the engine —{" "}
        <Link href="https://invana.io" external>
          invana.io
        </Link>{" "}
        opens in a new tab.
      </TypographyP>
    </div>
  ),
}
