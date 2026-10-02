import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, userEvent, within } from 'storybook/test';
import GUI from 'lil-gui';
import {
  AddressChip,
  AgentChip,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  ButtonGroup,
  CardWithHeader,
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FilterChip,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Kbd,
  KindChip,
  LensChip,
  MarkChip,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  PanelBox,
  PanelContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SearchInput,
  SegmentedControl,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@invana/ui';
import {
  Checkbox,
  ColorSwatches,
  IconInput,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@invana/forms';
import { BLOCKS, BLOCK_RENDERERS, SuggestionChips, type BlockKind, type BlockProps } from '@invana/blocks';
import { Settings2 } from 'lucide-react';

import data from '../../../fixtures/others/corner-radius.json';
import { BLOCK_VARIANTS } from '../../../fixtures/blocks';
import { LiveBlock } from '../../_story/live-block';
import { variantArg, ALL } from '../../_story/source';
import { VariantBoard, type Log, type Variant } from '../../_story/variant-board';

type Part =
  | 'buttons'
  | 'icon-button'
  | 'button-group'
  | 'toggle'
  | 'toggle-group'
  | 'segmented'
  | 'tabs'
  | 'kbd'
  | 'input'
  | 'search'
  | 'input-group'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'icon-input'
  | 'swatches'
  | 'badges'
  | 'filter-chip'
  | 'address-chip'
  | 'agent-chip'
  | 'kind-chip'
  | 'lens-chip'
  | 'mark-chip'
  | 'suggestions'
  | 'card'
  | 'panel'
  | 'panel-content'
  | 'popover'
  | 'hover-card'
  | 'tooltip'
  | 'menu'
  | 'menubar'
  | 'navigation'
  | 'dialog'
  | 'alert-dialog'
  | 'command'
  | 'table'
  | 'nested';

interface Row extends Variant {
  parts?: Part[];
  /** A block row: its first variant, framed by a `PanelBox` as a dashboard frames it. */
  block?: BlockKind;
}

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';

const {
  options,
  buttons,
  select,
  swatches,
  chips,
  card,
  panel,
  panelContent,
  popover,
  hoverCard,
  tooltip,
  menu,
  menubar,
  command,
  navigation,
  dialog,
  alertDialog,
  table,
} = data;

/** Every block with a renderer and a fixture, in the spec's order. */
const BLOCK_ROWS: Row[] = BLOCKS.filter((b) => BLOCK_RENDERERS[b.id] && b.id in BLOCK_VARIANTS).map((b) => ({
  caption: `Block · ${b.name}`,
  block: b.id,
}));

const VARIANTS: Row[] = [...(data.rows as Row[]), ...BLOCK_ROWS];

interface Args {
  variant: string;
  /** `--radius`, px: tables, rows, boxes inside a card. */
  radius: number;
  /** `--radius-surface`, px: cards, panels, dialogs, popovers, menus. */
  surface: number;
  /** `--radius-control`, px: buttons, badges, inputs, tabs, toggles, chips. */
  control: number;
  onClick: (control: string) => void;
  onValueChange: (value: unknown) => void;
  onSelect: (item: string) => void;
  onAction: (action: string, value?: unknown) => void;
}

type Dials = Pick<Args, 'radius' | 'surface' | 'control'>;

/**
 * The three dials, set on `:root` exactly as a consumer's stylesheet would. On the root and
 * not on a wrapper, so what portals out — a dialog, a popover, a menu — reads them too.
 */
function useDials({ radius, surface, control }: Dials) {
  React.useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--radius', `${radius}px`);
    root.setProperty('--radius-surface', `${surface}px`);
    root.setProperty('--radius-control', `${control}px`);
    return () => {
      root.removeProperty('--radius');
      root.removeProperty('--radius-surface');
      root.removeProperty('--radius-control');
    };
  }, [radius, surface, control]);
}

/**
 * Story chrome: a lil-gui panel over the board. Drag a dial and every corner below redraws.
 * It writes the story's args, so the Controls panel and the Code tab follow it — and the
 * other way round.
 */
