import type { StoryObj } from '@storybook/react-vite';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@invana/ui';

const meta = {
  title: 'Themes/Theme Presets',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Static theme presets (Dark Gold/Ocean/Forest/Rose, Light Minimal). Pick a preset ' +
          'in the toolbar **Theme** menu and an accent swatch in the **Variant** menu — just ' +
          'like the Invana/Tailwind/Vite themes. Colours are plain CSS in ' +
          '`@invana/styling/themes/presets.css`.',
      },
    },
  },
};

export default meta;

function Showcase() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl">Theme presets showcase</h1>
        <p className="mt-1 text-muted-foreground">
          Switch theme + accent from the toolbar above. Headings are tinted toward each theme's
          signature accent; the brand colour tracks the selected accent.
        </p>
      </div>

      {/* Preset design tokens, available as Tailwind utilities */}
      <div className="rounded-lg border p-4">
        <p className="font-heading mb-3 text-base">Preset design tokens</p>
        <div className="space-y-1">
          <p className="text-text-primary">text-text-primary — headings &amp; emphasis</p>
          <p className="text-text-secondary">text-text-secondary — default body copy</p>
          <p className="text-text-muted">text-text-muted — captions &amp; hints</p>
          <p className="text-accent-bright">text-accent-bright — bright brand accent</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="rounded-md bg-surface px-3 py-2 text-text-secondary">bg-surface</div>
          <div className="rounded-md bg-elevated px-3 py-2 text-text-secondary">bg-elevated</div>
          <div className="rounded-md bg-panel px-3 py-2 text-text-secondary">bg-panel</div>
          <div className="glass rounded-md px-3 py-2 text-text-secondary">.glass</div>
        </div>
        <p className="mt-4 text-text-secondary">
          Press <span className="kbd">⌘</span> <span className="kbd">K</span> to search.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Card title</CardTitle>
            <CardDescription>
              Cards use the elevated surface and react to the accent colour.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The primary accent drives buttons, focus rings and links across the kit.
          </CardContent>
          <CardFooter className="gap-2">
            <Button size="sm">Confirm</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-muted-foreground">
                Tabs, borders and inputs all derive their colour from the active preset.
              </TabsContent>
              <TabsContent value="activity" className="pt-3 text-muted-foreground">
                Compare Dark Gold, Ocean, Forest, Rose and Light Minimal from the toolbar.
              </TabsContent>
              <TabsContent value="settings" className="pt-3 text-muted-foreground">
                Each preset carries its own palette of accent swatches (the Variant menu).
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const ThemePresets: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-5xl">
        <Showcase />
      </div>
    </div>
  ),
};
