import type { Meta, StoryObj } from '@storybook/react-vite';
import { EgressList } from '@invana/ui';

const meta: Meta<typeof EgressList> = {
  title: 'UI/UI Extended/EgressList',
  component: EgressList,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Per destination: what may be sent, and what was cut.
 *
 * **Egress is declared per destination, on the rule that matched it.** A
 * run-wide setting would have to be the strictest of its destinations, which is
 * the least useful one — so this is always about *one* address, and a surface
 * showing several renders several.
 *
 * **Reading a thing and sending it are different permissions.** A query may
 * filter on `Deal.revenue` while the value never enters a prompt — used to
 * **compute**, not to **reason**. That is the distinction this list makes
 * visible, and it is why `property_values` being *absent* is worth as much
 * screen as the classes that are present.
 *
 * **`cut` is what makes it evidence rather than configuration.** The first two
 * state a bound before a run; the third is what the bound actually withheld
 * during one. Without `cut`, a reader cannot tell a rule that did work from a
 * rule that never bit.
 *
 * An empty `classes` is drawn in words, because the lens default is `[]`: a
 * blank row would read as *not configured* rather than *nothing may leave*.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[480px] flex-col gap-4">
      <EgressList
        to="llm/anthropic-prod/claude-opus-5"
        classes={['type_names', 'property_names', 'the_question']}
      />
      <EgressList to="llm/ollama-local/llama-3.1-8b" classes={['everything']} />
      <EgressList
        to="llm/anthropic-prod/claude-opus-5"
        classes={['type_names', 'the_question']}
        cut={['property_values', 'record_ids']}
      />
      <EgressList to="third_party/api/clearbit.com" />
    </div>
  ),
};
