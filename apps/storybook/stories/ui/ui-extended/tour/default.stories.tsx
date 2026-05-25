import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tour, useTour, type TourStep } from '@invana/ui';

const meta: Meta<typeof Tour> = {
  title: 'UI/UI Extended/Tour',
  component: Tour,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const steps: TourStep[] = [
  {
    id: 'overview',
    title: 'Service Overview',
    body: 'Welcome to the codebase tour. Each step walks through a service, why it exists, and the files that implement it. Use Prev / Next to move between steps.',
  },
  {
    id: 'product-catalog',
    title: 'Product Catalog Service',
    body: 'The product catalog is one of the most depended-upon services in the system, referenced by the frontend, checkout, and recommendation services. It implements ListProducts, GetProduct, and SearchProducts RPCs, reading product data from a JSON file.',
    callout: {
      label: 'Language Lesson',
      content:
        "Go's struct embedding and interface satisfaction are on display here: the productCatalog struct implements the generated gRPC server interface without explicit declaration.",
    },
    references: {
      label: 'Referenced Components',
      items: [
        { label: 'server.go' },
        { label: 'product_catalog.go' },
        { label: 'catalog_loader.go' },
      ],
    },
  },
  {
    id: 'cart',
    title: 'Cart Service',
    body: 'The cart service stores items added to a shopping cart, backed by an in-memory or Redis store depending on configuration.',
    references: {
      label: 'Referenced Components',
      items: [{ label: 'cart.go' }, { label: 'redis_store.go' }],
    },
  },
];

/**
 * The standard step-through tour panel: a label badge + step counter + exit in
 * the header, a title, body copy, an accented callout, and a row of reference
 * chips, with Prev / Next controls. Driven by the `useTour` controller.
 */
export const Default: Story = {
  render: () => {
    const tour = useTour({
      steps,
      onExit: () => alert('Tour exited'),
      onComplete: () => alert('Tour complete!'),
    });
    return <Tour controller={tour} />;
  },
};
