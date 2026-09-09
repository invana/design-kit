import { cva, type VariantProps } from "class-variance-authority"
import { Construction } from 'lucide-react'
import { cn } from "../../lib/utils"


const underDevelopmentVariants = cva(
  "flex flex-col items-center justify-center h-full gap-4",
  {
    variants: {
      size: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface UnderDevelopmentProps
  extends VariantProps<typeof underDevelopmentVariants> {
  title?: string
  description?: string
  iconSize?: number
  className?: string
}

export function UnderDevelopment({
  title = "Under Development",
  description = "This feature is currently being built.",
  iconSize = 48,
  size,
  className = '',
}: UnderDevelopmentProps) {
  return (
    <div className={cn(underDevelopmentVariants({ size }), "text-center", className)}>
      <Construction size={iconSize} className="text-primary" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground max-w-md">{description}</p>
      <span className="mt-4 px-3 py-1 bg-yellow-100 text-yellow-800">
        Coming Soon
      </span>
    </div>
  )
}