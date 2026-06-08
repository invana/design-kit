import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@invana/ui';

const meta: Meta<typeof NavigationMenu> = {
  title: 'UI/UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[420px] gap-2 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                  <div className="font-medium">Graph Explorer</div>
                  <p className="text-sm text-muted-foreground">
                    Visualize and traverse your graph data.
                  </p>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                  <div className="font-medium">Dashboards</div>
                  <p className="text-sm text-muted-foreground">
                    Build interactive analytics views.
                  </p>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[260px] gap-2 p-4">
              <li>
                <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                  Documentation
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                  API Reference
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink className="block rounded-md p-3 hover:bg-accent hover:text-accent-foreground">
                  Community
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="#"
            className={navigationMenuTriggerStyle()}
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
