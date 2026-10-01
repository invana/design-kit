import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import React, { useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { ThemeControls, useThemeControls } from '../src';
import { // Newly showcased primitives
  AlertDialog, // ui-extended
  ButtonWithTooltip, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Alert, AlertDescription, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertTitle, Avatar, AvatarFallback, AvatarGroup, AvatarImage, Badge, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonGroup, ButtonGroupSeparator, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, ErrorBoundary, Eyebrow, HoverCard, HoverCardContent, HoverCardTrigger, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, Kbd, KbdGroup, Link, Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger, MenuItem, NavBase, NavHorizontal, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavVertical, NestedMenu, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PanelContent, Popover, PopoverContent, PopoverTrigger, Progress, ResizableHandle, ResizablePanel, ResizablePanelGroup, RichSelect, SearchInput, Separator, Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Skeleton, Spinner, TabbedPanel, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Toaster, Toggle, ToggleGroup, ToggleGroupItem, Toolbar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Tour, TreeView, type TourStep, type TreeItem, Typography, TypographyH1, TypographyH3, TypographyH4, UnderDevelopment, useTour, MetricGrid, MetricTile, StatusDot, EmptyState, Stack } from '@invana/ui';
import {
  Input,
  Label,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Textarea,
  Switch,
  Slider,
  Form,
  FormField,
  type FieldConfig,
  type RowConfig,
} from '@invana/forms';
import { PaginatedTable, applyCellEdit, type ColumnDef } from '@invana/tables';
import { toast } from 'sonner';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  CreditCard,
  Settings,
  User,
  Users,
  Shield,
  LogOut,
  PlusCircle,
  Calendar,
  CalendarDays,
  Folder,
  FolderOpen,
  File,
  FileText,
  Heart,
  Bell,
  Menu,
  X,
  Copy,
  ArrowRight,
  ChevronRight,
  Trash2,
  Home,
  LayoutGrid,
  Network,
  GitFork,
} from 'lucide-react';

const meta = {
  title: 'Showcase',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const treeItems: TreeItem[] = [
  {
    id: '1',
    label: 'Documents',
    icon: <Folder className="size-4" />,
    children: [
      { id: '1-1', label: 'Report.pdf', icon: <File className="size-4" /> },
      { id: '1-2', label: 'Notes.txt', icon: <File className="size-4" /> },
    ],
  },
  {
    id: '2',
    label: 'Images',
    icon: <Folder className="size-4" />,
    children: [
      { id: '2-1', label: 'Photo.jpg', icon: <File className="size-4" /> },
    ],
  },
];

const nestedMenuItems = [
  {
    id: 'files',
    label: 'Files',
    icon: File,
    shortcut: '⌘F',
    children: [
      { id: 'shared', label: 'Shared Files', icon: FolderOpen, shortcut: '⌘S' },
      { id: 'recent', label: 'Recent Files', icon: File, shortcut: '⌘R' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    shortcut: '⌘,',
    children: [
      {
        id: 'account',
        label: 'Account',
        icon: Users,
        children: [{ id: 'security', label: 'Security', icon: Shield, shortcut: '⌘L' }],
      },
    ],
  },
];

// DataTable demo --------------------------------------------------------------

type Person = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  team: string;
  status: 'active' | 'invited' | 'disabled';
};

const people: Person[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `u-${i + 1}`,
  name: ['Ada Lovelace', 'Linus Torvalds', 'Grace Hopper', 'Alan Turing'][i % 4] + ` ${i + 1}`,
  email: `user${i + 1}@invana.io`,
  role: (['admin', 'editor', 'viewer'] as const)[i % 3],
  team: ['Platform', 'Growth', 'Data', 'Design'][i % 4],
  status: (['active', 'invited', 'disabled'] as const)[i % 3],
}));

const ShowcaseDataTable = () => {
  const [data, setData] = useState<Person[]>(people);

  const columns: ColumnDef<Person, unknown>[] = React.useMemo(
    () => [
      { id: 'name', accessorKey: 'name', header: 'Name', size: 200, meta: { editable: true, editType: 'text' } },
      { id: 'email', accessorKey: 'email', header: 'Email', size: 220, meta: { editable: true, editType: 'text' } },
      {
        id: 'role',
        accessorKey: 'role',
        header: 'Role',
        size: 130,
        meta: {
          editable: true,
          editType: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'Viewer', value: 'viewer' },
          ],
        },
      },
      { id: 'team', accessorKey: 'team', header: 'Team', size: 130, meta: { editable: true, editType: 'text' } },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        cell: ({ getValue }) => {
          const v = getValue() as Person['status'];
          const tone = v === 'active' ? 'default' : v === 'invited' ? 'secondary' : 'outline';
          return <Badge variant={tone}>{v}</Badge>;
        },
      },
    ],
    [],
  );

  return (
    <PaginatedTable<Person>
      columns={columns}
      data={data}
      pageSize={5}
      onCellEdit={(edit) => setData((prev) => applyCellEdit(prev, edit))}
    />
  );
};

