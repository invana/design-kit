import type { Meta, StoryObj } from '@storybook/react-vite';
import { MatchPreview, type MatchCandidate } from '@invana/ui';

const meta: Meta<typeof MatchPreview> = {
  title: 'UI/UI Extended/MatchPreview',
  component: MatchPreview,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const CATALOGUE = [
  'graph_data/model/AirRoutes@1.0.1',
  'graph_data/model/Deals@1.0.0',
  'graph_data/model/NewsArticles@1.0.1',
  'graph_data/model/Twitter@1.0.1',
  'graph_data/stitch/tweet_article@about',
  'graph_data/stitch/tweet_article@links_to',
];

const against = (pattern: RegExp): MatchCandidate[] =>
  CATALOGUE.map((address) => ({ address, matched: pattern.test(address) }));

/**
 * What an address pattern matches **right now**, resolved against the live
 * catalogue as the pattern is typed.
 *
 * **Narrowing is picking, not writing.** Every control in the rule builder
 * offers what the catalogue holds, so nothing can name something that is not
 * there — and this is the surface that makes that true for the one control
 * which *is* free text.
 *
 * **The near-misses are greyed, not filtered out.** A preview listing only hits
 * cannot distinguish *this pattern is precise* from *this pattern is wrong* —
 * both render as a short list. The second block is the mistake that matters:
 * `Deals@1.0.0` matches today and silently stops applying the next time
 * somebody publishes, and seeing the four models it passed over is what tells
 * the author to write `Deals@*` instead.
 *
 * **Nothing matched is its own state**, and distinct from a layer with nothing
 * in it: one means the pattern is wrong, the other means the Graph has nothing
 * of that kind configured yet.
 */
export const Default: Story = {
  render: () => (
    <div className="flex w-[460px] flex-col gap-4">
      <MatchPreview
        pattern="graph_data/model/*"
        matches={against(/^graph_data\/model\//)}
      />
      <MatchPreview
        pattern="graph_data/model/Deals@1.0.0"
        matches={against(/^graph_data\/model\/Deals@1\.0\.0$/)}
      />
      <MatchPreview
        pattern="graph_data/model/Deal"
        matches={against(/^$/)}
      />
      <MatchPreview pattern="third_party/**" matches={[]} />
      <MatchPreview pattern="graph_data/**" loading />
    </div>
  ),
};
