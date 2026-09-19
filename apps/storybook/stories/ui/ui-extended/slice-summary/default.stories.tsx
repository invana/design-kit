import type { Meta, StoryObj } from '@storybook/react-vite';
import { SliceSummary } from '@invana/ui';

const meta: Meta<typeof SliceSummary> = {
  title: 'UI/UI Extended/SliceSummary',
  component: SliceSummary,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What a rule narrows to, stated so the axis is never in doubt.
 *
 * **The axis is always named** — `time 2026-01-01 → 2026-06-30 · axis
 * signed_at`, never just the dates. Two models in one Graph declare different
 * time properties, and *which rows did this run see* must not depend on the
 * reader guessing which one was used. That single rule is why a slice is a
 * component rather than a template string at each call site.
 *
 * **An undeclared axis is shown, not hidden.** The last block is `AirRoutes`
 * sliced by time — a model that declares geography and dimensions but
 * deliberately no valid time. The lens would be refused at save naming the
 * model and the axis, so the form has to render the illegal state on the way to
 * being told about it. Dropping the line silently would make the refusal arrive
 * from nowhere.
 *
 * `variant="line"` is what a `RuleRow` renders — the same description, from the
 * same function, so the two never drift into two accounts of one slice.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[560px] flex-col gap-5">
      <div>
        <p className="pb-1 text-meta text-muted-foreground">line — under a rule</p>
        <SliceSummary
          select={{
            time: { axis: 'signed_at', from: '2026-01-01', to: '2026-06-30' },
            geo: {
              axis: 'country_iso',
              vocab: 'iso2',
              in: ['DE', 'FR', 'NL', 'ES', 'CH'],
            },
            dims: { channel: ['direct', 'agency'] },
          }}
          declaredAxes={{
            time: { property: 'signed_at' },
            geo: { property: 'country_iso', vocab: 'iso2' },
            dims: ['channel', 'segment', 'stage'],
          }}
        />
      </div>

      <div>
        <p className="pb-1 text-meta text-muted-foreground">block — W3 and R2</p>
        <SliceSummary
          variant="block"
          select={{
            time: { axis: 'published_at', from: '2026-01-01', to: '2026-06-30' },
          }}
          declaredAxes={{ time: { property: 'published_at' } }}
        />
      </div>

      <div>
        <p className="pb-1 text-meta text-muted-foreground">
          the refusal — an axis the model never declared
        </p>
        <SliceSummary
          variant="block"
          modelLabel="AirRoutes@1.0.1"
          select={{
            time: { axis: 'started_at', from: '2026-01-01', to: '2026-06-30' },
          }}
          declaredAxes={{
            geo: { property: 'country', vocab: 'iso2' },
            dims: ['type', 'region'],
          }}
        />
      </div>

      <div>
        <p className="pb-1 text-meta text-muted-foreground">not sliced</p>
        <SliceSummary />
      </div>
    </div>
  ),
};
