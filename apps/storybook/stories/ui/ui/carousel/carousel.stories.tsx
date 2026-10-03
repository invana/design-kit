import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Card,
  CardContent,
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  MetricTile,
  type CarouselApi,
} from '@invana/ui';

import data from '../../../../fixtures/ui/carousel.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Log, type Variant } from '../../../_story/variant-grid';

interface CarouselVariant extends Variant {
  align: 'start' | 'center' | 'end';
  slides: { label: string; value: string }[];
}

const VARIANTS = data as CarouselVariant[];

interface Args {
  variant: string;
  onSelect: (index: number) => void;
}

const meta = {
  title: 'UI/UI/Carousel',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { Card, CardContent, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, MetricTile } from '@invana/ui';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { slides: v.slides },
              setup: [
                '// The carousel reports through its Embla api: "select" fires with the slide now in view.',
                'const setApi = React.useCallback((api) => api?.on("select", () => onSelect(api.selectedScrollSnap())), []);',
              ].join('\n'),
              call: [
                `<Carousel opts={${json({ align: v.align })}} setApi={setApi}>`,
                '  <CarouselContent>',
                '    {slides.map((s) => (',
                '      <CarouselItem key={s.value}>',
                '        <Card><CardContent><MetricTile variant="hero" label={s.label} value={s.value} /></CardContent></Card>',
                '      </CarouselItem>',
                '    ))}',
                '  </CarouselContent>',
                '  <CarouselPrevious />',
                '  <CarouselNext />',
                '</Carousel>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onSelect: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/** Subscribes once to the carousel's api and reports each slide brought into view. */
function Live({ v, onSelect, log }: { v: CarouselVariant; onSelect: Args['onSelect']; log: Log }) {
  const setApi = React.useCallback(
    (api: CarouselApi) =>
      api?.on('select', () => {
        onSelect(api.selectedScrollSnap());
        log('onSelect', api.selectedScrollSnap());
      }),
    [onSelect, log],
  );
  return (
    <CarouselRoot opts={{ align: v.align }} setApi={setApi}>
      <CarouselContent>
        {v.slides.map((s) => (
          <CarouselItem key={s.value}>
            <Card>
              <CardContent>
                <MetricTile variant="hero" label={s.label} value={s.value} />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </CarouselRoot>
  );
}

/**
 * Slides moved one at a time with previous and next, from `fixtures/ui/carousel.json`. The
 * carousel reports through its Embla api: on `select` the story sends the slide now in view.
 */
export const Carousel: Story = {
  render: ({ variant, onSelect }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => <Live v={v} onSelect={onSelect} log={log} />}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const v = VARIANTS[0];
    const cell = within(within(canvasElement).getByRole('group', { name: v.caption }));
    const slides = cell.getAllByRole('group').filter((g) => g.getAttribute('aria-roledescription') === 'slide');
    await expect(slides).toHaveLength(v.slides.length);
    const next = cell.getByRole('button', { name: 'Next slide' });
    await step('Move to the next slide', async () => {
      await userEvent.click(next);
      await waitFor(() => expect(args.onSelect).toHaveBeenCalledWith(1));
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent('onSelect');
    });
  },
};