// Form demo -------------------------------------------------------------------

const profileFields: FieldConfig[] = [
  { name: 'firstName', type: 'text', label: 'First name' },
  { name: 'lastName', type: 'text', label: 'Last name' },
  {
    name: 'role',
    type: 'select',
    label: 'Role',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
      { label: 'Viewer', value: 'viewer' },
    ],
  },
  { name: 'notifications', type: 'boolean', label: 'Email me notifications', group: 'preferences' },
  {
    name: 'theme',
    type: 'select',
    label: 'Theme',
    group: 'preferences',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' },
      { label: 'System', value: 'system' },
    ],
  },
  { name: 'accent', type: 'color', label: 'Accent', group: 'preferences' },
];

const profileRowConfig: RowConfig[] = [
  { id: 'name', fields: ['firstName', 'lastName'] },
  { id: 'role', fields: ['role'] },
];

const ShowcaseForm = () => {
  const form = useForm<FieldValues>({
    defaultValues: {
      profile: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        role: 'admin',
        notifications: true,
        theme: 'system',
        accent: 'rgb(59, 130, 246)',
      },
    },
  });
  const [submitted, setSubmitted] = useState<unknown>(null);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(setSubmitted)}>
          <Stack gap="lg" align="start">
            <FormField.ObjectField
              control={form.control}
              name="profile"
              fields={profileFields}
              rowConfig={profileRowConfig}
              labelPosition="top"
            />
            <Button type="submit">Save</Button>
          </Stack>
        </form>
      </Form>
      <Stack gap="sm">
        <Eyebrow>Submitted payload</Eyebrow>
        <Typography.Pre>
          {submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}
        </Typography.Pre>
      </Stack>
    </div>
  );
};

// RichSelect demo -------------------------------------------------------------

const ShowcaseRichSelect = () => {
  const [value, setValue] = useState<string>('force');
  return (
    <div className="w-[280px]">
      <RichSelect
        label="Layout"
        value={value}
        onChange={(v) => setValue(v as string)}
        options={[
          { value: 'force', label: 'Force-directed', description: 'Physics-based, organic clusters', icon: Network },
          { value: 'grid', label: 'Grid', description: 'Evenly spaced rows and columns', icon: LayoutGrid },
          { value: 'tree', label: 'Hierarchy', description: 'Top-down parent → child tree', icon: GitFork },
        ]}
      />
    </div>
  );
};

// Tour demo -------------------------------------------------------------------

const ShowcaseTour = () => {
  const steps: TourStep[] = [
    { id: 'overview', title: 'Welcome', body: 'A quick guided tour. Use Prev / Next to move between steps.' },
    {
      id: 'components',
      title: 'Components',
      body: 'Every step can include callouts and references.',
      callout: { label: 'Tip', content: 'Tours are great for onboarding new users.' },
    },
  ];
  const tour = useTour({ steps });

  return <Tour controller={tour} />;
};

// Section helper --------------------------------------------------------------

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <>
    <Separator />
    <Stack gap="xl">
      <TypographyH3>{title}</TypographyH3>
      {children}
    </Stack>
  </>
);

const Sub = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Stack>
    <Eyebrow>{title}</Eyebrow>
    {children}
  </Stack>
);

// A label over its control.
const Field = ({ children }: { children: React.ReactNode }) => <Stack gap="sm">{children}</Stack>;

// ---------------------------------------------------------------------------
// Showcase
// ---------------------------------------------------------------------------

