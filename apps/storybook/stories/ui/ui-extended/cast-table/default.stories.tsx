import type { Meta, StoryObj } from '@storybook/react-vite';
import { CastTable, type CastResolution } from '@invana/ui';

const meta: Meta<typeof CastTable> = {
  title: 'UI/UI Extended/CastTable',
  component: CastTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RESOLVED: CastResolution[] = [
  {
    role: 'extract',
    address: 'llm/ollama-local/llama-3.1-8b',
    allowed: true,
    source: 'agent',
  },
  {
    role: 'decide',
    address: 'llm/anthropic-prod/claude-opus-5',
    allowed: false,
    ruleMatched: 'llm/ollama-local/*',
    source: 'plan',
  },
  { role: 'judge', address: null, allowed: true, source: 'shipped' },
  {
    role: 'embed',
    address: 'llm/ollama-local/nomic-embed',
    allowed: true,
    source: 'shipped',
  },
];

/**
 * `role → resolves to → why this one`, four fixed rows.
 *
 * A plan names a **role**, not a model: `decide` says *how much this matters*,
 * which stays true when the line-up moves, in a way `tier` and a hard-coded
 * model id do not.
 *
 * **All four rows, always — including the ones nothing casts.** A table showing
 * only what was set would make *nothing casts `judge`* invisible, and that is
 * precisely the state worth seeing before a run opens: it falls to a shipped
 * default, which may name a model this Graph is not credentialed for.
 *
 * **The cast is not a bound.** It picks *within* the rules and never widens
 * them: innermost wins, then the resolved address is checked against the
 * effective rules and refused by name if denied. The `decide` row below is that
 * refusal — under `Nothing leaves`, only a local model may be reached, so a
 * plan asking for a hosted one is refused **before the run opens**, naming the
 * rule. It names the rule rather than just going red because the recourse is to
 * edit that rule, and the reader has to know which.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[620px] flex-col gap-6">
      <div>
        <p className="pb-1 text-sm text-muted-foreground">
          what the lens says
        </p>
        <CastTable
          cast={{
            decide: 'llm/anthropic-prod/claude-opus-5',
            extract: 'llm/ollama-local/llama-3.1-8b',
          }}
          readOnly
        />
      </div>
      <div>
        <p className="pb-1 text-sm text-muted-foreground">
          resolved under `Nothing leaves` — one refusal, naming its bound
        </p>
        <CastTable resolved={RESOLVED} readOnly />
      </div>
    </div>
  ),
};
