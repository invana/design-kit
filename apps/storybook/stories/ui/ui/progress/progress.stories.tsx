import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Eyebrow, PanelBox, Progress as ProgressBar, TypographyMuted } from '@invana/ui';

import data from '../../../../fixtures/ui/progress.json';
import { ReplayFrame, useReplay } from '../../../_story/replay';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ProgressVariant extends Variant {
  label: string;
  /** A live cell: the values an upload reports, one per frame. */
  feed?: number[];
  /** A still cell: the value it shows. */
  value?: number;
  figure?: string;
  note?: string;
}

const VARIANTS = data as ProgressVariant[];

interface Args {
  variant: string;
}

const meta = {
  title: 'UI/UI/Progress',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Eyebrow, PanelBox, Progress, TypographyMuted } from '@invana/ui';"],
            picked.map((v) =>
              v.feed
                ? {
                    comment: v.caption,
                    setup: [
                      '// `value` is whatever the upload last reported, 0–100. The bar redraws from props.',
                      'const [value, setValue] = React.useState(0);',
                      'React.useEffect(() => upload.onProgress(setValue), []);',
                    ].join('\n'),
                    call: [
                      `<Eyebrow aside={\`\${value}%\`}>${v.label}</Eyebrow>`,
                      jsx('Progress', { value: 'value' }),
                    ].join('\n'),
                  }
                : {
                    comment: v.caption,
                    call: [
                      `<PanelBox title="${v.label}" aside="${v.figure}">`,
                      `  <Progress size="sm" value={${v.value}} />`,
                      `  <TypographyMuted>${v.note}</TypographyMuted>`,
                      '</PanelBox>',
                      `<Progress value={${v.value}} />`,
                    ].join('\n'),
                  },
            ),
          ),
        ),
      },
    },
  },
  args: { variant: 'All' },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Plays the variant's feed into the bar, one reported value per frame. */
function LiveProgress({ v }: { v: ProgressVariant }) {
  const feed = v.feed ?? [];
  const replay = useReplay(feed.length, { every: 600 });
  const value = replay.at ? feed[replay.at - 1] : 0;
  return (
    <ReplayFrame replay={replay} noun="update" width={v.width ?? 320}>
      <Eyebrow aside={`${value}%`}>{v.label}</Eyebrow>
      <ProgressBar value={value} aria-label={v.label} />
    </ReplayFrame>
  );
}

/**
 * A bar filled to a value, from `fixtures/ui/progress.json`. Default is live — an upload's
 * reported values replayed into `value`; Meter is the 4px `sm` size, which reads as part of
 * the number above it rather than as something you drag.
 */
export const Progress: Story = {
  render: ({ variant }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v) =>
        v.feed ? (
          <LiveProgress v={v} />
        ) : (
          <>
            <PanelBox title={v.label} aside={v.figure}>
              <ProgressBar size="sm" value={v.value} aria-label={v.label} />
              <TypographyMuted>{v.note}</TypographyMuted>
            </PanelBox>
            <ProgressBar value={v.value} aria-label={`${v.label}, default size`} />
          </>
        )
      }
    </VariantGrid>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const live = within(canvas.getByRole('group', { name: 'Default' }));
    // The kit's Progress does not forward `value` to Radix, so the bar carries no
    // aria-valuenow — the play reads the figure the story prints beside it instead.
    await step('The upload reports progress', async () => {
      await waitFor(() => expect(live.getByText('13%')).toBeInTheDocument(), { timeout: 3000 });
    });
    await step('Skip to the end: the bar is full', async () => {
      await userEvent.click(live.getByRole('button', { name: 'Skip to end' }));
      await expect(live.getByText('100%')).toBeInTheDocument();
      await expect(live.getByRole('status')).toHaveTextContent('7 / 7 updates');
    });
    await step('The meter draws both sizes', async () => {
      const meter = within(canvas.getByRole('group', { name: 'Meter' }));
      await expect(meter.getAllByRole('progressbar')).toHaveLength(2);
      await expect(meter.getByText('38.4k')).toBeInTheDocument();
    });
  },
};
