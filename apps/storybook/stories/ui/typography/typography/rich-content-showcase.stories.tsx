import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@invana/ui';

const meta: Meta<typeof Typography.H1> = {
  title: 'UI/Typography/Typography',
  component: Typography.H1,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography components for consistent text styling across your application.',
      },
    },
  },
  // tags: ['autodocs'],
};


/**
 * Main page heading - largest and most prominent heading.
 */

export default meta;
type Story = StoryObj<typeof meta>;

export const RichContentShowcase: Story = {
  render: () => (
    <div className="max-w-4xl space-y-8">
      {/* Technical Documentation Section */}
      <section className="space-y-4">
        <Typography.H1>
          Getting Started with React Components
        </Typography.H1>
        
        <Typography.Lead>
          Build modern, accessible user interfaces with our comprehensive component library.
          This guide will walk you through installation, configuration, and best practices.
        </Typography.Lead>
        
        <Typography.H2>
          Installation
        </Typography.H2>
        
        <Typography.P>
          To get started, install the package using your preferred package manager:
        </Typography.P>
        
        <Typography.Code>
          npm install @invana/ui
        </Typography.Code>
        
        <Typography.Muted>
          Note: Node.js version 18.0.0 or higher is required.
        </Typography.Muted>
      </section>

      {/* Product Feature Section */}
      <section className="space-y-4">
        <Typography.H2>
          Key Features
        </Typography.H2>
        
        <Typography.Large>
          Everything you need to build modern applications
        </Typography.Large>
        
        <Typography.List>
          <li><strong>Fully Accessible</strong> - WCAG 2.1 compliant components</li>
          <li><strong>Customizable</strong> - Tailwind CSS powered theming system</li>
          <li><strong>TypeScript First</strong> - Complete type safety out of the box</li>
          <li><strong>Tree Shakeable</strong> - Import only what you need</li>
          <li><strong>Dark Mode</strong> - Built-in support for light and dark themes</li>
        </Typography.List>
        
        <Typography.H3>
          Performance Optimized
        </Typography.H3>
        
        <Typography.P>
          Our components are designed with performance in mind. Each component is optimized 
          for minimal bundle size and maximum runtime efficiency. With lazy loading support 
          and efficient re-rendering strategies, your applications will stay fast even as 
          they grow.
        </Typography.P>
        
        <Typography.Blockquote>
          "The best design system I've used. It's fast, flexible, and the developer 
          experience is outstanding. Migration took less than a day for our entire application."
          — Sarah Chen, Engineering Lead at TechCorp
        </Typography.Blockquote>
      </section>

      {/* Blog Article Section */}
      <section className="space-y-4">
        <Typography.H2>
          Design System Best Practices
        </Typography.H2>
        
        <Typography.Muted>
          Published on December 22, 2025 • 8 min read
        </Typography.Muted>
        
        <Typography.P>
          Building a scalable design system requires careful planning and consistent execution. 
          In this article, we'll explore key principles that have helped teams maintain 
          coherence across large applications.
        </Typography.P>
        
        <Typography.H3>
          1. Establish Clear Naming Conventions
        </Typography.H3>
        
        <Typography.P>
          Consistent naming makes your components predictable and easy to discover. Use 
          descriptive names that clearly communicate purpose, like <Typography.Code>SearchInput</Typography.Code> instead 
          of <Typography.Code>Input2</Typography.Code>.
        </Typography.P>
        
        <Typography.H4>
          Component Naming Strategy
        </Typography.H4>
        
        <Typography.List>
          <li>Use PascalCase for component names</li>
          <li>Prefix composed components (e.g., CardHeader, CardContent)</li>
          <li>Suffix variants with descriptive terms (e.g., ButtonPrimary, ButtonOutline)</li>
        </Typography.List>
        
        <Typography.H3>
          2. Document Everything
        </Typography.H3>
        
        <Typography.P>
          Good documentation is the foundation of a successful design system. Each component 
          should have clear usage examples, prop definitions, and accessibility guidelines.
        </Typography.P>
        
        <Typography.H4>
          Essential Documentation Elements
        </Typography.H4>
        
        <Typography.P>
          Every component page should include: interactive examples, code snippets, 
          accessibility notes, and common use cases. This helps developers understand 
          not just how to use a component, but when to use it.
        </Typography.P>
        
        <Typography.H5>
          Interactive Examples
        </Typography.H5>
        
        <Typography.Small>
          TIP: Live demos with editable code
        </Typography.Small>
        
        <Typography.P>
          Interactive examples allow developers to experiment with different props and 
          see results in real-time. Tools like Storybook make this process seamless.
        </Typography.P>
        
        <Typography.H5>
          Code Snippets
        </Typography.H5>
        
        <Typography.P>
          Provide ready-to-use code snippets that developers can copy and paste directly 
          into their projects. Include common patterns and edge cases.
        </Typography.P>
        
        <Typography.H6>
          Additional Resources
        </Typography.H6>
        
        <Typography.Muted>
          Check out our GitHub repository for more examples and community contributions.
        </Typography.Muted>
      </section>

      {/* Marketing/Landing Page Section */}
      <section className="space-y-4">
        <Typography.H1>
          Build Better Products, Faster
        </Typography.H1>
        
        <Typography.Large>
          Join thousands of developers who trust Invana UI for their next project
        </Typography.Large>
        
        <Typography.P>
          Whether you're building a startup MVP or an enterprise application, our 
          component library scales with your needs. Start shipping features today, 
          not fighting with UI inconsistencies.
        </Typography.P>
        
        <div className="grid grid-cols-3 gap-4 py-6">
          <div className="space-y-2">
            <Typography.H3>50K+</Typography.H3>
            <Typography.Small>Weekly Downloads</Typography.Small>
          </div>
          <div className="space-y-2">
            <Typography.H3>99.8%</Typography.H3>
            <Typography.Small>Uptime SLA</Typography.Small>
          </div>
          <div className="space-y-2">
            <Typography.H3>24/7</Typography.H3>
            <Typography.Small>Support Available</Typography.Small>
          </div>
        </div>
        
        <Typography.Blockquote>
          Start building today. No credit card required.
        </Typography.Blockquote>
      </section>

      {/* Error/Warning Messages Section */}
      <section className="space-y-4">
        <Typography.H2>
          System Messages
        </Typography.H2>
        
        <div className="space-y-3">
          <div className="border-l-4 border-destructive pl-4">
            <Typography.H4>Error: Connection Failed</Typography.H4>
            <Typography.P>
              Unable to connect to the server. Please check your internet connection and try again.
            </Typography.P>
            <Typography.Small>Error Code: NET_001</Typography.Small>
          </div>
          
          <div className="border-l-4 border-accent pl-4">
            <Typography.H4>Warning: Unsaved Changes</Typography.H4>
            <Typography.P>
              You have unsaved changes. Are you sure you want to leave this page?
            </Typography.P>
          </div>
          
          <div className="border-l-4 border-primary pl-4">
            <Typography.H4>Success: Profile Updated</Typography.H4>
            <Typography.P>
              Your profile has been successfully updated with the new information.
            </Typography.P>
          </div>
          
          <div className="border-l-4 border-ring pl-4">
            <Typography.H4>Info: New Features Available</Typography.H4>
            <Typography.P>
              We've released new features to improve your experience. Check out the changelog for details.
            </Typography.P>
          </div>
        </div>
      </section>

      {/* Mixed Content Section */}
      <section className="space-y-4">
        <Typography.H2>
          Typography Hierarchy Demonstration
        </Typography.H2>
        
        <Typography.P>
          This section demonstrates how different heading levels work together to create 
          a clear content hierarchy. Proper use of headings improves both readability 
          and accessibility.
        </Typography.P>
        
        <Typography.H3>
          Primary Section (H3)
        </Typography.H3>
        <Typography.Lead>
          Lead text introduces the section with slightly larger, more prominent text.
        </Typography.Lead>
        
        <Typography.H4>
          Subsection (H4)
        </Typography.H4>
        <Typography.P>
          Regular paragraph text provides detailed information. It should be easy to read 
          with appropriate line height and spacing.
        </Typography.P>
        
        <Typography.H5>
          Minor Section (H5)
        </Typography.H5>
        <Typography.Small>
          Small text for supplementary information or labels.
        </Typography.Small>
        
        <Typography.H6>
          Detail Section (H6)
        </Typography.H6>
        <Typography.Muted>
          Muted text for less important, secondary information that provides context.
        </Typography.Muted>
      </section>
    </div>
  ),
};

/**
 * Inline text styling utilities for emphasis and formatting within paragraphs.
 */
