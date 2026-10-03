import type { ErrorInfo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { EmptyState, ErrorBoundary as Component } from '@invana/ui';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/error-boundary.json';
import { snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface BoundaryVariant extends Variant {
  /** What the broken child throws. */
  error: string;
  /** Wire `onError`, where an app reports what broke. */
  report?: boolean;
  /** The region's own words in place of the default notice. */
  fallback?: { title: string; description: string };
}

const VARIANTS = VARIANTS_JSON as BoundaryVariant[];

/** A child that throws on render — the region that broke. */
function Broken({ error }: { error: string }): never {
  throw new Error(error);
}

interface Args {
  variant: string;
  onError: (error: Error, info: ErrorInfo) => void;
}

const meta = {
  title: 'UI/UI Extended/ErrorBoundary',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { EmptyState, ErrorBoundary } from '@invana/ui';"],
            picked.map((v) => ({
              comment: v.caption,
              setup: v.report
                ? '// Receives the error and React\'s component stack, once per error caught.\nconst onError = (error, info) => report(error);'
                : undefined,
              call: [
                v.report || v.fallback
                  ? [
                      '<ErrorBoundary',
                      v.report ? '  onError={onError}' : '',
                      v.fallback
                        ? `  fallback={<EmptyState title="${v.fallback.title}" description="${v.fallback.description}" />}`
                        : '',
                      '>',
                    ]
                      .filter(Boolean)
                      .join('\n')
                  : '<ErrorBoundary>',
                '  <Region />',
                '</ErrorBoundary>',
              ].join('\n'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onError: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Catches a render error in its children and shows a fallback in their place, so one broken
 * region does not blank the whole screen. Each cell wraps a child that throws on render.
 * `onError` hears each caught error — where an app reports it — and `fallback` replaces the
 * default notice with the region's own words.
 */
export const ErrorBoundary: Story = {
  render: ({ variant, onError }) => (
    <VariantGrid variants={VARIANTS} variant={variant}>
      {(v, log) => (
        <Component
          onError={
            v.report
              ? (error, info) => {
                  onError(error, info);
                  log('onError', error.message);
                }
              : undefined
          }
          fallback={v.fallback ? <EmptyState {...v.fallback} /> : undefined}
        >
          <Broken error={v.error} />
        </Component>
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    await step('The default notice replaces the region', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Default notice' }));
      await expect(cell.getByText(/something went wrong/)).toBeInTheDocument();
    });
    await step('The reporting boundary hands the error on', async () => {
      const cell = within(canvas.getByRole('group', { name: 'Reporting' }));
      await expect(cell.getByText('This panel failed to load')).toBeInTheDocument();
      await waitFor(() => expect(args.onError).toHaveBeenCalled());
      await expect(cell.getByRole('list', { name: 'Events' })).toHaveTextContent(VARIANTS[1]!.error);
    });
  },
};
