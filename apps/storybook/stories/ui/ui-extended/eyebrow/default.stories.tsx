import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow } from '@invana/ui';

const meta: Meta<typeof Eyebrow> = {
  title: 'UI/UI Extended/Eyebrow',
  component: Eyebrow,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The smallest heading in the system — a label over the thing it names, at a
 * weight that stays subordinate to the panel's own title.
 *
 * Three tones and an `aside`: muted for a label being scanned past, foreground
 * when it titles a card with no other heading, accent when it names something
 * the reader is being taught. The `aside` keeps a count or a position on the
 * right without the call site building its own row.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-6">
      <section className="flex flex-col gap-1.5">
        <Eyebrow aside="2 of 4">1 · Connected</Eyebrow>
        <p className="text-muted-foreground">
          Explorer, Query, introspection and model authoring.
        </p>
      </section>

      <section className="flex flex-col gap-1.5">
        <Eyebrow tone="foreground">Why it matters</Eyebrow>
        <p>
          Until records exist, the model is a shape with nothing in it.
        </p>
      </section>

      <section className="flex flex-col gap-1.5">
        <Eyebrow tone="accent">Answers are grounded</Eyebrow>
        <p>Every answer traces back to the record it came from.</p>
      </section>
    </div>
  ),
};