function DialPanel({ dials, update }: { dials: Dials; update: (next: Partial<Dials>) => void }) {
  const host = React.useRef<HTMLDivElement>(null);
  const gui = React.useRef<GUI | null>(null);
  const model = React.useRef<Dials>({ ...dials });
  const send = React.useRef(update);
  send.current = update;

  React.useEffect(() => {
    const g = new GUI({ container: host.current!, title: 'Corner radius', width: 280 });
    g.add(model.current, 'radius', 0, 16, 1).name('--radius').onChange((v: number) => send.current({ radius: v }));
    g.add(model.current, 'surface', 0, 16, 1).name('--radius-surface').onChange((v: number) => send.current({ surface: v }));
    g.add(model.current, 'control', 0, 16, 1).name('--radius-control').onChange((v: number) => send.current({ control: v }));
    g.add({ reset: () => send.current({ ...data.dials }) }, 'reset').name('Reset to defaults');
    gui.current = g;
    return () => {
      g.destroy();
      gui.current = null;
    };
  }, []);

  // Args changed elsewhere (the Controls panel, Reset): move the sliders to match.
  React.useEffect(() => {
    Object.assign(model.current, dials);
    gui.current?.controllersRecursive().forEach((c) => c.updateDisplay());
  }, [dials.radius, dials.surface, dials.control]);

  return <div ref={host} data-testid="dial-panel" style={{ position: 'sticky', top: 0, zIndex: 20, width: 280 }} />;
}

