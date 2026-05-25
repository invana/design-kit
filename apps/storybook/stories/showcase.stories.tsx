import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { ThemeControls, useThemeControls } from '../src';
import type { ThemeVariant } from '@invana/styling/themes.config';
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
  ScrollArea,
  SearchInput,
  TreeView,
  type TreeItem,
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
} from '@invana/forms';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  ChevronDown,
  CreditCard,
  Settings,
  User,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Calendar,
  Folder,
  File,
  Star,
  Heart,
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Copy,
  MoreHorizontal,
  ArrowRight,
} from 'lucide-react';

const meta = {
  title: 'Showcase',
  parameters: {
    layout: 'fullscreen',
  },
  // // tags: ['autodocs'],
} satisfies Meta;


// Sample tree data
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

// Theme controls are now imported from the reusable component

// Main Showcase Component
const ThemeShowcase = ({ 
  storybookTheme = 'default', 
  storybookVariant = 'light' 
}: { 
  storybookTheme?: string; 
  storybookVariant?: string;
}) => {
  const [searchValue, setSearchValue] = useState('');
  
  // Use the reusable theme controls hook
  const { 
    currentVariant, 
    accentStyles, 
    currentTheme,
    setCurrentTheme,
    currentAccent,
    setCurrentAccent,
    isDarkMode,
    setIsDarkMode,
  } = useThemeControls(
    storybookTheme,
    storybookVariant
  );

  return (
    <TooltipProvider>
      <div 
        className="transition-colors duration-300" 
        style={accentStyles}
      >
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
              The Foundation for your Design System
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A set of beautifully designed components that you can customize, extend, and build on.
              Start here then make it your own.
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

          <Separator />

          {/* Dashboard Example Cards */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Dashboard Components</h3>
            <Tabs defaultValue="examples" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
              </TabsList>

              <TabsContent value="examples">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Payment Method Card */}
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
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="month">Month</Label>
                          <Select>
                            <SelectTrigger id="month">
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                  {String(i + 1).padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">Year</Label>
                          <Select>
                            <SelectTrigger id="year">
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem key={i} value={String(2024 + i)}>
                                  {2024 + i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Continue</Button>
                    </CardFooter>
                  </Card>

                  {/* Team Members Card */}
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
                      <CardDescription>
                        Invite your team to collaborate on this project.
                      </CardDescription>
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

                  {/* Appearance Settings Card */}
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
                          <p className="text-sm text-muted-foreground">
                            Send notifications to device.
                          </p>
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
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">I agree to the terms and conditions</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231.89</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                      <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+2,350</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
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
                          { name: 'Olivia Martin', email: 'm@example.com', access: 'Can edit' },
                          { name: 'Isabella Nguyen', email: 'b@example.com', access: 'Can view' },
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
                            <Select defaultValue={person.access.toLowerCase().replace(' ', '-')}>
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
                      <CardDescription>
                        Enter your email below to create your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">
                          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline">
                          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          GitHub
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
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
                      <p className="text-sm text-muted-foreground text-center">
                        By clicking continue, you agree to our{' '}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <Separator />

          {/* Buttons Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Buttons</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Variants</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Sizes</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">With Icons</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Login with Email
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button variant="secondary">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">States</h4>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Badges Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Badges</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </section>

          <Separator />

          {/* Alerts Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Alerts</h3>
            <div className="space-y-4 max-w-2xl">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          <Separator />

          {/* Form Elements Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Form Elements</h3>
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
                <h4 className="text-lg font-medium">Checkbox & Switch</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms</Label>
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
          </section>

          <Separator />

          {/* Toggle & Toggle Group Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Toggle</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Single Toggle</h4>
                <div className="flex gap-4">
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </Toggle>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-4">Toggle Group</h4>
                <ToggleGroup type="single" defaultValue="center">
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </section>

          <Separator />

          {/* Accordion Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Accordion</h3>
            <Accordion type="single" collapsible className="max-w-2xl">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that match the other components' aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <Separator />

          {/* Dialog Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Dialog</h3>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" defaultValue="John Doe" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">
                        Username
                      </Label>
                      <Input id="username" defaultValue="@johndoe" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </section>

          <Separator />

          {/* Dropdown Menu Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Dropdown Menu</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="mr-2 h-4 w-4" />
                  Open Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>

          <Separator />

          {/* Popover & Tooltip Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Popover & Tooltip</h3>
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-sm text-muted-foreground">
                        Set the dimensions for the layer.
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="height">Height</Label>
                        <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                      </div>
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
            </div>
          </section>

          <Separator />

          {/* Table Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Table</h3>
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
                    { invoice: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
                    { invoice: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
                  ].map((row) => (
                    <TableRow key={row.invoice}>
                      <TableCell className="font-medium">{row.invoice}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.status === 'Paid'
                              ? 'default'
                              : row.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
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
          </section>

          <Separator />

          {/* Avatar Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Avatar</h3>
            <div className="flex gap-4 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
            </div>
          </section>

          <Separator />

          {/* Tree View Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Tree View</h3>
            <TreeView items={treeItems} searchable />
          </section>

          <Separator />

          {/* Color Palette Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Color System</h3>
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
                  <div
                    className={`h-16 rounded-md flex items-center justify-center text-xs ${color.class} ${color.textClass}`}
                  >
                    {color.name}
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{color.class}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t pt-8 pb-16 text-center text-muted-foreground">
            <p className="text-sm">
              Built with{' '}
              <Heart className="inline-block h-4 w-4 text-destructive" />{' '}
              using @invana/ui components
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

/**
 * Interactive theme showcase demonstrating all @invana/ui components with theme switching.
 * Use the Storybook toolbar to switch between themes and variants (light/dark).
 * You can also use the color circles in the header to change themes and the sun/moon toggle for light/dark mode.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: (args, context) => (
    <ThemeShowcase 
      storybookTheme={context.globals.theme} 
      storybookVariant={context.globals.variant}
    />
  ),
};
