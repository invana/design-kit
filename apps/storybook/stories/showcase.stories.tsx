import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ThemeControls, useThemeControls } from '../src';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Separator,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  SearchInput,
  TreeView,
  type TreeItem,
  // Newly showcased primitives
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  ButtonGroup,
  ButtonGroupSeparator,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Kbd,
  KbdGroup,
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  Progress,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
  Skeleton,
  Spinner,
  Toaster,
  Typography,
  // ui-extended
  ButtonWithTooltip,
  ErrorBoundary,
  MenuItem,
  NavBase,
  NavHorizontal,
  NavVertical,
  NestedMenu,
  PanelContent,
  RichSelect,
  TabbedPanel,
  Toolbar,
  Tour,
  useTour,
  type TourStep,
  UnderDevelopment,
} from '@invana/ui';
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
import { DataTable, type ColumnDef } from '@invana/tables';
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
  Star,
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
    icon: <Folder className="h-4 w-4 text-yellow-500" />,
    children: [
      { id: '1-1', label: 'Report.pdf', icon: <File className="h-4 w-4 text-gray-500" /> },
      { id: '1-2', label: 'Notes.txt', icon: <File className="h-4 w-4 text-gray-500" /> },
    ],
  },
  {
    id: '2',
    label: 'Images',
    icon: <Folder className="h-4 w-4 text-yellow-500" />,
    children: [
      { id: '2-1', label: 'Photo.jpg', icon: <File className="h-4 w-4 text-gray-500" /> },
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

  const columns: ColumnDef<Person, any>[] = React.useMemo(
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
    <DataTable<Person>
      columns={columns}
      data={data}
      enablePagination
      pageSize={5}
      onCellEdit={({ rowIndex, columnId, value }) => {
        setData((prev) => {
          const target = data[rowIndex];
          if (!target) return prev;
          return prev.map((r) => (r.id === target.id ? { ...r, [columnId]: value } : r));
        });
      }}
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
  const form = useForm({
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
        <form onSubmit={form.handleSubmit(setSubmitted)} className="space-y-4">
          <FormField.ObjectField
            control={form.control}
            name="profile"
            fields={profileFields}
            rowConfig={profileRowConfig}
            labelPosition="top"
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
      <div>
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Submitted payload</h4>
        <pre className="rounded-md border bg-muted/40 p-3 text-xs overflow-auto">
          {submitted ? JSON.stringify(submitted, null, 2) : '— submit the form —'}
        </pre>
      </div>
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
    <section>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      {children}
    </section>
  </>
);

const Sub = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-lg font-medium mb-4">{title}</h4>
    {children}
  </div>
);

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
      <div className="transition-colors duration-300" style={accentStyles}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">@invana/ui</h1>
              <Badge variant="secondary">v1.0</Badge>
            </div>
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
          </div>
        </header>

        <main className="container max-w-7xl mx-auto p-8 space-y-16">
          {/* Hero Section */}
          <section className="text-center py-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Every component, one page
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A complete visual review of the Invana Design Kit — UI primitives, composed
              components, typography, data tables, and forms. Switch themes from the header.
            </p>
            <div className="flex justify-center gap-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Button>
              <Button variant="outline">
                View Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>

          {/* ============================ COMPOSED EXAMPLES ============================ */}
          <Section title="Dashboard Components">
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="mb-6">
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
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input id="name-on-card" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Continue</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="text-center">
                      <div className="flex justify-center -space-x-4 mb-4">
                        <Avatar className="border-2 border-background">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-background">
                          <AvatarFallback>AB</AvatarFallback>
                        </Avatar>
                      </div>
                      <CardTitle>No Team Members</CardTitle>
                      <CardDescription>Invite your team to collaborate on this project.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Invite Members
                      </Button>
                    </CardContent>
                    <CardFooter className="justify-center gap-2">
                      <Badge variant="outline">Syncing</Badge>
                      <Badge variant="secondary">Updating</Badge>
                      <Badge>Loading</Badge>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize the look and feel</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 rounded-md border p-4">
                        <Bell className="h-5 w-5" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Send notifications to device.</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Volume</Label>
                          <span className="text-sm text-muted-foreground">50%</span>
                        </div>
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms-appearance" />
                        <Label htmlFor="terms-appearance">I agree to the terms and conditions</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Total Revenue', icon: CreditCard, value: '$45,231.89', note: '+20.1% from last month' },
                    { title: 'Subscriptions', icon: User, value: '+2,350', note: '+180.1% from last month' },
                    { title: 'Active Now', icon: Star, value: '+573', note: '+201 since last hour' },
                  ].map((stat) => (
                    <Card key={stat.title}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.note}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="cards">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>You have 3 unread messages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: 'Your call has been confirmed.', time: '1 hour ago' },
                        { title: 'You have a new message!', time: '2 hours ago' },
                        { title: 'Your subscription is expiring soon!', time: '3 hours ago' },
                      ].map((notification, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <span className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Check className="mr-2 h-4 w-4" />
                        Mark all as read
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Share this document</CardTitle>
                      <CardDescription>Anyone with the link can view this document.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input value="https://example.com/share/abc123" readOnly />
                        <Button variant="secondary">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">People with access</h4>
                        {[
                          { name: 'Olivia Martin', email: 'm@example.com', access: 'can-edit' },
                          { name: 'Isabella Nguyen', email: 'b@example.com', access: 'can-view' },
                        ].map((person, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{person.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{person.name}</p>
                                <p className="text-sm text-muted-foreground">{person.email}</p>
                              </div>
                            </div>
                            <Select defaultValue={person.access}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="can-edit">Can edit</SelectItem>
                                <SelectItem value="can-view">Can view</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="authentication">
                <div className="max-w-md mx-auto">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle>Create an account</CardTitle>
                      <CardDescription>Enter your email below to create your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                      <Button className="w-full">Create account</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Section>

          {/* ============================ UI PRIMITIVES ============================ */}

          <Section title="Buttons">
            <div className="space-y-6">
              <Sub title="Variants">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </Sub>
              <Sub title="Sizes">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
              </Sub>
              <Sub title="States">
                <div className="flex flex-wrap gap-4 items-center">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </Sub>
              <Sub title="Button Group">
                <ButtonGroup>
                  <Button variant="outline" size="icon"><Bold className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><Italic className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><Underline className="h-4 w-4" /></Button>
                  <ButtonGroupSeparator />
                  <Button variant="outline">Clear</Button>
                </ButtonGroup>
              </Sub>
              <Sub title="Button with Tooltip">
                <ButtonWithTooltip tooltip="Open settings" size="icon">
                  <Settings className="h-4 w-4" />
                </ButtonWithTooltip>
              </Sub>
            </div>
          </Section>

          <Section title="Badges">
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          <Section title="Alerts">
            <div className="space-y-4 max-w-2xl">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>You can add components to your app using the cli.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
              </Alert>
            </div>
          </Section>

          <Section title="Form Elements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Input</h4>
                <div className="space-y-2">
                  <Label htmlFor="default-input">Default</Label>
                  <Input id="default-input" placeholder="Enter text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled-input">Disabled</Label>
                  <Input id="disabled-input" placeholder="Disabled" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-input">File</Label>
                  <Input id="file-input" type="file" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Textarea</h4>
                <div className="space-y-2">
                  <Label htmlFor="textarea">Message</Label>
                  <Textarea id="textarea" placeholder="Type your message here..." />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Select</h4>
                <div className="space-y-2">
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
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Checkbox &amp; Switch</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms-form" />
                  <Label htmlFor="terms-form">Accept terms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="marketing" defaultChecked />
                  <Label htmlFor="marketing">Marketing emails</Label>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center space-x-2">
                  <Switch id="airplane" />
                  <Label htmlFor="airplane">Airplane Mode</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Slider</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Default</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Range</Label>
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium">Search Input</h4>
                <SearchInput value={searchValue} onChange={setSearchValue} />
              </div>
            </div>
          </Section>

          <Section title="Toggle">
            <div className="space-y-6">
              <Sub title="Single Toggle">
                <div className="flex gap-4">
                  <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
                  <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
                  <Toggle aria-label="Toggle underline"><Underline className="h-4 w-4" /></Toggle>
                </div>
              </Sub>
              <Sub title="Toggle Group">
                <ToggleGroup type="single" defaultValue="center">
                  <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
              </Sub>
            </div>
          </Section>

          <Section title="Accordion">
            <Accordion type="single" collapsible className="max-w-2xl">
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
            <div className="flex flex-wrap gap-4 items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="dialog-name" className="text-right">Name</Label>
                      <Input id="dialog-name" defaultValue="John Doe" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
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
                    <Settings className="mr-2 h-4 w-4" />
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
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="width">Width</Label>
                      <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                    </div>
                  </div>
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
                <HoverCardContent className="w-80">
                  <h4 className="text-sm font-semibold">@invana</h4>
                  <p className="text-sm text-muted-foreground">
                    The open-source graph visualization and analytics platform.
                  </p>
                  <div className="flex items-center pt-2 text-xs text-muted-foreground">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Joined December 2021
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </Section>

          <Section title="Menus — Dropdown, Menubar, Navigation Menu, Command">
            <div className="space-y-8">
              <Sub title="Dropdown Menu">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Menu className="mr-2 h-4 w-4" />
                      Open Menu
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
                    <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /><span>Billing</span></DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
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
                        <ul className="grid w-[420px] gap-2 p-4 md:grid-cols-2">
                          <li>
                            <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                              <div className="font-medium">Graph Explorer</div>
                              <p className="text-sm text-muted-foreground">Visualize and traverse your graph data.</p>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                              <div className="font-medium">Dashboards</div>
                              <p className="text-sm text-muted-foreground">Build and share live dashboards.</p>
                            </NavigationMenuLink>
                          </li>
                        </ul>
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
            </div>
          </Section>

          <Section title="Navigation — Breadcrumb & Pagination">
            <div className="space-y-8">
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
            </div>
          </Section>

          <Section title="Feedback — Progress, Spinner, Skeleton, Toast">
            <div className="space-y-8 max-w-xl">
              <Sub title="Progress">
                <Progress value={60} />
              </Sub>
              <Sub title="Spinner">
                <div className="flex items-center gap-6 text-primary">
                  <Spinner className="size-4" />
                  <Spinner className="size-6" />
                  <Spinner className="size-8" />
                </div>
              </Sub>
              <Sub title="Skeleton">
                <div className="flex w-[320px] flex-col gap-4 rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[160px]" />
                      <Skeleton className="h-3 w-[100px]" />
                    </div>
                  </div>
                  <Skeleton className="h-32 w-full rounded-md" />
                </div>
              </Sub>
              <Sub title="Toast (Sonner)">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => toast('Event has been created')}>Show toast</Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success('Changes saved', { description: 'Your profile has been updated.' })}
                  >
                    Success toast
                  </Button>
                </div>
              </Sub>
            </div>
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
                <Button variant="ghost" size="icon"><ChevronRight /></Button>
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
            <Carousel className="w-full max-w-xs" opts={{ align: 'start' }}>
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index} className="basis-full">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </Section>

          <Section title="Resizable Panels">
            <div className="h-72 w-full max-w-3xl">
              <ResizablePanelGroup orientation="horizontal" className="rounded-md border">
                <ResizablePanel defaultSize={50} minSize={20}>
                  <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Left Panel</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={20}>
                  <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize={50}>
                      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Top</div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50}>
                      <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">Bottom</div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </Section>

          <Section title="Table">
            <div className="max-w-4xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
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
                      <TableCell className="font-medium">{row.invoice}</TableCell>
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
            </div>
          </Section>

          <Section title="Avatar">
            <div className="flex gap-4 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
            </div>
          </Section>

          {/* ============================ TYPOGRAPHY ============================ */}

          <Section title="Typography">
            <div className="space-y-4 max-w-3xl">
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
              <div className="flex flex-wrap items-center gap-4">
                <Typography.Large>Large text</Typography.Large>
                <Typography.Small>Small text</Typography.Small>
                <Typography.Muted>Muted text</Typography.Muted>
                <Typography.Code>npm install @invana/ui</Typography.Code>
              </div>
              <Typography.Pre>{`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}</Typography.Pre>
            </div>
          </Section>

          {/* ============================ UI EXTENDED ============================ */}

          <Section title="Navigation Shells">
            <div className="space-y-8">
              <Sub title="Nav Horizontal">
                <NavHorizontal
                  className="h-12 rounded-md border bg-card px-3 text-card-foreground"
                  left={<span className="mr-2 font-semibold">Invana</span>}
                  leftNavItems={[
                    { name: 'Home', label: 'Home', icon: Home, onClick: () => {} },
                    { name: 'Apps', label: 'Apps', icon: LayoutGrid, href: '#apps' },
                  ]}
                  rightNavItems={[
                    { name: 'Notifications', icon: Bell, onClick: () => {} },
                    { name: 'Profile', icon: User, href: '#profile' },
                  ]}
                />
              </Sub>

              <Sub title="Nav Vertical">
                <div className="h-[320px] w-[45px] rounded-md border bg-card text-card-foreground">
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
                </div>
              </Sub>

              <Sub title="Nav Base">
                <NavBase
                  orientation="horizontal"
                  className="h-12 rounded-md border bg-card px-3 text-card-foreground"
                  sections={{
                    start: { content: <span className="font-semibold">Invana</span> },
                    center: { content: <span className="text-sm text-muted-foreground">Dashboard</span> },
                    end: { content: <span className="text-sm">Sign out</span> },
                  }}
                />
              </Sub>
            </div>
          </Section>

          <Section title="Menus (Extended) — Menu Item & Nested Menu">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <Sub title="Menu Item">
                <ul className="w-[240px] rounded-md border bg-card p-1 text-card-foreground">
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
              className="w-full max-w-2xl h-[320px]"
              defaultTab="tab1"
              tabs={[
                { value: 'tab1', label: 'Overview', content: <div className="p-4 text-sm">Content for the Overview tab.</div> },
                { value: 'tab2', label: 'Details', content: <div className="p-4 text-sm">Content for the Details tab.</div> },
                { value: 'tab3', label: 'Activity', content: <div className="p-4 text-sm">Content for the Activity tab.</div> },
              ]}
            />
          </Section>

          <Section title="Panel Content">
            <div className="h-[320px] w-[360px] rounded-md border">
              <PanelContent
                titleText="Panel title"
                showClose
                onClose={() => {}}
                footerContent={
                  <div className="flex w-full justify-end gap-2">
                    <Button variant="ghost" size="sm">Cancel</Button>
                    <Button size="sm">Save</Button>
                  </div>
                }
              >
                <p className="text-sm text-muted-foreground">
                  Panel body content goes here. The header and footer stay fixed while the body scrolls.
                </p>
              </PanelContent>
            </div>
          </Section>

          <Section title="Toolbar">
            <Toolbar />
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
                <div className="h-48 w-full rounded-md border">
                  <UnderDevelopment
                    title="Under Development"
                    description="This feature is currently being built."
                  />
                </div>
              </Sub>
              <Sub title="Error Boundary">
                <div className="h-48 w-full rounded-md border">
                  <ErrorBoundary>
                    <BrokenComponent />
                  </ErrorBoundary>
                </div>
              </Sub>
            </div>
          </Section>

          {/* ============================ PACKAGES ============================ */}

          <Section title="Data Tables (@invana/tables)">
            <p className="text-sm text-muted-foreground mb-4">
              Editable, paginated TanStack-based data table. Double-click a cell to edit.
            </p>
            <ShowcaseDataTable />
          </Section>

          <Section title="Forms (@invana/forms)">
            <p className="text-sm text-muted-foreground mb-4">
              <code>FormField.ObjectField</code> driven by a field config, with grouped fields
              auto-wrapped in an accordion. Consumers own <code>useForm</code>.
            </p>
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
                <div key={color.name} className="space-y-2">
                  <div className={`h-16 rounded-md flex items-center justify-center text-xs ${color.class} ${color.textClass}`}>
                    {color.name}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{color.class}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Footer */}
          <footer className="border-t pt-8 pb-16 text-center text-muted-foreground">
            <p className="text-sm">
              Built with <Heart className="inline-block h-4 w-4 text-destructive" /> using @invana/ui components
            </p>
            <p className="text-sm mt-2">
              Inspired by{' '}
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                shadcn/ui
              </a>
            </p>
          </footer>
        </main>
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
};