const ThemeShowcase = ({
  storybookTheme = 'default',
  storybookVariant = 'light',
}: {
  storybookTheme?: string;
  storybookVariant?: string;
}) => {
  const [searchValue, setSearchValue] = useState('');

  const {
    accentStyles,
    currentTheme,
    setCurrentTheme,
    currentAccent,
    setCurrentAccent,
    isDarkMode,
    setIsDarkMode,
  } = useThemeControls(storybookTheme, storybookVariant);

  return (
    <TooltipProvider>
      <Toaster />
      <div style={accentStyles}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Stack direction="row" justify="between" className="container h-16 px-4 max-w-7xl mx-auto">
            <Stack direction="row" gap="lg">
              <TypographyH4>@invana/ui</TypographyH4>
              <Badge variant="secondary">v1.0</Badge>
            </Stack>
            <ThemeControls
              storybookTheme={storybookTheme}
              storybookVariant={storybookVariant}
              currentTheme={currentTheme}
              currentAccent={currentAccent}
              isDarkMode={isDarkMode}
              onThemeChange={setCurrentTheme}
              onAccentChange={setCurrentAccent}
              onModeChange={setIsDarkMode}
            />
          </Stack>
        </header>

        <Stack gap="xl" className="container max-w-7xl mx-auto p-8">
          {/* Hero Section */}
          <Stack align="center" gap="xl" className="text-center">
            <TypographyH1>
              Every component, one page
            </TypographyH1>
            <Typography.Lead>
              A complete visual review of the Invana Design Kit — UI primitives, composed
              components, typography, data tables, and forms. Switch themes from the header.
            </Typography.Lead>
            <Stack direction="row" gap="lg">
              <Button>
                <PlusCircle />
                New Project
              </Button>
              <Button variant="outline">
                View Components
                <ArrowRight />
              </Button>
            </Stack>
          </Stack>

          {/* ============================ COMPOSED EXAMPLES ============================ */}
          <Section title="Dashboard Components">
            <Tabs defaultValue="examples">
              <Stack gap="xl">
                <TabsList>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="authentication">Authentication</TabsTrigger>
                </TabsList>

                <TabsContent value="examples">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>All transactions are secure and encrypted</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Stack gap="lg">
                          <Field>
                            <Label htmlFor="name-on-card">Name on Card</Label>
                            <Input id="name-on-card" placeholder="John Doe" />
                          </Field>
                          <Field>
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" />
                          </Field>
                        </Stack>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Continue</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardContent>
                        <Stack align="center">
                          <EmptyState
                            icon={
                              <AvatarGroup>
                                <Avatar>
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                  <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                  <AvatarFallback>AB</AvatarFallback>
                                </Avatar>
                              </AvatarGroup>
                            }
                            title="No Team Members"
                            description="Invite your team to collaborate on this project."
                            actions={
                              <Button>
                                <PlusCircle />
                                Invite Members
                              </Button>
                            }
                          />
                          <Stack direction="row" gap="sm">
                            <Badge variant="outline">Syncing</Badge>
                            <Badge variant="secondary">Updating</Badge>
                            <Badge>Loading</Badge>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Appearance Settings</CardTitle>
                        <CardDescription>Customize the look and feel</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Stack gap="lg">
                          <Item variant="outline">
                            <ItemMedia variant="icon">
                              <Bell />
                            </ItemMedia>
                            <ItemContent>
                              <ItemTitle>Push Notifications</ItemTitle>
                              <ItemDescription>Send notifications to device.</ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <Switch />
                            </ItemActions>
                          </Item>
                          <Field>
                            <Stack direction="row" justify="between">
                              <Label>Volume</Label>
                              <Typography.Muted>50%</Typography.Muted>
                            </Stack>
                            <Slider defaultValue={[50]} max={100} step={1} />
                          </Field>
                          <Stack direction="row" gap="sm">
                            <Checkbox id="terms-appearance" />
                            <Label htmlFor="terms-appearance">I agree to the terms and conditions</Label>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="dashboard">
                  <MetricGrid minTileWidth={220}>
                    {[
                      { title: 'Total Revenue', value: '$45,231.89', note: '+20.1% from last month' },
                      { title: 'Subscriptions', value: '+2,350', note: '+180.1% from last month' },
                      { title: 'Active Now', value: '+573', note: '+201 since last hour' },
                    ].map((stat) => (
                      <MetricTile key={stat.title} label={stat.title} value={stat.value} caption={stat.note} />
                    ))}
                  </MetricGrid>
                </TabsContent>

                <TabsContent value="cards">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>You have 3 unread messages.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Stack gap="lg">
                          {[
                            { title: 'Your call has been confirmed.', time: '1 hour ago' },
                            { title: 'You have a new message!', time: '2 hours ago' },
                            { title: 'Your subscription is expiring soon!', time: '3 hours ago' },
                          ].map((notification, index) => (
                            <Item key={index} size="sm">
                              <ItemMedia>
                                <StatusDot tone="info" />
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle>{notification.title}</ItemTitle>
                                <ItemDescription>{notification.time}</ItemDescription>
                              </ItemContent>
                            </Item>
                          ))}
                        </Stack>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          <Check />
                          Mark all as read
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Share this document</CardTitle>
                        <CardDescription>Anyone with the link can view this document.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Stack gap="lg">
                          <Stack direction="row" gap="sm">
                            <Input value="https://example.com/share/abc123" readOnly />
                            <Button variant="secondary" size="icon" aria-label="Copy link">
                              <Copy />
                            </Button>
                          </Stack>
                          <Separator />
                          <Stack gap="lg">
                            <Eyebrow>People with access</Eyebrow>
                            {[
                              { name: 'Olivia Martin', email: 'm@example.com', access: 'can-edit' },
                              { name: 'Isabella Nguyen', email: 'b@example.com', access: 'can-view' },
                            ].map((person, index) => (
                              <Item key={index} size="sm">
                                <ItemMedia>
                                  <Avatar>
                                    <AvatarFallback>{person.name[0]}</AvatarFallback>
                                  </Avatar>
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle>{person.name}</ItemTitle>
                                  <ItemDescription>{person.email}</ItemDescription>
                                </ItemContent>
                                <ItemActions>
                                  <Select defaultValue={person.access}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="can-edit">Can edit</SelectItem>
                                      <SelectItem value="can-view">Can view</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </ItemActions>
                              </Item>
                            ))}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="authentication">
                  <div className="max-w-md mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>Enter your email below to create your account</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Stack gap="lg">
                          <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" />
                          </Field>
                          <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                          </Field>
                        </Stack>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">Create account</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Stack>
            </Tabs>
          </Section>

          {/* ============================ UI PRIMITIVES ============================ */}

          <Section title="Buttons">
            <Stack gap="xl">
              <Sub title="Variants">
                <Stack direction="row" gap="lg" wrap>
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </Stack>
              </Sub>
              <Sub title="Sizes">
                <Stack direction="row" gap="lg" wrap>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" aria-label="Settings"><Settings /></Button>
                </Stack>
              </Sub>
              <Sub title="States">
                <Stack direction="row" gap="lg" wrap>
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </Stack>
              </Sub>
              <Sub title="Button Group">
                <ButtonGroup>
                  <Button variant="outline" size="icon" aria-label="Bold"><Bold /></Button>
                  <Button variant="outline" size="icon" aria-label="Italic"><Italic /></Button>
                  <Button variant="outline" size="icon" aria-label="Underline"><Underline /></Button>
                  <ButtonGroupSeparator />
                  <Button variant="outline">Clear</Button>
                </ButtonGroup>
              </Sub>
              <Sub title="Button with Tooltip">
                <ButtonWithTooltip tooltip="Open settings" size="icon">
                  <Settings />
                </ButtonWithTooltip>
              </Sub>
            </Stack>
          </Section>

          <Section title="Badges">
            <Stack direction="row" gap="lg" wrap>
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </Stack>
          </Section>

          <Section title="Alerts">
            <Stack gap="lg">
              <Alert>
                <Bell className="size-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>You can add components to your app using the cli.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="size-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
              </Alert>
            </Stack>
          </Section>

          <Section title="Form Elements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              <Stack gap="lg">
                <Eyebrow>Input</Eyebrow>
                <Field>
                  <Label htmlFor="default-input">Default</Label>
                  <Input id="default-input" placeholder="Enter text..." />
                </Field>
                <Field>
                  <Label htmlFor="disabled-input">Disabled</Label>
                  <Input id="disabled-input" placeholder="Disabled" disabled />
                </Field>
                <Field>
                  <Label htmlFor="file-input">File</Label>
                  <Input id="file-input" type="file" />
                </Field>
              </Stack>

              <Stack gap="lg">
                <Eyebrow>Textarea</Eyebrow>
                <Field>
                  <Label htmlFor="textarea">Message</Label>
                  <Textarea id="textarea" placeholder="Type your message here..." />
                </Field>
              </Stack>

              <Stack gap="lg">
                <Eyebrow>Select</Eyebrow>
                <Field>
                  <Label>Framework</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="next">Next.js</SelectItem>
                      <SelectItem value="vite">Vite</SelectItem>
                      <SelectItem value="remix">Remix</SelectItem>
                      <SelectItem value="astro">Astro</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </Stack>

              <Stack gap="lg">
                <Eyebrow>Checkbox &amp; Switch</Eyebrow>
                <Stack direction="row" gap="sm">
                  <Checkbox id="terms-form" />
                  <Label htmlFor="terms-form">Accept terms</Label>
                </Stack>
                <Stack direction="row" gap="sm">
                  <Checkbox id="marketing" defaultChecked />
                  <Label htmlFor="marketing">Marketing emails</Label>
                </Stack>
                <Separator />
                <Stack direction="row" gap="sm">
                  <Switch id="airplane" />
                  <Label htmlFor="airplane">Airplane Mode</Label>
                </Stack>
              </Stack>

              <Stack gap="lg">
                <Eyebrow>Slider</Eyebrow>
                <Stack gap="xl">
                  <Field>
                    <Label>Default</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </Field>
                  <Field>
                    <Label>Range</Label>
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </Field>
                </Stack>
              </Stack>

              <Stack gap="lg">
                <Eyebrow>Search Input</Eyebrow>
                <SearchInput value={searchValue} onChange={setSearchValue} />
              </Stack>
            </div>
          </Section>

          <Section title="Toggle">
            <Stack gap="xl">
              <Sub title="Single Toggle">
                <Stack direction="row" gap="lg">
                  <Toggle aria-label="Toggle bold"><Bold /></Toggle>
                  <Toggle aria-label="Toggle italic"><Italic /></Toggle>
                  <Toggle aria-label="Toggle underline"><Underline /></Toggle>
                </Stack>
              </Sub>
              <Sub title="Toggle Group">
                <ToggleGroup type="single" defaultValue="center">
                  <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft /></ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter /></ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right"><AlignRight /></ToggleGroupItem>
                </ToggleGroup>
              </Sub>
            </Stack>
          </Section>

          <Section title="Accordion">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>Yes. It comes with default styles that match the other components' aesthetic.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>Yes. It's animated by default, but you can disable it if you prefer.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          <Section title="Overlays — Dialog, Alert Dialog, Sheet, Popover, Tooltip, Hover Card">
            <Stack direction="row" gap="lg" wrap>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <Stack direction="row" gap="lg">
                    <Label htmlFor="dialog-name">Name</Label>
                    <Input id="dialog-name" defaultValue="John Doe" />
                  </Stack>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 />
                    Delete project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Settings />
                    Open settings
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Workspace settings</SheetTitle>
                    <SheetDescription>Update your workspace details.</SheetDescription>
                  </SheetHeader>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button type="submit">Save</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Stack gap="lg">
                    <Stack gap="sm">
                      <Eyebrow tone="foreground">Dimensions</Eyebrow>
                      <Typography.Muted>Set the dimensions for the layer.</Typography.Muted>
                    </Stack>
                    <Stack direction="row" gap="lg">
                      <Label htmlFor="width">Width</Label>
                      <Input id="width" defaultValue="100%" inputSize="sm" />
                    </Stack>
                  </Stack>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to library</p>
                </TooltipContent>
              </Tooltip>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@invana</Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <Stack gap="sm">
                    <Eyebrow tone="foreground">@invana</Eyebrow>
                    <Typography.Muted>
                      The open-source graph visualization and analytics platform.
                    </Typography.Muted>
                    <Stack direction="row" gap="sm">
                      <CalendarDays className="size-4" />
                      <Typography.Muted>Joined December 2021</Typography.Muted>
                    </Stack>
                  </Stack>
                </HoverCardContent>
              </HoverCard>
            </Stack>
          </Section>

          <Section title="Menus — Dropdown, Menubar, Navigation Menu, Command">
            <Stack gap="xl">
              <Sub title="Dropdown Menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Menu />
                      Open Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><User /><span>Profile</span></DropdownMenuItem>
                    <DropdownMenuItem><CreditCard /><span>Billing</span></DropdownMenuItem>
                    <DropdownMenuItem><Settings /><span>Settings</span></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><LogOut /><span>Log out</span></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Sub>

              <Sub title="Menubar">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>File</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                      <MenubarSeparator />
                      <MenubarSub>
                        <MenubarSubTrigger>Share</MenubarSubTrigger>
                        <MenubarSubContent>
                          <MenubarItem>Email link</MenubarItem>
                        </MenubarSubContent>
                      </MenubarSub>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                      <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
                      <MenubarSeparator />
                      <MenubarRadioGroup value="comfortable">
                        <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                        <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                      </MenubarRadioGroup>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </Sub>

              <Sub title="Navigation Menu">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <Stack direction="row" gap="sm" align="start" className="w-[420px] p-2">
                          <NavigationMenuLink asChild>
                            <Item asChild size="sm">
                              <a href="#">
                                <ItemContent>
                                  <ItemTitle>Graph Explorer</ItemTitle>
                                  <ItemDescription>Visualize and traverse your graph data.</ItemDescription>
                                </ItemContent>
                              </a>
                            </Item>
                          </NavigationMenuLink>
                          <NavigationMenuLink asChild>
                            <Item asChild size="sm">
                              <a href="#">
                                <ItemContent>
                                  <ItemTitle>Dashboards</ItemTitle>
                                  <ItemDescription>Build and share live dashboards.</ItemDescription>
                                </ItemContent>
                              </a>
                            </Item>
                          </NavigationMenuLink>
                        </Stack>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </Sub>

              <Sub title="Command">
                <Command className="w-[420px] rounded-lg border shadow-md">
                  <CommandInput placeholder="Type a command or search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      <CommandItem><Calendar /><span>Calendar</span></CommandItem>
                      <CommandItem><User /><span>Search Members</span></CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                      <CommandItem><Settings /><span>Settings</span><CommandShortcut>⌘S</CommandShortcut></CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </Sub>
            </Stack>
          </Section>

          <Section title="Navigation — Breadcrumb & Pagination">
            <Stack gap="xl">
              <Sub title="Breadcrumb">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Graph Explorer</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </Sub>
              <Sub title="Pagination">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem><PaginationPrevious href="#" size="default" /></PaginationItem>
                    <PaginationItem><PaginationLink href="#" size="icon">1</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#" size="icon" isActive>2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink href="#" size="icon">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationEllipsis /></PaginationItem>
                    <PaginationItem><PaginationNext href="#" size="default" /></PaginationItem>
                  </PaginationContent>
                </Pagination>
              </Sub>
            </Stack>
          </Section>

          <Section title="Feedback — Progress, Spinner, Skeleton, Toast">
            <Stack gap="xl">
              <Sub title="Progress">
                <Progress value={60} />
              </Sub>
              <Sub title="Spinner">
                <Stack direction="row" gap="xl">
                  <Spinner />
                  <Spinner className="size-6" />
                  <Spinner className="size-8" />
                </Stack>
              </Sub>
              <Sub title="Skeleton">
                <Card className="w-[320px]">
                  <CardContent>
                    <Stack gap="lg">
                      <Stack direction="row">
                        <Skeleton className="size-12 rounded-full" />
                        <Stack gap="sm">
                          <Skeleton className="h-4 w-[160px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </Stack>
                      </Stack>
                      <Skeleton className="h-32" />
                    </Stack>
                  </CardContent>
                </Card>
              </Sub>
              <Sub title="Toast (Sonner)">
                <Stack direction="row" gap="sm" wrap>
                  <Button variant="outline" onClick={() => toast('Event has been created')}>Show toast</Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success('Changes saved', { description: 'Your profile has been updated.' })}
                  >
                    Success toast
                  </Button>
                </Stack>
              </Sub>
            </Stack>
          </Section>

          <Section title="Item">
            <Item variant="outline" className="w-96">
              <ItemMedia variant="icon">
                <FileText />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Project proposal.pdf</ItemTitle>
                <ItemDescription>Updated 2 hours ago · 1.4 MB</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon" aria-label="Open"><ChevronRight /></Button>
              </ItemActions>
            </Item>
          </Section>

          <Section title="Keyboard Keys">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Section>

          <Section title="Carousel">
            <Carousel className="max-w-xs" opts={{ align: 'start' }}>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <Card className="aspect-square">
                      <Stack align="center" justify="center" className="h-full">
                        <Typography.H1>{index + 1}</Typography.H1>
                      </Stack>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Section>

          <Section title="Resizable Panels">
            <div className="h-72 max-w-3xl">
              <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
                <ResizablePanel defaultSize={50} minSize={20}>
                  <EmptyState title="Left Panel" />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize={50}>
                      <EmptyState title="Top" />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                      <EmptyState title="Bottom" />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </Section>

          <Section title="Table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
                  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
                  { invoice: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
                ].map((row) => (
                  <TableRow key={row.invoice}>
                    <TableCell>{row.invoice}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'Paid' ? 'default' : row.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.method}</TableCell>
                    <TableCell className="text-right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Section>

          <Section title="Avatar">
            <Stack direction="row" gap="lg">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar size="md"><AvatarFallback>MD</AvatarFallback></Avatar>
              <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
              <AvatarGroup max={3}>
                {['AB', 'CD', 'EF', 'GH', 'IJ'].map((i) => (
                  <Avatar key={i}><AvatarFallback>{i}</AvatarFallback></Avatar>
                ))}
              </AvatarGroup>
            </Stack>
          </Section>

          {/* ============================ TYPOGRAPHY ============================ */}

          <Section title="Typography">
            <Stack gap="lg">
              <Typography.H1>The quick brown fox (H1)</Typography.H1>
              <Typography.H2>The quick brown fox (H2)</Typography.H2>
              <Typography.H3>The quick brown fox (H3)</Typography.H3>
              <Typography.H4>The quick brown fox (H4)</Typography.H4>
              <Typography.Lead>
                A lead paragraph stands out from the body text and introduces a section.
              </Typography.Lead>
              <Typography.P>
                This is a regular paragraph. Components are theme-aware via CSS variables, so all
                typography adapts to the selected theme and light/dark mode.
              </Typography.P>
              <Typography.Blockquote>
                "Design is not just what it looks like and feels like. Design is how it works."
              </Typography.Blockquote>
              <Typography.List>
                <li>First item in the list</li>
                <li>Second item in the list</li>
                <li>Third item in the list</li>
              </Typography.List>
              <Stack direction="row" gap="lg" wrap>
                <Typography.Large>Large text</Typography.Large>
                <Typography.Small>Small text</Typography.Small>
                <Typography.Muted>Muted text</Typography.Muted>
                <Typography.Code>npm install @invana/ui</Typography.Code>
              </Stack>
              <Typography.Pre>{`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}</Typography.Pre>
            </Stack>
          </Section>

          {/* ============================ UI EXTENDED ============================ */}

          <Section title="Navigation Shells">
            <Stack gap="xl">
              <Sub title="Nav Horizontal">
                <Card>
                  <NavHorizontal
                    className="h-12 px-3"
                    left={<Typography.Large>Invana</Typography.Large>}
                    leftNavItems={[
                      { name: 'Home', label: 'Home', icon: Home, onClick: () => {} },
                      { name: 'Apps', label: 'Apps', icon: LayoutGrid, href: '#apps' },
                    ]}
                    rightNavItems={[
                      { name: 'Notifications', icon: Bell, onClick: () => {} },
                      { name: 'Profile', icon: User, href: '#profile' },
                    ]}
                  />
                </Card>
              </Sub>

              <Sub title="Nav Vertical">
                <Card className="h-[320px] w-[45px]">
                  <NavVertical
                    topNavItems={[
                      { name: 'Home', icon: Home, onClick: () => {} },
                      { name: 'Apps', icon: LayoutGrid, href: '#apps', showSeperator: true },
                    ]}
                    bottomNavItems={[
                      { name: 'Settings', icon: Settings, onClick: () => {} },
                      { name: 'Profile', icon: User, href: '#profile' },
                    ]}
                  />
                </Card>
              </Sub>

              <Sub title="Nav Base">
                <Card>
                  <NavBase
                    orientation="horizontal"
                    className="h-12 px-3"
                    sections={{
                      start: { content: <Typography.Large>Invana</Typography.Large> },
                      center: { content: <Typography.Muted>Dashboard</Typography.Muted> },
                      end: { content: <Link href="#" variant="quiet">Sign out</Link> },
                    }}
                  />
                </Card>
              </Sub>
            </Stack>
          </Section>

          <Section title="Menus (Extended) — Menu Item & Nested Menu">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <Sub title="Menu Item">
                <Card className="w-[240px]">
                  <ul>
                    <MenuItem
                      id="settings"
                      label="Settings"
                      icon={Settings}
                      shortcut="⌘,"
                      children={[
                        { id: 'account', label: 'Account', icon: Users, shortcut: '⌘A' },
                        { id: 'security', label: 'Security', icon: Shield, shortcut: '⌘L' },
                      ]}
                    />
                  </ul>
                </Card>
              </Sub>
              <Sub title="Nested Menu">
                <NestedMenu menuItems={nestedMenuItems} />
              </Sub>
            </div>
          </Section>

          <Section title="Rich Select">
            <ShowcaseRichSelect />
          </Section>

          <Section title="Tabbed Panel">
            <TabbedPanel
              className="max-w-2xl h-[320px]"
              defaultTab="tab1"
              tabs={[
                { value: 'tab1', label: 'Overview', content: <Typography.P>Content for the Overview tab.</Typography.P> },
                { value: 'tab2', label: 'Details', content: <Typography.P>Content for the Details tab.</Typography.P> },
                { value: 'tab3', label: 'Activity', content: <Typography.P>Content for the Activity tab.</Typography.P> },
              ]}
            />
          </Section>

          <Section title="Panel Content">
            <Card className="h-[320px] w-[360px]">
              <PanelContent
                titleText="Panel title"
                headerActions={[{ name: 'Close panel', icon: X, onClick: () => {} }]}
                footerContent={
                  <Stack direction="row" justify="end" gap="sm" className="w-full">
                    <Button variant="ghost" size="sm">Cancel</Button>
                    <Button size="sm">Save</Button>
                  </Stack>
                }
              >
                <Typography.Muted>
                  Panel body content goes here. The header and footer stay fixed while the body scrolls.
                </Typography.Muted>
              </PanelContent>
            </Card>
          </Section>

          <Section title="Toolbar">
            <Toolbar
              items={[
                { id: 'run', label: 'Run' },
                { id: 'stop', label: 'Stop', disabled: true },
                { separator: true },
                { id: 'docs', label: 'Docs' },
              ]}
            />
          </Section>

          <Section title="Tree View">
            <TreeView items={treeItems} searchable />
          </Section>

          <Section title="Tour">
            <ShowcaseTour />
          </Section>

          <Section title="Under Development & Error Boundary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <Sub title="Under Development">
                <Card className="h-48">
                  <UnderDevelopment
                    title="Under Development"
                    description="This feature is currently being built."
                  />
                </Card>
              </Sub>
              <Sub title="Error Boundary">
                <Card className="h-48">
                  <ErrorBoundary>
                    <BrokenComponent />
                  </ErrorBoundary>
                </Card>
              </Sub>
            </div>
          </Section>

          {/* ============================ PACKAGES ============================ */}

          <Section title="Data Tables (@invana/tables)">
            <Typography.Muted>
              Editable, paginated TanStack-based data table. Double-click a cell to edit.
            </Typography.Muted>
            <ShowcaseDataTable />
          </Section>

          <Section title="Forms (@invana/forms)">
            <Typography.Muted>
              <Typography.Code>FormField.ObjectField</Typography.Code> driven by a field config, with grouped fields
              auto-wrapped in an accordion. Consumers own <Typography.Code>useForm</Typography.Code>.
            </Typography.Muted>
            <ShowcaseForm />
          </Section>

          {/* ============================ COLOR SYSTEM ============================ */}

          <Section title="Color System">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Background', class: 'bg-background', textClass: 'text-foreground' },
                { name: 'Foreground', class: 'bg-foreground', textClass: 'text-background' },
                { name: 'Primary', class: 'bg-primary', textClass: 'text-primary-foreground' },
                { name: 'Secondary', class: 'bg-secondary', textClass: 'text-secondary-foreground' },
                { name: 'Muted', class: 'bg-muted', textClass: 'text-muted-foreground' },
                { name: 'Accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
                { name: 'Destructive', class: 'bg-destructive', textClass: 'text-destructive-foreground' },
                { name: 'Card', class: 'bg-card border', textClass: 'text-card-foreground' },
                { name: 'Popover', class: 'bg-popover border', textClass: 'text-popover-foreground' },
              ].map((color) => (
                <Stack key={color.name} gap="sm">
                  <Stack justify="center" align="center" className={`h-16 rounded-md ${color.class} ${color.textClass}`}>
                    {color.name}
                  </Stack>
                  <Typography.Muted>{color.class}</Typography.Muted>
                </Stack>
              ))}
            </div>
          </Section>

          {/* Footer */}
          <Separator />
          <Stack align="center" gap="sm">
            <Typography.Muted>
              Built with <Heart className="inline-block size-4 text-destructive" /> using @invana/ui components
            </Typography.Muted>
            <Typography.Muted>
              Inspired by{' '}
              <Link href="https://ui.shadcn.com" external variant="quiet">
                shadcn/ui
              </Link>
            </Typography.Muted>
          </Stack>
        </Stack>
      </div>
    </TooltipProvider>
  );
};

// Throwing child used to demo the ErrorBoundary fallback.
const BrokenComponent = (): React.ReactElement => {
  throw new Error('Intentional render error for demo');
};

/**
 * Interactive theme showcase demonstrating every @invana/ui component, the ui-extended
 * compositions, typography, and the @invana/tables + @invana/forms packages on a single page.
 * Use the Storybook toolbar (or the controls in the header) to switch themes and light/dark mode.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: (_args, context) => (
    <ThemeShowcase
      storybookTheme={context.globals.theme}
      storybookVariant={context.globals.variant}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Every component, one page' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { name: 'Color System' })).toBeInTheDocument();
  },
};
