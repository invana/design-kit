import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button, CheckResult as Component } from '@invana/ui';

import DATA from '../../../../fixtures/ui-extended/check-result.json';
import { json, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface ResultVariant extends Variant {
  status: 'checking' | 'ok' | 'failed';
  title?: string;
  details?: string[];
  error?: string;
  action?: string;
}

const VARIANTS = DATA as unknown as ResultVariant[];

interface Args {
  variant: string;
  onAction: () => void;
}

const source = (v: ResultVariant) =>
  [
    '<CheckResult',
    `  status="${v.status}"`,
    v.title ? `  title=${json(v.title)}` : '',
    v.details ? `  // formatted by the caller\n  details={${json(v.details)}}` : '',
    v.error ? `  error=${json(v.error)}` : '',
    v.action ? `  action={<Button size="sm" variant="outline" onClick={check}>${v.action}</Button>}` : '',
    '/>',
  ]
    .filter(Boolean)
    .join('\n');

const meta = {
  title: 'UI/UI Extended/CheckResult',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            ["import { Button, CheckResult } from '@invana/ui';"],
            picked.map((v) => ({ comment: v.caption, call: source(v) })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onAction: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The outcome of a check, from `fixtures/ui-extended/check-result.json`: still out, answered with
 * its version and latency, or failed with the reason and a retry. It is a polite live region, so
 * a screen reader hears the result when it arrives.
 */
export const CheckResult: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Component
          status={v.status}
          title={v.title}
          details={v.details}
          error={v.error}
          action={
            v.action ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  args.onAction();
                  log('onAction', v.action);
                }}
              >
                {v.action}
              </Button>
            ) : undefined
          }
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args }) => {
    const failed = within(within(canvasElement).getByRole('group', { name: 'Failed' }));
    await expect(failed.getByRole('status')).toHaveTextContent('Could not connect');
    await userEvent.click(failed.getByRole('button', { name: 'Check again' }));
    await expect(args.onAction).toHaveBeenCalled();
  },
};
