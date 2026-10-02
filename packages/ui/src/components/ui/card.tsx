import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-surface border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-3", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none  tracking-tight ", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(" text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-3 flex-1 overflow-y-auto", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-3 ", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

interface CardWithHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  footer?: React.ReactNode;
}

const CardWithHeader = React.forwardRef<HTMLDivElement, CardWithHeaderProps>(
  ({ className, title, description, headerClassName, contentClassName, footerClassName, footer, children, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <CardHeader className={`${headerClassName} rounded-t-surface`}>
        {typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title}
        {description && (typeof description === 'string' ? <CardDescription>{description}</CardDescription> : description)}
      </CardHeader>
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
)
CardWithHeader.displayName = "CardWithHeader"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardWithHeader }
