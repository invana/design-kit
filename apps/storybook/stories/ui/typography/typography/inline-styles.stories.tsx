import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@invana/ui';

const meta: Meta<typeof Typography.H1> = {
  title: 'UI/Typography/Typography',
  component: Typography.H1,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components for consistent text styling across your application.',
      },
    },
  },
  // tags: ['autodocs'],
};


/**
 * Main page heading - largest and most prominent heading.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineStyles: Story = {
  render: () => (
    <div className="max-w-3xl space-y-6">
      <section className="space-y-3">
        <Typography.H3>Font Weight Variations</Typography.H3>
        <Typography.P>
          This paragraph contains <span className="font-light">light weight text</span>, {' '}
          <span className="font-normal">normal weight text</span>, {' '}
          <span className="font-medium">medium weight text</span>, {' '}
          <span className="font-semibold">semibold weight text</span>, and {' '}
          <span className="font-bold">bold weight text</span> for emphasis.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Font Style Variations</Typography.H3>
        <Typography.P>
          You can use <em className="italic">italic text</em> for emphasis, {' '}
          <span className="not-italic font-medium">non-italic emphasized text</span>, or {' '}
          <strong className="font-bold">strong bold text</strong> for important content.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Text Decoration</Typography.H3>
        <Typography.P>
          This paragraph shows <span className="underline">underlined text</span>, {' '}
          <span className="line-through">strikethrough text</span>, {' '}
          <span className="underline decoration-2">thick underline</span>, {' '}
          <span className="underline decoration-dotted">dotted underline</span>, and {' '}
          <span className="underline decoration-wavy">wavy underline</span>.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Text Transform</Typography.H3>
        <Typography.P>
          Text can be <span className="uppercase">transformed to uppercase</span>, {' '}
          <span className="lowercase">TRANSFORMED TO LOWERCASE</span>, {' '}
          <span className="capitalize">capitalized for each word</span>, or {' '}
          <span className="normal-case">KEpt IN noRMAL CasE</span>.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Text Color Utilities</Typography.H3>
        <Typography.P>
          Inline text can use <span className="text-primary">primary color</span>, {' '}
          <span className="text-secondary">secondary color</span>, {' '}
          <span className="text-muted-foreground">muted foreground</span>, {' '}
          <span className="text-destructive">destructive/error color</span>, or {' '}
          <span className="text-accent">accent color</span> for semantic meaning.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Background Highlights</Typography.H3>
        <Typography.P>
          You can highlight text with <span className="bg-primary/20 px-1 rounded">primary background</span>, {' '}
          <span className="bg-secondary px-1 rounded">secondary background</span>, {' '}
          <span className="bg-muted px-1 rounded">muted background</span>, or {' '}
          <span className="bg-accent/20 px-1 rounded">accent background</span> for emphasis.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Font Size Inline</Typography.H3>
        <Typography.P>
          Mix sizes within text: <span className="text-xs">extra small</span>, {' '}
          <span className="text-sm">small</span>, {' '}
          <span className="text-base">base</span>, {' '}
          <span className="text-lg">large</span>, and {' '}
          <span className="text-xl">extra large</span> text.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Letter Spacing</Typography.H3>
        <Typography.P>
          Adjust spacing with <span className="tracking-tighter">tighter tracking</span>, {' '}
          <span className="tracking-tight">tight tracking</span>, {' '}
          <span className="tracking-normal">normal tracking</span>, {' '}
          <span className="tracking-wide">wide tracking</span>, or {' '}
          <span className="tracking-wider">wider tracking</span>.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Combined Styles</Typography.H3>
        <Typography.P>
          Combine multiple styles: <span className="font-bold text-primary underline">bold primary underlined</span>, {' '}
          <span className="italic text-muted-foreground">italic muted</span>, {' '}
          <span className="font-semibold bg-accent/20 px-1 rounded">semibold highlighted</span>, or {' '}
          <span className="uppercase font-bold tracking-wide text-destructive">uppercase bold destructive</span>.
        </Typography.P>
      </section>

      <section className="space-y-3">
        <Typography.H3>Hover States</Typography.H3>
        <Typography.P>
          Interactive text with <span className="text-primary hover:text-primary/80 cursor-pointer underline">hover fade</span>, {' '}
          <span className="hover:bg-muted px-1 rounded transition-colors cursor-pointer">hover background</span>, or {' '}
          <span className="hover:underline cursor-pointer text-foreground">hover underline</span>.
        </Typography.P>
      </section>
    </div>
  ),
};
