import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AgentHeader as Component, type AgentHeaderProps } from '@invana/ui';
import { Focus, Globe, ShieldCheck, Users } from 'lucide-react';

import VARIANTS_JSON from '../../../../fixtures/ui-extended/agent-header.json';
import { jsx, snippets, sourceFor, variantArg } from '../../../_story/source';
import { VariantGrid, type Variant } from '../../../_story/variant-grid';

interface HeaderVariant extends Variant {
  props: Omit<AgentHeaderProps, 'icons' | 'onRequestAccess' | 'onOpenSettings'>;
}

// JSON widens the literal unions; the shape is the component's own props.
const VARIANTS = VARIANTS_JSON as unknown as HeaderVariant[];
/** The kit ships no icons: the caller hands its own in. */
const ICONS = { world: <Globe />, group: <Users />, lens: <Focus />, governance: <ShieldCheck /> };

interface Args {
  variant: string;
  onRequestAccess: (models: string[]) => void;
  onOpenSettings: (section: 'data' | 'governance') => void;
}

const meta = {
  title: 'UI/UI Extended/AgentHeader',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        language: 'tsx',
        transform: sourceFor(VARIANTS, (picked) =>
          snippets(
            [
              "import { AgentHeader } from '@invana/ui';",
              "import { ChatSession } from '@invana/assistant';",
              "import { Focus, Globe, ShieldCheck, Users } from 'lucide-react';",
            ],
            picked.map((v) => ({
              comment: v.caption,
              data: { header: v.props },
              setup: [
                'const icons = { world: <Globe />, group: <Users />, lens: <Focus />, governance: <ShieldCheck /> };',
                "// Receives the denied models' ids.",
                'const onRequestAccess = (ids) => {};',
                '// Receives "data" or "governance" — open your settings there.',
                'const onOpenSettings = (section) => {};',
                '',
                '// As a ChatSession\'s header: <ChatSession spec={spec} header={<AgentHeader … />} />',
              ].join('\n'),
              call: jsx('AgentHeader', {
                '{...header}': undefined,
                icons: 'icons',
                onRequestAccess: 'onRequestAccess',
                onOpenSettings: 'onOpenSettings',
              }).replace('<AgentHeader', '<AgentHeader\n  {...header}'),
            })),
          ),
        ),
      },
    },
  },
  args: { variant: 'All', onRequestAccess: fn(), onOpenSettings: fn() },
  argTypes: { variant: variantArg(VARIANTS) },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * The header of an agent's session: the session, the agent and its status, then the data it
 * reaches (open it for every model, its records and access, denied ones too), its lens, the token
 * budget and the governance badge (open it for the rules and what may leave). Plain props — pass
 * it as a `ChatSession`'s `header`. Under 420px the second line keeps its marks and counts. Data:
 * `fixtures/ui-extended/agent-header.json`.
 */
export const AgentHeader: Story = {
  render: (args) => (
    <VariantGrid variants={VARIANTS} variant={args.variant}>
      {(v, log) => (
        <Component
          {...v.props}
          icons={ICONS}
          onRequestAccess={(ids) => {
            args.onRequestAccess(ids);
            log('onRequestAccess', ids);
          }}
          onOpenSettings={(section) => {
            args.onOpenSettings(section);
            log('onOpenSettings', section);
          }}
        />
      )}
    </VariantGrid>
  ),
  play: async ({ canvasElement, args, step }) => {
    const cell = within(within(canvasElement).getByRole('group', { name: 'Entire world · idle' }));
    await step('The data reach lists the denied models and asks for them', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^Data reach/ }));
      const pop = within(await within(document.body).findByRole('dialog'));
      await userEvent.click(pop.getByRole('button', { name: /Request access to 2 models/ }));
      await expect(args.onRequestAccess).toHaveBeenCalledWith(['hr', 'payroll']);
      await userEvent.keyboard('{Escape}');
    });
    await step('The governance badge opens the rules, and links to settings', async () => {
      await userEvent.click(cell.getByRole('button', { name: /^Governance/ }));
      const pop = within(await within(document.body).findByRole('dialog'));
      await userEvent.click(pop.getByRole('button', { name: /Edit in Settings/ }));
      await expect(args.onOpenSettings).toHaveBeenCalledWith('governance');
    });
  },
};
