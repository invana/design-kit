import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen } from 'storybook/test';
import { AppLayoutV2 } from '@invana/themes/app-v2/layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  RichSelect,
  Separator,
} from '@invana/ui';
import { Bot, Database, Hexagon, House, Plus } from 'lucide-react';

const meta: Meta = {
  title: 'Themes/AppV2/Header',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const PRODUCTS = [
  { value: 'explore', label: 'Explore', description: 'Query and see the graph on boards' },
  { value: 'model', label: 'Model', description: 'Shape the ontology: models, links, rules' },
];

const GRAPHS = [
  { value: 'airways', label: 'airways', kind: 'neo4j', description: 'neo4j · Explore' },
  { value: 'finance', label: 'finance', kind: 'memgraph', description: 'memgraph · Model' },
];

function HeaderLeft({
  product,
  setProduct,
  graph,
  setGraph,
}: {
  product: string;
  setProduct: (next: string) => void;
  graph: string;
  setGraph: (next: string) => void;
}) {
  const crumbs = ['AirRoutes'];
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 px-2 font-bold">
        <a href="#home" aria-label="Invana, Home">
          <Hexagon className="text-primary" />
          Invana
        </a>
      </Button>
      <Separator orientation="vertical" className="h-4" />
      <RichSelect
        appearance="inline"
        triggerAriaLabel="Product"
        triggerClassName="h-control-sm font-semibold"
        value={product}
        placeholder="Product"
        options={PRODUCTS}
        onChange={(next) => setProduct(next as string)}
      />
      <Separator orientation="vertical" className="h-4" />
      <span className="flex items-center gap-1 text-base font-normal">
        <RichSelect
          appearance="inline"
          label="Graph"
          triggerAriaLabel="Graph"
          triggerIcon={Database}
          triggerClassName="h-control-sm"
          value={graph}
          renderValue={([picked]) => (
            <>
              <span className="font-semibold">{picked?.label}</span>
              <span className="text-sm text-muted-foreground">{GRAPHS.find((g) => g.value === graph)?.kind}</span>
            </>
          )}
          options={GRAPHS.map(({ value, label, description }) => ({ value, label, description }))}
          onChange={(next) => setGraph(next as string)}
          actions={[
            { id: 'home', label: 'All Graphs on Home', icon: House, onSelect: () => {} },
            { id: 'new', label: 'New Graph…', icon: Plus, onSelect: () => {} },
          ]}
        />
      </span>
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap gap-1.5 sm:gap-1.5">
          {crumbs.map((label, i) => (
            <BreadcrumbItem key={label} className="gap-1.5 whitespace-nowrap">
              <BreadcrumbSeparator />
              {i === crumbs.length - 1 ? <BreadcrumbPage className="font-semibold">{label}</BreadcrumbPage> : <span>{label}</span>}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function Demo() {
  const [product, setProduct] = React.useState('model');
  const [graph, setGraph] = React.useState('airways');
  return (
    <div className="h-[200px]">
      <AppLayoutV2
        header={{
          className: '!h-[45px] px-2',
          left: <HeaderLeft product={product} setProduct={setProduct} graph={graph} setGraph={setGraph} />,
          right: (
            <Button variant="outline" size="sm" className="text-primary">
              <Bot />
              Assistant
            </Button>
          ),
        }}
        mainSection={{ content: <div className="p-4 text-sm text-muted-foreground">{`${product} · ${graph}`}</div> }}
      />
    </div>
  );
}

/**
 * The app header as Studio ships it, on `AppLayoutV2`'s `header` region: Invana (a ghost link to
 * Home with the hexagon), a rule, the product as an inline `RichSelect` whose options carry a
 * description, a rule, the Graph as an inline `RichSelect` with its database kind and the
 * All Graphs · New Graph… actions, then the breadcrumb ending in the open page. The Assistant
 * button sits at the right.
 */
export const Header: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('The product dropdown names the open product', async () => {
      await expect(canvas.getByRole('combobox', { name: 'Product' })).toHaveTextContent('Model');
      await expect(canvas.getByText('AirRoutes')).toHaveAttribute('aria-current', 'page');
    });
    await step('Picking another product changes it', async () => {
      await userEvent.click(canvas.getByRole('combobox', { name: 'Product' }));
      await userEvent.click(await screen.findByText('Explore'));
      await expect(canvas.getByRole('combobox', { name: 'Product' })).toHaveTextContent('Explore');
    });
  },
};