function RunTable() {
  return (
    <Table aria-label="Runs">
      <TableHeader>
        <TableRow>
          {table.columns.map((c) => (
            <TableHead key={c}>{c}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.rows.map((r) => (
          <TableRow key={r[0]}>
            {r.map((cell, i) => (
              <TableCell key={i}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** One row of the board, holding what a consumer would: the range, the tab, the toggles, the text. */
function Live({ row, args, log }: { row: Row; args: Args; log: Log }) {
  const [range, setRange] = React.useState('day');
  const [tab, setTab] = React.useState('day');
  const [pressed, setPressed] = React.useState(false);
  const [period, setPeriod] = React.useState('day');
  const [text, setText] = React.useState('');
  const [q, setQ] = React.useState('');
  const [store, setStore] = React.useState<string>();
  const [checked, setChecked] = React.useState(false);
  const [icon, setIcon] = React.useState('');
  const [colour, setColour] = React.useState(swatches[0].value);

  const click = (name: string) => () => {
    args.onClick(name);
    log('onClick', name);
  };
  const change =
    <T,>(set: (v: T) => void) =>
    (value: T) => {
      set(value);
      args.onValueChange(value);
      log('onValueChange', value);
    };
  const pick = (item: string) => {
    args.onSelect(item);
    log('onSelect', item);
  };

  if (row.block) {
    const kind = row.block;
    const variant = (BLOCK_VARIANTS as Record<string, unknown[]>)[kind][0] as React.ComponentProps<typeof LiveBlock>['variant'];
    const component = BLOCK_RENDERERS[kind] as React.ComponentType<BlockProps<BlockKind>>;
    return (
      <PanelBox role="region" aria-label={row.caption} title={BLOCKS.find((b) => b.id === kind)?.name}>
        <LiveBlock component={component} variant={variant} onAction={args.onAction} log={log} />
      </PanelBox>
    );
  }

  const draw = (p: Part): React.ReactNode => {
    switch (p) {
      case 'buttons':
        return (buttons as ButtonVariant[]).map((v) => (
          <Button key={v} variant={v} onClick={click(v)}>
            {v}
          </Button>
        ));
      case 'icon-button':
        return (
          <Button key={p} size="icon" variant="outline" aria-label="Settings" onClick={click('settings')}>
            <Settings2 />
          </Button>
        );
      case 'button-group':
        return (
          <ButtonGroup key={p} aria-label="Pages">
            <Button variant="outline" onClick={click('previous')}>
              Previous
            </Button>
            <Button variant="outline" onClick={click('next')}>
              Next
            </Button>
          </ButtonGroup>
        );
      case 'toggle':
        return (
          <Toggle key={p} variant="outline" aria-label="Bold" pressed={pressed} onPressedChange={change(setPressed)}>
            B
          </Toggle>
        );
      case 'toggle-group':
        return (
          <ToggleGroup key={p} type="single" variant="outline" aria-label="Period" value={period} onValueChange={change(setPeriod)}>
            {options.map((o) => (
              <ToggleGroupItem key={o.value} value={o.value}>
                {o.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        );
      case 'segmented':
        return <SegmentedControl key={p} aria-label="Range" options={options} value={range} onValueChange={change(setRange)} />;
      case 'tabs':
        return (
          <Tabs key={p} value={tab} onValueChange={change(setTab)}>
            <TabsList>
              {options.map((o) => (
                <TabsTrigger key={o.value} value={o.value}>
                  {o.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        );
      case 'kbd':
        return <Kbd key={p}>⌘K</Kbd>;
      case 'input':
        return <Input key={p} placeholder="Input" value={text} onChange={(e) => change(setText)(e.target.value)} />;
      case 'search':
        return <SearchInput key={p} placeholder="Search" value={q} onChange={change(setQ)} />;
      case 'input-group':
        return (
          <InputGroup key={p}>
            <InputGroupAddon align="inline-start">
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="invana.io" />
          </InputGroup>
        );
      case 'select':
        return (
          <Select key={p} value={store} onValueChange={change(setStore)}>
            <SelectTrigger aria-label="Store">
              <SelectValue placeholder={select.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {select.items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return <Textarea key={p} placeholder="Notes" rows={2} />;
      case 'checkbox':
        return <Checkbox key={p} aria-label="Include drafts" checked={checked} onCheckedChange={(v) => change(setChecked)(v === true)} />;
      case 'icon-input':
        return <IconInput key={p} value={icon} onChange={change(setIcon)} />;
      case 'swatches':
        return <ColorSwatches key={p} presetColors={swatches} value={colour} onChange={change(setColour)} />;
      case 'badges':
        return [
          <Badge key="xs" variant="outline">
            xs badge
          </Badge>,
          <Badge key="sm" size="sm" variant="soft">
            sm badge
          </Badge>,
        ];
      case 'filter-chip':
        return <FilterChip key={p} label={chips.filter.label} value={chips.filter.value} active onClick={click('filter-chip')} />;
      case 'address-chip':
        return <AddressChip key={p} address={chips.address} />;
      case 'agent-chip':
        return <AgentChip key={p} name={chips.agent} />;
      case 'kind-chip':
        return <KindChip key={p} kind={chips.kind} />;
      case 'lens-chip':
        return <LensChip key={p} lens={{ name: chips.lens }} />;
      case 'mark-chip':
        return (
          <MarkChip key={p} tone="info">
            {chips.mark}
          </MarkChip>
        );
      case 'suggestions':
        return <SuggestionChips key={p} items={chips.suggestions} onSelect={pick} />;
      case 'card':
        return <CardWithHeader key={p} role="region" aria-label={card.title} title={card.title} description={card.description} />;
      case 'panel':
        return (
          <PanelBox key={p} role="region" aria-label={panel.title} title={panel.title} aside={panel.aside}>
            {panel.body}
          </PanelBox>
        );
      case 'panel-content':
        return (
          <PanelContent key={p} title={panelContent.title} count={panelContent.count}>
            {panelContent.body}
          </PanelContent>
        );
      case 'popover':
        return (
          <Popover key={p}>
            <PopoverTrigger asChild>
              <Button variant="outline">{popover.trigger}</Button>
            </PopoverTrigger>
            <PopoverContent aria-label="Popover">{popover.body}</PopoverContent>
          </Popover>
        );
      case 'hover-card':
        return (
          <HoverCard key={p} openDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="outline">{hoverCard.trigger}</Button>
            </HoverCardTrigger>
            <HoverCardContent>{hoverCard.body}</HoverCardContent>
          </HoverCard>
        );
      case 'tooltip':
        return (
          <TooltipProvider key={p}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">{tooltip.trigger}</Button>
              </TooltipTrigger>
              <TooltipContent>{tooltip.body}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'menu':
        return (
          <DropdownMenu key={p}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{menu.trigger}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {menu.items.map((item) => (
                <DropdownMenuItem key={item} onSelect={() => pick(item)}>
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      case 'menubar':
        return (
          <Menubar key={p}>
            {menubar.menus.map((m) => (
              <MenubarMenu key={m.label}>
                <MenubarTrigger>{m.label}</MenubarTrigger>
                <MenubarContent>
                  {m.items.map((item) => (
                    <MenubarItem key={item} onSelect={() => pick(item)}>
                      {item}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            ))}
          </Menubar>
        );
      case 'navigation':
        return (
          <NavigationMenu key={p}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{navigation.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <Stack gap="xs" style={{ padding: 8, width: 200 }}>
                    {navigation.items.map((item) => (
                      <NavigationMenuLink key={item} onSelect={() => pick(item)}>
                        {item}
                      </NavigationMenuLink>
                    ))}
                  </Stack>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        );
      case 'dialog':
        return (
          <Dialog key={p}>
            <DialogTrigger asChild>
              <Button variant="outline">{dialog.trigger}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{dialog.title}</DialogTitle>
                <DialogDescription>{dialog.description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={click('cancel')}>
                  Cancel
                </Button>
                <Button onClick={click('archive')}>Archive</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case 'alert-dialog':
        return (
          <AlertDialog key={p}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">{alertDialog.trigger}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
                <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={click('keep')}>Keep</AlertDialogCancel>
                <AlertDialogAction onClick={click('delete')}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      case 'command':
        return (
          <Command key={p} style={{ width: 260, height: 'auto' }}>
            <CommandInput placeholder={command.placeholder} />
            <CommandList>
              <CommandGroup heading={command.heading}>
                {command.items.map((item) => (
                  <CommandItem key={item} onSelect={() => pick(item)}>
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        );
      case 'table':
        return <RunTable key={p} />;
      case 'nested':
        return (
          <CardWithHeader
            key={p}
            title={card.title}
            description={card.description}
            footer={
              <Stack direction="row" gap="sm">
                <Badge variant="outline">3 agents</Badge>
                <Button size="sm" onClick={click('open')}>
                  Open
                </Button>
              </Stack>
            }
          >
            <RunTable />
          </CardWithHeader>
        );
    }
  };

  return (
    <Stack direction="row" gap="sm" wrap align="start">
      {row.parts?.map(draw)}
    </Stack>
  );
}

function Board({ args, update }: { args: Args; update: (next: Partial<Dials>) => void }) {
  useDials(args);
  return (
    <Stack gap="lg">
      <DialPanel dials={{ radius: args.radius, surface: args.surface, control: args.control }} update={update} />
      <VariantBoard variants={VARIANTS} variant={args.variant}>
        {(row, log) => <Live row={row} args={args} log={log} />}
      </VariantBoard>
    </Stack>
  );
}

/** The Code tab: the three dials as the consumer's stylesheet sets them. */
function source(_code: string, ctx: { args: Partial<Args> }) {
  const { radius = 0, surface = 0, control = 4 } = ctx.args;
  return `/* app.css — after @import "@invana/styling/index.css" */
:root {
  --radius: ${radius}px;          /* rounded, rounded-sm … rounded-4xl: tables, rows, boxes inside a card */
  --radius-surface: ${surface}px;  /* rounded-surface: Card, PanelBox, PanelContent, Dialog, Popover, menus, Tooltip */
  --radius-control: ${control}px;  /* rounded-control: Button, Badge, chips, Input, Select, Tabs, Toggle */
}

/* Per theme: */
[data-theme="vite"] { --radius-control: 2px; }

/* No component takes a radius prop — every one reads its dial. */`;
}

const dialArg = (description: string) => ({ control: { type: 'range' as const, min: 0, max: 16, step: 1 }, description });

const meta = {
  title: 'Others/CornerRadius',
  parameters: {
    layout: 'padded',
    docs: { source: { language: 'css', transform: source } },
  },
  args: {
    variant: ALL,
    ...data.dials,
    onClick: fn(),
    onValueChange: fn(),
    onSelect: fn(),
    onAction: fn(),
  },
  argTypes: {
    variant: variantArg(VARIANTS),
    radius: dialArg('`--radius` (px) — structure: tables, rows, boxes inside a card. Every `rounded-*` step reads it.'),
    surface: dialArg('`--radius-surface` (px) — cards, panels, dialogs, popovers, menus (`rounded-surface`). Defaults to `--radius`.'),
    control: dialArg('`--radius-control` (px) — buttons, badges, chips, inputs, tabs, toggles (`rounded-control`).'),
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Three dials set every corner in the kit. Drag them in the **Corner radius** panel at the top
 * (or in Controls) and every component redraws live — no component takes a radius prop.
 *
 * | Dial | Class | Draws | Default |
 * | --- | --- | --- | --- |
 * | `--radius` | `rounded`, `rounded-sm` … `rounded-4xl` | tables, rows, boxes inside a card | `0px` |
 * | `--radius-surface` | `rounded-surface` | `Card`, `PanelBox`, `PanelContent`, `Dialog`, `AlertDialog`, `Popover`, `HoverCard`, `Tooltip`, menus, `Select`'s list, `Command` | `var(--radius)` |
 * | `--radius-control` | `rounded-control` | `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup`, `SegmentedControl`, `Tabs`, `Badge`, chips, `Input`, `SearchInput`, `Select`, `Textarea`, `Checkbox`, menu items | `4px` |
 *
 * The board shows every surface and control, then every built block in the `PanelBox` a dashboard
 * frames it with: the frame follows the surface dial, the block's buttons and chips the control
 * dial. Round objects (avatars, status dots, switch thumbs) keep `rounded-full` and follow no dial.
 * Structure is square by default because the hairline grid (cells on a `bg-border` backdrop,
 * `gap-px`) shows a grey notch at any rounded corner. Set the dials on `:root` in the app's
 * stylesheet, or per theme under `[data-theme="…"]`; see the Code tab.
 */
export const CornerRadius: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<Args>();
    return <Board args={args} update={updateArgs} />;
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const corner = (el: Element) => getComputedStyle(el).borderTopLeftRadius;
    const group = (name: string) => within(canvas.getByRole('group', { name }));

    await step('Each part reads its own dial', async () => {
      await expect(corner(group('Controls · buttons and toggles').getByRole('button', { name: 'outline' }))).toBe(`${args.control}px`);
      await expect(corner(group('Controls · badges and chips').getByText('xs badge'))).toBe(`${args.control}px`);
      await expect(corner(canvas.getByRole('region', { name: card.title }))).toBe(`${args.surface}px`);
      await expect(corner(group('Structure · --radius').getByRole('table', { name: 'Runs' }).parentElement!)).toBe(`${args.radius}px`);
    });

    await step('A block sits in a surface', async () => {
      await expect(corner(canvas.getByRole('region', { name: 'Block · Confirm' }))).toBe(`${args.surface}px`);
    });

    await step('A portalled surface reads the dial too', async () => {
      await userEvent.click(canvas.getByRole('button', { name: popover.trigger }));
      const content = await page.findByRole('dialog', { name: 'Popover' });
      await expect(corner(content)).toBe(`${args.surface}px`);
      await userEvent.keyboard('{Escape}');
    });

    await step('The lil-gui panel is there', async () => {
      await expect(within(canvas.getByTestId('dial-panel')).getByText('--radius-surface')).toBeInTheDocument();
    });
  },
};
