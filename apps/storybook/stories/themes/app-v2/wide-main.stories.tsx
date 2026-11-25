import { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppLayoutV2 } from "@invana/themes/app-v2/layout";
import { Files, Search } from "lucide-react";

const meta: Meta<typeof AppLayoutV2> = {
  title: "Themes/AppV2/Wide Main",
  component: AppLayoutV2,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof meta>;

const COLUMNS = Array.from({ length: 14 }, (_, i) => `Column ${i + 1}`);

/**
 * A page wider than the screen — a table of fourteen columns — beside an open
 * right section. Main does not grow past what is left: the table scrolls
 * inside it, and the right section stays on screen.
 */
export const WideMain: Story = {
  render: () => (
    <div className="h-screen">
      <AppLayoutV2
        header={{
          className: "!h-[35px]",
          left: <div className="pl-2 font-bold text-lg">Invana Studio</div>,
        }}
        leftNav={{
          topNavItems: [
            { name: "Explorer", icon: Files, tooltip: "Explorer" },
            { name: "Search", icon: Search, tooltip: "Search" },
          ],
        }}
        mainSection={{
          content: (
            <div className="p-4">
              <table className="border-collapse text-sm" style={{ minWidth: 2000 }}>
                <thead>
                  <tr>
                    {COLUMNS.map((c) => (
                      <th key={c} className="border-b px-2 py-1 text-left">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {COLUMNS.map((c) => (
                      <td key={c} className="border-b px-2 py-1">
                        a value
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        }}
        rightSection={{
          defaultSize: "320px",
          content: (
            <section aria-label="Right section" className="h-full p-4">
              The assistant, say
            </section>
          ),
        }}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("The right section stays on screen beside a page wider than it", async () => {
      const right = within(canvasElement).getByRole("region", { name: "Right section" });
      const box = right.getBoundingClientRect();
      await expect(box.right).toBeLessThanOrEqual(window.innerWidth + 1);
      await expect(box.width).toBeGreaterThan(200);
    });
  },
};
