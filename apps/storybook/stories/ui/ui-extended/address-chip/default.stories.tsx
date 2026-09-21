import type { Meta, StoryObj } from '@storybook/react-vite';
import { AddressChip, type AddressTone } from '@invana/ui';

const meta: Meta<typeof AddressChip> = {
  title: 'UI/UI Extended/AddressChip',
  component: AddressChip,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const TONES: { tone: AddressTone; address: string; note: string }[] = [
  {
    tone: 'allowed',
    address: 'graph_data/model/Deals@1.0.0',
    note: 'in view, and the run read it',
  },
  {
    tone: 'denied',
    address: 'third_party/**',
    note: 'what the bound says, read at rest',
  },
  {
    tone: 'refused',
    address: 'graph_data/stitch/tweet_article@about',
    note: 'the run reached for it and was refused',
  },
  {
    tone: 'untouched',
    address: 'cache/prefix/*',
    note: 'allowed, and nothing went near it',
  },
];

/**
 * The address is the only identifier there is — the lens matches on it, the
 * ledger records it, the run drawing expands it — so it has to survive a narrow
 * column without becoming three copies of the same string.
 *
 * **It truncates in the middle, not the end.** The last segment is *which
 * thing* and the ones before it are *which kind*, and the kind is usually
 * already carried by the `LayerChip` beside it — so the kind is what gives way.
 * The narrow column below is the point: a plain `truncate` renders every model
 * in a Graph as `graph_data/model/…`, which is one row repeated.
 *
 * The narrow box is the stress test. The head gives way first and never
 * collapses past `g…` — a bare `g` with no ellipsis would read as a word that
 * was never in the address. Below about 26 characters even the participant has
 * to clip: there is nothing left to give, and spilling over the column is not
 * an option.
 *
 * **`denied` and `refused` are two facts.** Denied is what the rule says;
 * refused is what happened when a run reached for it. Collapsing them loses
 * *the bound was there and nothing ever tested it*, so only the event is
 * struck through.
 */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex w-[420px] flex-col gap-2">
        {TONES.map(({ tone, address, note }) => (
          <div key={tone} className="flex items-baseline gap-3">
            <AddressChip address={address} tone={tone} className="w-[240px]" />
            <span className="text-sm text-muted-foreground">{note}</span>
          </div>
        ))}
      </div>

      <div className="flex w-[200px] flex-col gap-1 rounded-control border border-border p-2">
        <span className="text-sm text-muted-foreground">
          200px — the kind gives way first
        </span>
        <AddressChip address="graph_data/model/NewsArticles@1.0.1" />
        <AddressChip address="graph_data/stitch/route_airport@departs_from" />
        <AddressChip address="llm/claude_agent_sdk/claude-opus-5" />
      </div>
    </div>
  ),
};
